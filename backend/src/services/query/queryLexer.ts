import { LexedLine, QueryLexerResult } from './types.js';

class QueryLexer {
    async lexQuery(query: string): Promise<QueryLexerResult> {
        const lines: LexedLine[] = [];
        const rawLines = query.split('\n');
        for (let i = 0; i < rawLines.length; i++) {
            const text = rawLines[i]!.trim();
            if (text.length > 0) {
                lines.push({ text, lineNumber: i + 1 });
            }
        }
        return { lines };
    }
}

const queryLexer = new QueryLexer();
export default queryLexer;
