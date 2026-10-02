import { describe, test, expect, beforeEach } from "@jest/globals";
import QueryContext from "../../../../src/services/query/queryContext";
import SetCommand from "../../../../src/services/query/commands/set";
import CalculateCommand from "../../../../src/services/query/commands/calculate";
import AnalyzeCommand from "../../../../src/services/query/commands/analyze";
import ScoreCommand from "../../../../src/services/query/commands/score";
import ForecastCommand from "../../../../src/services/query/commands/forecast";
import AssertCommand from "../../../../src/services/query/commands/assert";
import OutputCommand from "../../../../src/services/query/commands/output";
import { QueryExecutionError, QueryParseError } from "../../../../src/services/query/error";

let context: QueryContext;

beforeEach(() => {
    context = new QueryContext();

    context.setVariable('income', {
        name: 'income',
        type: 'number',
        value: 100
    });
    context.setVariable('savings', {
        name: 'savings',
        type: 'number',
        value: 20
    });
    context.setVariable('rate', {
        name: 'rate',
        type: 'number',
        value: 0.1
    });
    context.setVariable('text', {
        name: 'text',
        type: 'string',
        value: 'hello'
    });
    context.setVariable('zero', {
        name: 'zero',
        type: 'number',
        value: 0
    });
});

describe('SET', () => {
    test.each([
        ['12', 12, 'number'],
        ['12.5', 12.5, 'number'],
        ['"hello"', 'hello', 'string'],
        ['""', '', 'string'],
        ['TRUE', true, 'boolean'],
        ['false', false, 'boolean']
    ])('sets a literal %s and its type', async (literal, value, type) => {
        const command = new SetCommand();

        command.parse(`SET income = ${literal}`, 3);
        await command.execute(context);

        expect(context.getVariable('income')).toEqual({
            name: 'income',
            value,
            type
        });
    });

    test.each([
        'SET 1x = 1',
        'SET OUTPUT = 1',
        'SET x ='
    ])('rejects invalid syntax %s', (line) => {
        expect(() => new SetCommand().parse(line, 3)).toThrow(QueryParseError);
    });

    test.each([
        '"unterminated',
        'unknown',
        '1 + 2'
    ])('rejects invalid literal %s', async (literal) => {
        const command = new SetCommand();

        command.parse(`SET x = ${literal}`, 3);

        await expect(command.execute(context)).rejects.toMatchObject({ lineNumber: 3 });
        expect(context.hasVariable('x')).toBe(false);
    });
});

describe('CALCULATE', () => {
    test('uses existing variables and overwrites the destination', async () => {
        const command = new CalculateCommand();

        command.parse('CALCULATE income = income - savings', 3);
        await command.execute(context);

        expect(context.getVariable('income')).toMatchObject({
            value: 80,
            type: 'number'
        });
    });

    test.each([
        'CALCULATE OUTPUT = 1',
        'CALCULATE 1x = 2',
        'CALCULATE x = 2 +'
    ])('rejects invalid syntax %s', (line) => {
        expect(() => new CalculateCommand().parse(line, 3)).toThrow(QueryParseError);
    });
});

describe('ANALYZE', () => {
    test.each([
        [0.099, 'At Risk'],
        [0.1, 'Stable'],
        [0.101, 'Stable'],
        [0.199, 'Stable'],
        [0.2, 'Strong'],
        [0.201, 'Strong']
    ])('classifies savings rate %f as %s', async (rate, label) => {
        context.setVariable('rate', {
            name: 'rate',
            type: 'number',
            value: rate
        });
        const command = new AnalyzeCommand();

        command.parse('ANALYZE health USING rate', 3);
        await command.execute(context);

        expect(context.getVariable('health')).toMatchObject({
            value: label,
            type: 'string'
        });
    });

    test('calculates a savings rate from numerator and denominator', async () => {
        const command = new AnalyzeCommand();

        command.parse('ANALYZE health USING savings, income', 3);
        await command.execute(context);

        expect(context.getVariable('health').value).toBe('Strong');
    });
});

describe('SCORE', () => {
    test.each([
        [20, 100, 20],
        [1, 3, 33],
        [-20, 100, 0],
        [150, 100, 100]
    ])('scores %f / %f as %i', async (numerator, denominator, expected) => {
        context.setVariable('savings', {
            name: 'savings',
            type: 'number',
            value: numerator
        });
        context.setVariable('income', {
            name: 'income',
            type: 'number',
            value: denominator
        });
        const command = new ScoreCommand();

        command.parse('SCORE rating USING savings, income', 3);
        await command.execute(context);

        expect(context.getVariable('rating')).toMatchObject({
            value: expected,
            type: 'number'
        });
    });
});

