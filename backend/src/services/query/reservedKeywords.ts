const RESERVED = new Set([
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

export function isReservedKeyword(name: string): boolean {
    return RESERVED.has(name.toUpperCase());
}
