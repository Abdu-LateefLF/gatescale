import { test, expect } from "@jest/globals";
import queryParser from "../../../../src/services/query/queryParser";
import { CommandType } from "../../../../src/services/query/types";
import { QueryParseError } from "../../../../src/services/query/error";

test.each([
    ['sEt income = 100', CommandType.SET],
    ['calculate total = income * 2', CommandType.CALCULATE],
    ['analyze health using savings, income', CommandType.ANALYZE],
    ['forecast future using principal, rate for 2 years', CommandType.FORECAST],
    ['score rating using savings, income', CommandType.SCORE],
    ['assert income > 0', CommandType.ASSERT],
    ['output income', CommandType.OUTPUT]
])('parses %s with its original line number', async (text, type) => {
    const { commands } = await queryParser.parseQuery([{
        text,
        lineNumber: 5
    }]);

    expect(commands).toHaveLength(1);
    expect(commands[0]).toMatchObject({
        type,
        lineNumber: 5
    });
});

test.each([
    'UNKNOWN x',
    'SET',
    'CALCULATE x = 2 +'
])('rejects invalid statements with their line number', async (text) => {
    const parse = queryParser.parseQuery([{
        text,
        lineNumber: 8
    }]);

    await expect(parse).rejects.toThrow(QueryParseError);
    await expect(parse).rejects.toMatchObject({ lineNumber: 8 });
});

test('rejects multiple OUTPUT statements at the second OUTPUT line', async () => {
    await expect(queryParser.parseQuery([
        {
            text: 'OUTPUT income',
            lineNumber: 2
        }, {
            text: 'OUTPUT income',
            lineNumber: 6
        }
    ])).rejects.toMatchObject({
        message: 'Only one OUTPUT statement is allowed',
        lineNumber: 6
    });
});

test('rejects OUTPUT before the final statement', async () => {
    await expect(queryParser.parseQuery([
        {
            text: 'OUTPUT income',
            lineNumber: 2
        }, {
            text: 'SET income = 100',
            lineNumber: 4
        }
    ])).rejects.toMatchObject({
        message: 'OUTPUT must be the final statement',
        lineNumber: 2
    });
});

test('allows a query without OUTPUT', async () => {
    expect((await queryParser.parseQuery([{
        text: 'SET income = 100',
        lineNumber: 1
    }])).commands).toHaveLength(1);
});