describe('FORECAST', () => {
    test.each([
        [0.1, 2, 121],
        [0, 2, 100],
        [0.1, 0.5, 104.88]
    ])('forecasts with rate %f for %f years', async (rate, years, expected) => {
        context.setVariable('rate', {
            name: 'rate',
            type: 'number',
            value: rate
        });
        const command = new ForecastCommand();

        command.parse(`FORECAST future USING income, rate FOR ${years} YEARS`, 3);
        await command.execute(context);

        expect(context.getVariable('future')).toMatchObject({
            value: expected,
            type: 'number'
        });
    });

    test.each([
        '0',
        '-1'
    ])('rejects %s years', (years) => {
        expect(() => new ForecastCommand().parse(`FORECAST future USING income, rate FOR ${years} YEARS`, 3)).toThrow(QueryParseError);
    });

    test('rejects an overflowing forecast instead of storing infinity', async () => {
        const command = new ForecastCommand();

        command.parse('FORECAST future USING income, rate FOR 100000 YEARS', 3);

        await expect(command.execute(context)).rejects.toThrow(QueryExecutionError);
        expect(context.hasVariable('future')).toBe(false);
    });
});

describe('numeric command errors', () => {
    test.each([
        [AnalyzeCommand, 'ANALYZE result USING missing'],
        [AnalyzeCommand, 'ANALYZE result USING text'],
        [AnalyzeCommand, 'ANALYZE result USING text, income'],
        [AnalyzeCommand, 'ANALYZE result USING savings, text'],
        [AnalyzeCommand, 'ANALYZE result USING savings, zero'],
        [ScoreCommand, 'SCORE result USING missing, income'],
        [ScoreCommand, 'SCORE result USING text, income'],
        [ScoreCommand, 'SCORE result USING savings, text'],
        [ScoreCommand, 'SCORE result USING savings, zero'],
        [ForecastCommand, 'FORECAST result USING missing, rate FOR 2 YEARS'],
        [ForecastCommand, 'FORECAST result USING text, rate FOR 2 YEARS'],
        [ForecastCommand, 'FORECAST result USING income, text FOR 2 YEARS'],
        [CalculateCommand, 'CALCULATE result = missing + 1']
    ])('rejects %s: %s with the line number', async (Command, line) => {
        const command = new Command();

        command.parse(line, 9);
        const execution = command.execute(context);

        await expect(execution).rejects.toThrow(QueryExecutionError);
        await expect(execution).rejects.toMatchObject({ lineNumber: 9 });
        expect(context.hasVariable('result')).toBe(false);
    });

    test.each([
        [AnalyzeCommand, 'ANALYZE result USING'],
        [ScoreCommand, 'SCORE result USING income'],
        [ForecastCommand, 'FORECAST result USING income FOR 2 YEARS']
    ])('rejects insufficient inputs for %s', (Command, line) => {
        expect(() => new Command().parse(line, 9)).toThrow(QueryParseError);
    });
});

describe('ASSERT', () => {
    test.each([
        '2 > 1',
        '1 < 2',
        '2 >= 2',
        '2 <= 2',
        '2 == 2',
        '2 != 1',
        'income - savings == 80'
    ])('accepts %s', async (expression) => {
        const command = new AssertCommand();

        command.parse(`ASSERT ${expression}`, 3);

        await expect(command.execute(context)).resolves.toBeUndefined();
    });

    test.each([
        '1 > 1',
        '1 < 1',
        '1 >= 2',
        '2 <= 1',
        '1 == 2',
        '1 != 1'
    ])('rejects false assertion %s', async (expression) => {
        const command = new AssertCommand();

        command.parse(`ASSERT ${expression}`, 3);

        await expect(command.execute(context)).rejects.toMatchObject({
            message: `Assertion failed: ${expression}`,
            lineNumber: 3
        });
    });

    test.each([
        'ASSERT',
        'ASSERT 1 + 2',
        'ASSERT 1 = 2'
    ])('rejects invalid syntax %s', (line) => {
        expect(() => new AssertCommand().parse(line, 3)).toThrow(QueryParseError);
    });

    test.each([
        ['missing > 1', 'left-hand side'],
        ['1 < missing', 'right-hand side']
    ])('reports the failing side for %s', async (expression, side) => {
        const command = new AssertCommand();

        command.parse(`ASSERT ${expression}`, 3);

        await expect(command.execute(context)).rejects.toThrow(side);
    });
});

describe('OUTPUT', () => {
    test('returns only the selected values', async () => {
        const command = new OutputCommand();

        command.parse('OUTPUT income, text', 3);

        expect(await command.execute(context)).toEqual({
            income: 100,
            text: 'hello'
        });
    });

    test('rejects an undefined variable with its line number', async () => {
        const command = new OutputCommand();

        command.parse('OUTPUT missing', 3);

        await expect(command.execute(context)).rejects.toMatchObject({ lineNumber: 3 });
    });

    test.each([
        'OUTPUT',
        'OUTPUT ,',
        'OUTPUT 1x',
        'OUTPUT SET'
    ])('rejects invalid syntax %s', (line) => {
        expect(() => new OutputCommand().parse(line, 3)).toThrow(QueryParseError);
    });
});
