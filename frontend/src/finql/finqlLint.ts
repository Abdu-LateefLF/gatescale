import type { EditorView } from '@codemirror/view';
import type { Diagnostic } from '@codemirror/lint';
import { FINQL_LINE_COMMANDS } from './finqlCommands';

type NonEmptyLineInfo = {
    contentStart: number;
    firstTokenEnd: number;
    firstToken: string;
    keywordUpper: string;
};

function collectNonEmptyLines(view: EditorView): NonEmptyLineInfo[] {
    const lines: NonEmptyLineInfo[] = [];
    const { doc } = view.state;

    for (let lineIndex = 1; lineIndex <= doc.lines; lineIndex++) {
        const line = doc.line(lineIndex);
        const trimmed = line.text.trim();
        if (!trimmed) continue;

        const leadingWhitespace =
            line.text.length - line.text.trimStart().length;
        const contentStart = line.from + leadingWhitespace;
        const firstTokenMatch = trimmed.match(/^\S+/);
        const firstToken = firstTokenMatch?.[0] ?? '';
        const firstTokenEnd = contentStart + firstToken.length;

        lines.push({
            contentStart,
            firstTokenEnd,
            firstToken,
            keywordUpper: firstToken.toUpperCase(),
        });
    }

    return lines;
}

/**
 * Lightweight FinQL checks aligned with backend parser rules (keywords + OUTPUT placement).
 * Deeper parse errors still surface when you run the query.
 */
export function finqlLint(view: EditorView): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];
    const nonEmptyLines = collectNonEmptyLines(view);

    for (const lineInfo of nonEmptyLines) {
        if (!FINQL_LINE_COMMANDS.has(lineInfo.keywordUpper)) {
            const displayToken = lineInfo.firstToken || '(empty)';
            diagnostics.push({
                from: lineInfo.contentStart,
                to: Math.max(lineInfo.firstTokenEnd, lineInfo.contentStart + 1),
                severity: 'error',
                message: `"${displayToken}" is not a valid command. Use SET, CALCULATE, ANALYZE, FORECAST, SCORE, ASSERT, or OUTPUT.`,
            });
        }
    }

    const outputLines = nonEmptyLines
        .map((lineInfo, index) => ({ lineInfo, commandIndex: index }))
        .filter(({ lineInfo }) => lineInfo.keywordUpper === 'OUTPUT');

    if (outputLines.length > 1) {
        for (let outputIndex = 1; outputIndex < outputLines.length; outputIndex++) {
            const { lineInfo } = outputLines[outputIndex]!;
            diagnostics.push({
                from: lineInfo.contentStart,
                to: lineInfo.firstTokenEnd,
                severity: 'error',
                message: 'Only one OUTPUT statement is allowed.',
            });
        }
    }

    if (outputLines.length === 1) {
        const lastCommand = nonEmptyLines[nonEmptyLines.length - 1];
        const onlyOutput = outputLines[0]!.lineInfo;
        if (lastCommand && lastCommand !== onlyOutput) {
            diagnostics.push({
                from: onlyOutput.contentStart,
                to: onlyOutput.firstTokenEnd,
                severity: 'error',
                message: 'OUTPUT must be the final statement.',
            });
        }
    }

    return diagnostics;
}
