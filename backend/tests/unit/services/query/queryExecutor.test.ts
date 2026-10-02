import { jest, test, expect, afterEach } from "@jest/globals";
import QueryExecutor from "../../../../src/services/query/queryExecutor";
import CalculateCommand from "../../../../src/services/query/commands/calculate";

afterEach(() => {
    jest.restoreAllMocks();
});

test('executes a complete script in order', async () => {
    const result = await new QueryExecutor().executeQuery([
        'SET income = 100',
        'SET savings = 20',
        'SET rate = 0.1',
        'CALCULATE balance = income - savings',
        'ANALYZE health USING savings, income',
        'SCORE rating USING savings, income',
        'FORECAST future USING income, rate FOR 2 YEARS',
        'ASSERT balance == 80',
        'OUTPUT balance, health, rating, future'
    ].join('\n'));

    expect(result.results).toEqual({
        balance: 80,
        health: 'Strong',
        rating: 20,
        future: 121
    });
    expect(result.executionTimeMs).toBeGreaterThanOrEqual(0);
});

test('does not execute later commands after a failed assertion', async () => {
    const execute = jest.spyOn(CalculateCommand.prototype, 'execute');

    await expect(new QueryExecutor().executeQuery('ASSERT 1 > 2\nCALCULATE x = 2\nOUTPUT x')).rejects.toMatchObject({ lineNumber: 1 });
    expect(execute).not.toHaveBeenCalled();
});

test('does not leak variables between executions', async () => {
    const executor = new QueryExecutor();

    await executor.executeQuery('SET income = 100\nOUTPUT income');

    await expect(executor.executeQuery('OUTPUT income')).rejects.toThrow('Undefined variable: income');
});

test('preserves error line numbers through blank lines', async () => {
    await expect(new QueryExecutor().executeQuery('\nSET income = 100\n\nCALCULATE x = missing')).rejects.toMatchObject({ lineNumber: 4 });
});

test.each([
    '',
    'SET income = 100'
])('returns empty results without OUTPUT', async (query) => {
    expect((await new QueryExecutor().executeQuery(query)).results).toEqual({});
});
