import { QueryExecutionError } from './error.js';
import { Variable } from './types.js';

class QueryContext {
    variables: Record<string, Variable> = {};

    hasVariable(name: string): boolean {
        return this.variables[name] !== undefined;
    }

    getVariable(name: string, lineNumber?: number): Variable {
        if (!this.variables[name]) {
            throw new QueryExecutionError(`Undefined variable: ${name}`, lineNumber);
        }
        return this.variables[name]!;
    }

    setVariable(name: string, value: Variable): void {
        this.variables[name] = value;
    }
}

export default QueryContext;
