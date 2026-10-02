import { test, expect } from "@jest/globals";
import queryLexer from "../../../../src/services/query/queryLexer";

test('trims statements and preserves line numbers through blank lines', async () => {
    const result = await queryLexer.lexQuery('\n  SET income = 100\r\n \n OUTPUT income  \n');

    expect(result.lines).toEqual([
        {
            text: 'SET income = 100',
            lineNumber: 2
        },
        {
            text: 'OUTPUT income',
            lineNumber: 4
        }
    ]);
});

test.each([
    '',
    ' \n\t\n'
])('returns no lines for an empty query', async (query) => {
    expect(await queryLexer.lexQuery(query)).toEqual({ lines: [] });
});
