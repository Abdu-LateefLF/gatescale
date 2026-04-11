const RESERVED = new Set([
    'SET',
    'CALCULATE',
    'ANALYZE',
    'USING',
    'OUTPUT',
]);

export function isReservedKeyword(name: string): boolean {
    return RESERVED.has(name.toUpperCase());
}
