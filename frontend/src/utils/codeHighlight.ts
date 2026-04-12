export type CodeLang = 'finql' | 'json' | 'http';

// ── Tokyo Night palette ──────────────────────────────────────────────────────
export const C = {
    base: '#c0caf5',
    keyword: '#bb9af7',
    identifier: '#7dcfff',
    number: '#ff9e64',
    string: '#9ece6a',
    operator: '#89ddff',
    method: '#7aa2f7',
    url: '#73daca',
    version: '#565f89',
    headerKey: '#7dcfff',
    headerVal: '#9ece6a',
    boolean: '#ff9e64',
    punctuation: '#89ddff',
} as const;

export type Token = { text: string; color: string };

function span(text: string, color: string): Token {
    return { text, color };
}

// ── FinQL ────────────────────────────────────────────────────────────────────
/** Commands that must appear as the first token on a line. */
const FINQL_LINE_KEYWORDS = new Set([
    'SET',
    'CALCULATE',
    'ANALYZE',
    'FORECAST',
    'SCORE',
    'ASSERT',
    'USING',
    'FOR',
    'YEARS',
    'OUTPUT',
]);

/** Built-in math functions and constants available anywhere in an expression. */
const FINQL_BUILTINS = new Set([
    'sqrt',
    'abs',
    'round',
    'floor',
    'ceil',
    'log',
    'log10',
    'log2',
    'exp',
    'pow',
    'min',
    'max',
    'mod',
    'sign',
    'pi',
    'e',
]);

function tokenizeFinql(source: string): Token[] {
    const tokens: Token[] = [];
    for (const line of source.split('\n')) {
        const parts = line.split(/(\s+|=|,|\+|-|\*|\/|\^|\(|\))/);
        let firstWord = true;
        for (const part of parts) {
            if (part === '') continue;
            if (/^\s+$/.test(part)) {
                tokens.push(span(part, C.base));
            } else if (FINQL_LINE_KEYWORDS.has(part.toUpperCase()) && firstWord) {
                tokens.push(span(part, C.keyword));
                firstWord = false;
            } else if (FINQL_BUILTINS.has(part)) {
                tokens.push(span(part, C.method));
                if (firstWord) firstWord = false;
            } else if (/^[=,+\-*/^()]$/.test(part)) {
                tokens.push(span(part, C.operator));
            } else if (/^-?\d+(\.\d+)?$/.test(part)) {
                tokens.push(span(part, C.number));
            } else if (/^".*"$/.test(part)) {
                tokens.push(span(part, C.string));
            } else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(part)) {
                tokens.push(span(part, C.identifier));
            } else {
                tokens.push(span(part, C.base));
            }
        }
        tokens.push(span('\n', C.base));
    }
    if (tokens.at(-1)?.text === '\n') tokens.pop();
    return tokens;
}

// ── JSON ─────────────────────────────────────────────────────────────────────
function tokenizeJson(source: string): Token[] {
    const tokens: Token[] = [];
    const re =
        /("(?:[^"\\]|\\.)*")|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|(\btrue\b|\bfalse\b|\bnull\b)|([{}[\],:])|(\s+)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let prevNonSpace: string | null = null;

    while ((match = re.exec(source)) !== null) {
        if (match.index > lastIndex) {
            tokens.push(span(source.slice(lastIndex, match.index), C.base));
        }
        const [full, str, num, bool, punct, ws] = match;
        if (ws) {
            tokens.push(span(ws, C.base));
        } else if (str) {
            const isKey =
                prevNonSpace === '{' ||
                prevNonSpace === ',' ||
                prevNonSpace === null;
            tokens.push(span(str, isKey ? C.identifier : C.string));
            prevNonSpace = str;
        } else if (num) {
            tokens.push(span(num, C.number));
            prevNonSpace = num;
        } else if (bool) {
            tokens.push(span(bool, C.boolean));
            prevNonSpace = bool;
        } else if (punct) {
            tokens.push(span(full, C.punctuation));
            prevNonSpace = full;
        }
        lastIndex = re.lastIndex;
    }
    if (lastIndex < source.length) {
        tokens.push(span(source.slice(lastIndex), C.base));
    }
    return tokens;
}

// ── HTTP ─────────────────────────────────────────────────────────────────────
function tokenizeHttp(source: string): Token[] {
    const tokens: Token[] = [];
    const lines = source.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (i === 0) {
            const m = line.match(/^([A-Z]+)(\s+)(\S+)(\s+)(.+)?$/);
            if (m) {
                tokens.push(span(m[1], C.method));
                tokens.push(span(m[2], C.base));
                tokens.push(span(m[3], C.url));
                if (m[4] && m[5]) {
                    tokens.push(span(m[4], C.base));
                    tokens.push(span(m[5], C.version));
                }
            } else {
                tokens.push(span(line, C.base));
            }
        } else if (line.includes(':') && !line.trimStart().startsWith('{')) {
            const colonIdx = line.indexOf(':');
            tokens.push(span(line.slice(0, colonIdx), C.headerKey));
            tokens.push(span(':', C.punctuation));
            tokens.push(span(line.slice(colonIdx + 1), C.headerVal));
        } else if (
            line.trim().startsWith('{') ||
            line.trim().startsWith('}') ||
            line.trim().startsWith('"')
        ) {
            tokenizeJson(line).forEach((t) => tokens.push(t));
        } else {
            tokens.push(span(line, C.base));
        }

        if (i < lines.length - 1) tokens.push(span('\n', C.base));
    }
    return tokens;
}

// ── Dispatch ─────────────────────────────────────────────────────────────────
export function tokenize(source: string, lang: CodeLang): Token[] {
    switch (lang) {
        case 'finql':
            return tokenizeFinql(source);
        case 'json':
            return tokenizeJson(source);
        case 'http':
            return tokenizeHttp(source);
    }
}
