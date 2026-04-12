import { create, all } from 'mathjs';
import QueryContext from './queryContext.js';
import { QueryExecutionError } from './error.js';

/**
 * Scoped mathjs instance.
 *
 * We use `create(all)` to get the full function set, then immediately lock the
 * config so callers cannot mutate precision or number type at runtime.  Only
 * the numeric subset of mathjs is reachable — there is no `import`, `eval`, or
 * any I/O function in the scope we pass to `evaluate`.
 */
const math = create(all);
math.config({ number: 'number' });

/**
 * Functions exposed inside CALCULATE expressions.
 * Anything not listed here is unreachable from user scripts.
 */
const ALLOWED_FUNCTIONS: Record<string, unknown> = {
    sqrt: math.sqrt,
    abs: math.abs,
    round: math.round,
    floor: math.floor,
    ceil: math.ceil,
    log: math.log,
    log10: math.log10,
    log2: math.log2,
    exp: math.exp,
    pow: math.pow,
    min: math.min,
    max: math.max,
    mod: math.mod,
    sign: math.sign,
    pi: math.pi,
    e: math.e,
};

export class ExpressionParser {
    readonly source: string;

    constructor(source: string) {
        this.source = source.trim();
    }

    /**
     * Validates the expression is syntactically correct.
     * Returns `this` so callers can chain: `new ExpressionParser(src).parse()`.
     * The returned value is passed straight to `evaluateExpression`.
     */
    parse(): ExpressionParser {
        if (this.source.length === 0) {
            throw new Error('Expression is empty');
        }
        try {
            math.parse(this.source);
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            throw new Error(`Invalid expression: ${msg}`);
        }
        return this;
    }
}

export function evaluateExpression(
    expr: ExpressionParser,
    context: QueryContext,
    lineNumber: number
): number {
    const scope: Record<string, unknown> = { ...ALLOWED_FUNCTIONS };

    for (const [name, variable] of Object.entries(context.variables)) {
        scope[name] = variable.value as number;
    }

    const tree = math.parse(expr.source);
    tree.traverse((node) => {
        if (node.type === 'SymbolNode') {
            const name = (node as unknown as { name: string }).name;
            if (!(name in scope)) {
                throw new QueryExecutionError(
                    `Undefined variable: ${name}`,
                    lineNumber
                );
            }
        }
    });

    let result: unknown;
    try {
        result = math.evaluate(expr.source, scope);
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        throw new QueryExecutionError(msg, lineNumber);
    }

    if (typeof result !== 'number') {
        throw new QueryExecutionError(
            `Expression did not produce a number`,
            lineNumber
        );
    }

    if (!Number.isFinite(result)) {
        throw new QueryExecutionError('Division by zero', lineNumber);
    }

    return result;
}
