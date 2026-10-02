import { jest, test, expect, afterEach } from "@jest/globals";
import { calculateResetTimeByDayEnd } from "../../../src/utils/ratelimit";

afterEach(() => {
    jest.useRealTimers();
});

test.each([
    ['2026-01-01T12:00:00Z', 60, '2026-01-01T12:01:00Z'],
    ['2026-01-01T23:59:30Z', 60, '2026-01-02T00:00:00Z'],
    ['2026-01-01T00:00:00Z', 86400, '2026-01-02T00:00:00Z'],
    ['2026-01-01T12:00:00Z', 0, '2026-01-01T12:00:00Z']
])('calculates reset at %s with ttl %i', (now, ttl, expected) => {
    jest.useFakeTimers().setSystemTime(new Date(now));

    expect(calculateResetTimeByDayEnd(ttl)).toBe(new Date(expected).getTime() / 1000);
});
