# FinQL

A lightweight, line-based DSL for financial computation. Scripts run sequentially, are stateless per request, and are designed as a clean upgrade path to ML-powered analysis.

---

## Quick example

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

```json
{
    "results": {
        "surplus": 1500,
        "savingsRate": 0.25,
        "health": "Strong",
        "stability": 25,
        "growth": 1736.44
    },
    "executionTimeMs": 14
}
```

---

## Commands

| Command | Syntax | Description |
| ------- | ------ | ----------- |
| `SET` | `SET name = literal` | Assign a number, boolean, or quoted string |
| `CALCULATE` | `CALCULATE name = expression` | Evaluate a math expression (see below) |
| `ANALYZE` | `ANALYZE name USING a, b` | Rule-based label: **Strong / Stable / At Risk** from savings rate |
| `FORECAST` | `FORECAST name USING principal, rate FOR n YEARS` | Compound growth: `principal × (1 + rate)^n`, rounded to 2 dp |
| `SCORE` | `SCORE name USING a, b` | Score 0–100: `(a / b) × 100`, clamped |
| `ASSERT` | `ASSERT expr op expr` | Halt with error if condition is false |
| `OUTPUT` | `OUTPUT a, b, …` | Return variables and end execution (must be last, exactly once) |

---

## Expressions

`CALCULATE` and `ASSERT` use [mathjs](https://mathjs.org) for evaluation.

**Operators:** `+` `-` `*` `/` `^` `( )`

**Functions:** `sqrt` · `abs` · `round(x, n)` · `floor` · `ceil` · `log` · `log10` · `log2` · `exp` · `pow` · `min` · `max` · `mod` · `sign`

**Constants:** `pi` · `e`

```finql
CALCULATE compound = principal * (1 + rate) ^ years
CALCULATE monthly  = round(compound / 12, 2)
CALCULATE logReturn = log(endPrice / startPrice)
```

---

## Identifiers

- Start with a letter; may contain letters, digits, `_`
- Case-sensitive
- Reserved (case-insensitive): `SET` `CALCULATE` `ANALYZE` `FORECAST` `SCORE` `ASSERT` `USING` `FOR` `YEARS` `OUTPUT`

---

## API

```
POST /api/run
x-api-key: YOUR_API_KEY
Content-Type: application/json

{ "query": "SET income = 6000\nOUTPUT income" }
```

**Success (200)**

```json
{ "results": { "income": 6000 }, "executionTimeMs": 5 }
```

**Errors (400)** — all include `error` and `line` fields:

- Parse error: unknown command or bad syntax
- Undefined variable
- Division by zero
- Assertion failed: `surplus > 0`

---

## Design principles

- One statement per line — no loops, blocks, or conditionals
- Stateless per request
- Deterministic in v1; commands are designed to upgrade to ML models without changing syntax
- Future commands: `PREDICT` · `CLASSIFY` · `EMBED` · `DETECT`
