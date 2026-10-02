import { describe, test, expect } from "@jest/globals";
import { ExpressionParser, evaluateExpression } from "../../../../src/services/query/expression";
import QueryContext from "../../../../src/services/query/queryContext";
import { QueryExecutionError } from "../../../../src/services/query/error";

const context = new QueryContext();
context.setVariable('income', {
    name: 'income',
    type: 'number',
    value: 100
});

describe('expressions', () => {
    test.each([
        ['2 + 3 * 4', 14],
        ['(2 + 3) * 4', 20],
        ['income / 4', 25],
        ['sqrt(16) + abs(-2)', 6],
        ['round(2.6)', 3],
        ['min(3, 7) + max(3, 7)', 10],
        ['pi', Math.PI]
    ])('evaluates %s', (source, expected) => {
        const result = evaluateExpression(new ExpressionParser(source).parse(), context, 3);

        expect(result).toBeCloseTo(expected);
    });

    test.each([
        '',
        '   ',
        '2 +',
        '(2 + 3'
    ])('rejects malformed expression %s', (source) => {
        expect(() => new ExpressionParser(source).parse()).toThrow();
    });

    test.each([
        'missing + 1',
        'sin(0)',
        'import("x")',
        'evaluate("2 + 2")',
        '1 / 0',
        '0 / 0',
        '"hello"',
        '[1, 2]',
        '2 > 1'
    ])('rejects invalid result or unsupported expression %s', (source) => {
        const evaluate = () => evaluateExpression(new ExpressionParser(source).parse(), context, 7);

        expect(evaluate).toThrow(QueryExecutionError);
        expect(evaluate).toThrow(expect.objectContaining({ lineNumber: 7 }));
    });
});
