# FinQL

FinQL is a lightweight, finance-focused domain-specific language (DSL). Users run financial logic through a simple, sequential scripting syntax.

**It is designed as:**

- A mini interpreted language
- A finance computation engine
- A foundation for future ML-powered financial analysis
- A programmable API platform

---

## Overview

FinQL accepts finance scripts as plain text on an API endpoint. The server parses, validates, and executes statements in order and returns structured results.

**Example script**

```finql
SET income = 6000
SET expenses = 4500
CALCULATE surplus = income - expenses
CALCULATE savingsRate = surplus / income
ANALYZE health USING surplus, income
OUTPUT surplus, savingsRate, health
```

**Example response**

```json
{
    "results": {
        "surplus": 1500,
        "savingsRate": 0.25,
        "health": "Strong"
    },
    "executionTimeMs": 14
}
```

---

## Design philosophy

**FinQL is**


| Property      | Meaning                                       |
| ------------- | --------------------------------------------- |
| Line-based    | One statement per line                        |
| Sequential    | Order of lines defines execution              |
| Deterministic | Same inputs produce the same results          |
| Extensible    | New commands can be added without breaking v1 |
| ML-ready      | ANALYZE and future commands can call models   |


**It is not a full programming language.** It intentionally avoids:

- Loops
- Conditionals
- Nested blocks
- Arbitrary side effects
- State persistence across requests

Each request is **stateless** and runs independently.

---

## FinQL v1 grammar

### Program structure

A program is one or more statements:

```ebnf
PROGRAM ::= STATEMENT+
```

Each statement appears on its own line.

### Supported commands (v1)

FinQL v1 defines four commands.

#### 1. `SET`

Assign a literal value to a variable.

```ebnf
SET <identifier> = <literal>
```

```finql
SET income = 5000
SET rate = 0.05
```

#### 2. `CALCULATE`

Evaluate a mathematical expression and assign the result.

```ebnf
CALCULATE <identifier> = <expression>
```

```finql
CALCULATE surplus = income - expenses
CALCULATE projected = savings * (1 + rate)^years
```

Expressions are evaluated with a secure math expression library.

#### 3. `ANALYZE`

Run financial analysis using existing variables.

```ebnf
ANALYZE <identifier> USING <identifier_list>
```

```finql
ANALYZE health USING surplus, income
```

The result is stored in the target identifier.

- **v1:** Rule-based behavior.
- **Later:** May call ML models; the command shape stays the same.

#### 4. `OUTPUT`

Return selected variables and end execution.

```ebnf
OUTPUT <identifier_list>
```

```finql
OUTPUT surplus, health
```

Execution stops after `OUTPUT`.

---

## Expressions

FinQL uses a math library for numeric expressions.

**Supported**


| Feature            | Notes                         |
| ------------------ | ----------------------------- |
| `+`, `-`, `*`, `/` | Standard arithmetic           |
| `^`                | Exponentiation                |
| `( )`              | Grouping                      |
| Decimals           | Literal numbers               |
| Identifiers        | Must already exist in context |


```finql
CALCULATE compound = principal * (1 + rate)^years
```

Every variable referenced must be defined earlier in the script.

---

## Identifiers

**Rules**

- Must start with a letter
- May contain letters, digits, and `_`
- Case-sensitive
- Cannot be reserved keywords

**Valid**

```text
income
monthly_expense
rate2025
```

**Invalid**

```text
1income
SET
```

### Reserved keywords

These are **case-insensitive** and cannot be used as identifiers:

`SET` · `CALCULATE` · `ANALYZE` · `USING` · `OUTPUT`

---

## Execution model

Pipeline:

1. API receives the script string
2. Script is split into lines
3. Each line is parsed into a command object
4. Commands run in order
5. Variables live in an execution context
6. `OUTPUT` returns the selected values

**Example context (internal)**

```json
{
    "income": 6000,
    "expenses": 4500,
    "surplus": 1500,
    "health": "Strong"
}
```

Execution remains **stateless per request**.

---

## `ANALYZE` in v1

Version 1 uses **rules**, for example:


| Condition          | Label       |
| ------------------ | ----------- |
| Savings rate ≥ 20% | `"Strong"`  |
| Savings rate ≥ 10% | `"Stable"`  |
| Otherwise          | `"At Risk"` |


**Planned for later versions** (same command interface):

- ML-based risk scoring
- Investment growth prediction
- Anomaly detection
- Credit behavior modeling

---

## API usage

Authentication uses an **API key**.


| Item              | Value           |
| ----------------- | --------------- |
| **Method & path** | `POST /api/run` |


**Request body**

```json
{
    "query": "SET income = 6000\nSET expenses = 4500\nCALCULATE surplus = income - expenses\nOUTPUT surplus"
}
```

**Headers**

```http
x-api-key: YOUR_API_KEY
```

---

## Error handling

Errors are structured and include a message and line when applicable.

**Undefined variable**

```json
{
    "error": "Undefined variable: income",
    "line": 2
}
```

**Invalid syntax**

```json
{
    "error": "Invalid syntax in CALCULATE statement",
    "line": 3
}
```

**Division by zero**

```json
{
    "error": "Division by zero",
    "line": 4
}
```

## Future expansion

FinQL is meant to grow without breaking the core script shape.

**Planned command ideas**

`PREDICT` · `FORECAST` · `CLASSIFY` · `EMBED` · `DETECT`

These would plug into ML services while keeping the same sequential, line-based syntax.