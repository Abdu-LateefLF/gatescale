import QueryContext from './queryContext';
import { Expression } from './types';
import { QueryExecutionError } from './error';

const IDENT_START = /[a-zA-Z]/;
const IDENT_PART = /[a-zA-Z0-9_]/;

export class ExpressionParser {
    private readonly source: string;
    private i = 0;

    constructor(source: string) {
        this.source = source.trim();
    }

    parse(): Expression {
        if (this.source.length === 0) {
            throw new Error('Expression is empty');
        }
        const e = this.parseExpr();
        this.skipSpaces();
        if (this.i < this.source.length) {
            throw new Error(`Unexpected character "${this.source[this.i]}"`);
        }
        return e;
    }

    private parseExpr(): Expression {
        let left = this.parseTerm();
        while (true) {
            this.skipSpaces();
            const c = this.peek();
            if (c === '+') {
                this.i++;
                left = {
                    kind: 'binary',
                    op: '+',
                    left,
                    right: this.parseTerm(),
                };
            } else if (c === '-') {
                this.i++;
                left = {
                    kind: 'binary',
                    op: '-',
                    left,
                    right: this.parseTerm(),
                };
            } else {
                break;
            }
        }
        return left;
    }

    private parseTerm(): Expression {
        let left = this.parseFactor();
        while (true) {
            this.skipSpaces();
            const c = this.peek();
            if (c === '*') {
                this.i++;
                left = {
                    kind: 'binary',
                    op: '*',
                    left,
                    right: this.parseFactor(),
                };
            } else if (c === '/') {
                this.i++;
                left = {
                    kind: 'binary',
                    op: '/',
                    left,
                    right: this.parseFactor(),
                };
            } else {
                break;
            }
        }
        return left;
    }

    private parseFactor(): Expression {
        this.skipSpaces();
        const c = this.peek();
        if (c === undefined) {
            throw new Error('Unexpected end of expression');
        }
        if (this.isDigit(c) || c === '.') {
            return this.parseNumber();
        }
        if (IDENT_START.test(c)) {
            return this.parseIdentifier();
        }
        throw new Error(`Unexpected character "${c}"`);
    }

    private parseNumber(): Expression {
        const start = this.i;

        while (this.isDigit(this.peek() ?? '')) {
            this.i++;
        }

        if (this.peek() === '.') {
            this.i++;

            if (!this.isDigit(this.peek() ?? '')) {
                throw new Error('Invalid number');
            }

            while (this.isDigit(this.peek() ?? '')) {
                this.i++;
            }
        }

        const raw = this.source.slice(start, this.i);
        const value = Number(raw);

        if (!Number.isFinite(value)) {
            throw new Error('Invalid number');
        }
        return { kind: 'number', value };
    }

    private parseIdentifier(): Expression {
        const start = this.i;
        this.i++;

        while (IDENT_PART.test(this.peek() ?? '')) {
            this.i++;
        }

        const name = this.source.slice(start, this.i);
        return { kind: 'ident', name };
    }

    private skipSpaces(): void {
        while (this.i < this.source.length && /\s/.test(this.source[this.i]!)) {
            this.i++;
        }
    }

    private peek(): string | undefined {
        return this.source[this.i];
    }

    private isDigit(c: string): boolean {
        return c >= '0' && c <= '9';
    }
}

export function evaluateExpression(
    expr: Expression,
    context: QueryContext,
    lineNumber: number
): number {
    switch (expr.kind) {
        case 'number':
            return expr.value;
        case 'ident': {
            const v = context.getVariable(expr.name, lineNumber);
            if (v.type !== 'number') {
                throw new QueryExecutionError(
                    `Variable ${expr.name} is not a number`,
                    lineNumber
                );
            }

            return v.value as number;
        }
        case 'binary': {
            const a = evaluateExpression(expr.left, context, lineNumber);
            const b = evaluateExpression(expr.right, context, lineNumber);

            switch (expr.op) {
                case '+':
                    return a + b;
                case '-':
                    return a - b;
                case '*':
                    return a * b;
                case '/':
                    if (b === 0) {
                        throw new QueryExecutionError(
                            'Division by zero',
                            lineNumber
                        );
                    }
                    return a / b;
            }
        }
    }
}
