/** First token on a non-empty line must be one of these (FinQL). */
export const FINQL_LINE_COMMANDS = new Set([
    'SET',
    'CALCULATE',
    'ANALYZE',
    'FORECAST',
    'SCORE',
    'ASSERT',
    'OUTPUT',
]);
