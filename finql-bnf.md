# FinQL v1.1 — Grammar & Design Notes

## Design principles

- Line-based: one command per line
- Sequential execution, no loops or blocks
- Case-insensitive keywords, case-sensitive variable names
- Stateless per request

---

## Program structure

```ebnf
PROGRAM   ::= STATEMENT+
STATEMENT ::= SET_STMT | CALC_STMT | ANALYZE_STMT | FORECAST_STMT
            | SCORE_STMT | ASSERT_STMT | OUTPUT_STMT
```

Blank lines are ignored.

---

## Commands

```ebnf
SET_STMT      ::= "SET" IDENTIFIER "=" LITERAL
CALC_STMT     ::= "CALCULATE" IDENTIFIER "=" EXPRESSION
ANALYZE_STMT  ::= "ANALYZE" IDENTIFIER "USING" IDENTIFIER_LIST
FORECAST_STMT ::= "FORECAST" IDENTIFIER "USING" IDENTIFIER_LIST "FOR" NUMBER "YEARS"
SCORE_STMT    ::= "SCORE" IDENTIFIER "USING" IDENTIFIER_LIST
ASSERT_STMT   ::= "ASSERT" EXPRESSION COMPARE_OP EXPRESSION
OUTPUT_STMT   ::= "OUTPUT" IDENTIFIER_LIST

IDENTIFIER_LIST ::= IDENTIFIER ("," IDENTIFIER)*
COMPARE_OP      ::= ">" | "<" | ">=" | "<=" | "==" | "!="
```

---

## Expressions

Expressions are evaluated by [mathjs](https://mathjs.org). The full operator set is available:

```
+ - * / ^ ( )
```

Allowed built-ins: `sqrt` `abs` `round` `floor` `ceil` `log` `log10` `log2` `exp` `pow` `min` `max` `mod` `sign` `pi` `e`

No arbitrary function calls beyond the above allowlist.

---

## Identifiers & literals

```ebnf
IDENTIFIER ::= LETTER (LETTER | DIGIT | "_")*
LITERAL    ::= NUMBER | STRING | BOOLEAN
NUMBER     ::= DIGIT+ ("." DIGIT+)?
STRING     ::= '"' .* '"'
BOOLEAN    ::= "true" | "false"
```

---

## Reserved keywords (case-insensitive)

`SET` `CALCULATE` `ANALYZE` `FORECAST` `SCORE` `ASSERT` `USING` `FOR` `YEARS` `OUTPUT`

---

## Semantic rules

1. Variables must be defined before use
2. Division by zero throws a runtime error
3. `ASSERT` halts execution with a structured error if the condition is false
4. `OUTPUT` must appear exactly once and must be the last statement
5. Variable names cannot be reserved keywords

---

## Example

```finql
SET income = 6000
SET expenses = 4500
SET rate = 0.05
CALCULATE surplus = income - expenses
CALCULATE savingsRate = surplus / income
ANALYZE health USING surplus, income
SCORE stability USING surplus, income
FORECAST growth USING surplus, rate FOR 3 YEARS
ASSERT surplus > 0
OUTPUT surplus, savingsRate, health, stability, growth
```
