import { RangeSetBuilder } from '@codemirror/state';
import type { Extension, Text } from '@codemirror/state';
import {
    Decoration,
    type DecorationSet,
    EditorView,
    ViewPlugin,
    type PluginValue,
    type ViewUpdate,
} from '@codemirror/view';
import { linter, lintGutter } from '@codemirror/lint';
import { FINQL_LINE_COMMANDS } from './finqlCommands';
import { finqlLint } from './finqlLint';

/** Sub-keywords inside a line (e.g. `ANALYZE … USING …`, `FORECAST … FOR … YEARS`). */
const FINQL_INLINE_KEYWORDS = /\b(USING|FOR|YEARS)\b/gi;

/** Built-in math functions and constants available in expressions. */
const FINQL_BUILTINS =
    /\b(sqrt|abs|round|floor|ceil|log10|log2|log|exp|pow|min|max|mod|sign|pi)\b/g;

const FINQL_BOOLEAN = /\b(true|false)\b/gi;

const FINQL_NUMBER = /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/g;

const HIGHLIGHT_PRIORITY = {
    lineCommand: 5,
    inlineKeyword: 4,
    builtin: 3,
    boolean: 2,
    number: 1,
} as const;

type HighlightInterval = {
    from: number;
    to: number;
    priority: number;
    decoration: Decoration;
};

const DECO = {
    lineCommand: Decoration.mark({ class: 'cm-finql-line-command' }),
    inlineKeyword: Decoration.mark({ class: 'cm-finql-inline-keyword' }),
    builtin: Decoration.mark({ class: 'cm-finql-builtin' }),
    boolean: Decoration.mark({ class: 'cm-finql-boolean' }),
    number: Decoration.mark({ class: 'cm-finql-number' }),
};

/**
 * Theme + token classes for the FinQL editor. Adjust colors here only.
 */
export const finqlEditorTheme = EditorView.theme({
    '&': {
        fontSize: 13,
    },
    '.cm-editor': {
        borderRadius: 4,
        border: '1px solid rgba(0, 0, 0, 0.23)',
    },
    '.cm-editor.cm-focused': {
        borderColor: '#1976d2',
        borderWidth: 2,
    },
    '.cm-scroller': {
        fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        minHeight: 'inherit',
    },
    '.cm-focused': {
        outline: 'none',
    },
    '.cm-gutters': {
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
    },
    '.cm-finql-line-command': {
        color: '#1565c0',
        fontWeight: 600,
    },
    '.cm-finql-inline-keyword': {
        color: '#00695c',
        fontWeight: 600,
    },
    '.cm-finql-boolean': {
        color: '#6a1b9a',
    },
    '.cm-finql-builtin': {
        color: '#00838f',
        fontWeight: 500,
    },
    '.cm-finql-number': {
        color: '#c62828',
    },
});

function addRegexIntervals(
    lineFrom: number,
    lineText: string,
    regexp: RegExp,
    priority: number,
    decoration: Decoration,
    into: HighlightInterval[]
): void {
    regexp.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regexp.exec(lineText)) !== null) {
        const start = lineFrom + match.index;
        into.push({
            from: start,
            to: start + match[0].length,
            priority,
            decoration,
        });
    }
}

function collectHighlightIntervals(document: Text): HighlightInterval[] {
    const intervals: HighlightInterval[] = [];

    for (let lineIndex = 1; lineIndex <= document.lines; lineIndex++) {
        const line = document.line(lineIndex);
        const text = line.text;
        const trimmed = text.trim();
        if (!trimmed) continue;

        const leadingWhitespace = text.length - text.trimStart().length;
        const contentStart = line.from + leadingWhitespace;
        const firstTokenMatch = trimmed.match(/^\S+/);
        const firstToken = firstTokenMatch?.[0] ?? '';
        const firstTokenEnd = contentStart + firstToken.length;

        if (FINQL_LINE_COMMANDS.has(firstToken.toUpperCase())) {
            intervals.push({
                from: contentStart,
                to: firstTokenEnd,
                priority: HIGHLIGHT_PRIORITY.lineCommand,
                decoration: DECO.lineCommand,
            });
        }

        addRegexIntervals(
            line.from,
            text,
            FINQL_INLINE_KEYWORDS,
            HIGHLIGHT_PRIORITY.inlineKeyword,
            DECO.inlineKeyword,
            intervals
        );
        addRegexIntervals(
            line.from,
            text,
            FINQL_BUILTINS,
            HIGHLIGHT_PRIORITY.builtin,
            DECO.builtin,
            intervals
        );
        addRegexIntervals(
            line.from,
            text,
            FINQL_BOOLEAN,
            HIGHLIGHT_PRIORITY.boolean,
            DECO.boolean,
            intervals
        );
        addRegexIntervals(
            line.from,
            text,
            FINQL_NUMBER,
            HIGHLIGHT_PRIORITY.number,
            DECO.number,
            intervals
        );
    }

    intervals.sort((intervalA, intervalB) => {
        if (intervalB.priority !== intervalA.priority) {
            return intervalB.priority - intervalA.priority;
        }
        if (intervalA.from !== intervalB.from) {
            return intervalA.from - intervalB.from;
        }
        return intervalA.to - intervalB.to;
    });

    const nonOverlapping: HighlightInterval[] = [];
    for (const current of intervals) {
        const hasOverlap = nonOverlapping.some(
            (kept) => current.from < kept.to && current.to > kept.from
        );
        if (!hasOverlap) {
            nonOverlapping.push(current);
        }
    }

    nonOverlapping.sort(
        (intervalA, intervalB) => intervalA.from - intervalB.from
    );
    return nonOverlapping;
}

function buildFinqlDecorationSet(view: EditorView): DecorationSet {
    const intervals = collectHighlightIntervals(view.state.doc);
    const builder = new RangeSetBuilder<Decoration>();
    for (const { from, to, decoration } of intervals) {
        builder.add(from, to, decoration);
    }
    return builder.finish();
}

class FinqlHighlightView implements PluginValue {
    decorations: DecorationSet;

    constructor(view: EditorView) {
        this.decorations = buildFinqlDecorationSet(view);
    }

    update(update: ViewUpdate) {
        if (update.docChanged) {
            this.decorations = buildFinqlDecorationSet(update.view);
        }
    }
}

const finqlHighlightPlugin = ViewPlugin.fromClass(FinqlHighlightView, {
    decorations: (value: FinqlHighlightView) => value.decorations,
});

/**
 * CodeMirror extensions for the FinQL playground editor (lint, theme, highlights).
 * Line numbers and undo come from @uiw/react-codemirror default `basicSetup`.
 */
export const finqlCodemirrorExtensions: Extension[] = [
    lintGutter(),
    linter(finqlLint, { delay: 350 }),
    finqlHighlightPlugin,
    EditorView.lineWrapping,
    finqlEditorTheme,
];
