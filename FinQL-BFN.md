FinQL v1 Design Principles
Line-based language
One command per line
Sequential execution
Case-insensitive keywords
Case-sensitive variable names
No loops
No nesting
No blocks
No semicolons
🏗 1️⃣ Program Structure

A FinQL program is:

PROGRAM ::= LINE+

Each line contains exactly one command.

LINE ::= COMMAND NEWLINE

Blank lines are ignored.

🧩 2️⃣ The Four Core Commands
1️⃣ SET
SET <identifier> = <literal>
Grammar
SET_STMT ::= "SET" IDENTIFIER "=" LITERAL
Example
SET income = 6000
SET name = "Alice"
2️⃣ CALCULATE
CALCULATE <identifier> = <expression>
Grammar
CALC_STMT ::= "CALCULATE" IDENTIFIER "=" EXPRESSION
Example
CALCULATE surplus = income - expenses
CALCULATE growth = savings _ 1.05
3️⃣ ANALYZE
ANALYZE <identifier> USING <identifier_list>
Grammar
ANALYZE_STMT ::= "ANALYZE" IDENTIFIER "USING" IDENTIFIER_LIST
IDENTIFIER_LIST ::= IDENTIFIER ("," IDENTIFIER)_
Example
ANALYZE health USING surplus, income

This creates/sets variable health.

4️⃣ OUTPUT
OUTPUT <identifier_list>
Grammar
OUTPUT_STMT ::= "OUTPUT" IDENTIFIER_LIST
Example
OUTPUT surplus, health

Execution stops at OUTPUT.

🔢 3️⃣ Expressions (Very Important)

We intentionally keep expressions simple.

Supported Operators

-   -   - /
          Expression Grammar

We’ll support simple arithmetic with precedence:

EXPRESSION ::= TERM (( "+" | "-" ) TERM)_
TERM ::= FACTOR (( "_" | "/" ) FACTOR)\*
FACTOR ::= NUMBER | IDENTIFIER

No parentheses in v1.
No nested function calls.
No unary operators.

🔤 4️⃣ Identifiers

Rules:

Must start with a letter
Can contain letters, numbers, underscore
Case-sensitive
Regex
[a-zA-Z][a-zA-Z0-9_]\*

Valid:

income
monthly_expense
x1

Invalid:

1income
$total
🔢 5️⃣ Literals

We support:

Number
INTEGER ::= [0-9]+
FLOAT ::= [0-9]+ "." [0-9]+
NUMBER ::= INTEGER | FLOAT
String (optional v1 support)
STRING ::= "\"" .\* "\""

You can skip strings in v1 if you want to stay minimal.

🧱 6️⃣ Full Formal Grammar (EBNF Style)

Here’s the complete v1 grammar:

PROGRAM ::= STATEMENT+

STATEMENT ::= SET_STMT
| CALC_STMT
| ANALYZE_STMT
| OUTPUT_STMT

SET_STMT ::= "SET" IDENTIFIER "=" LITERAL

CALC_STMT ::= "CALCULATE" IDENTIFIER "=" EXPRESSION

ANALYZE_STMT ::= "ANALYZE" IDENTIFIER "USING" IDENTIFIER_LIST

OUTPUT_STMT ::= "OUTPUT" IDENTIFIER_LIST

IDENTIFIER_LIST ::= IDENTIFIER ("," IDENTIFIER)\*

EXPRESSION ::= TERM (("+" | "-") TERM)\*

TERM ::= FACTOR (("_" | "/") FACTOR)_

FACTOR ::= NUMBER | IDENTIFIER

IDENTIFIER ::= LETTER (LETTER | DIGIT | "\_")\*

LITERAL ::= NUMBER | STRING

NUMBER ::= DIGIT+ ("." DIGIT+)?

LETTER ::= "a".."z" | "A".."Z"

DIGIT ::= "0".."9"
🧠 7️⃣ Semantic Rules (Execution Rules)

These are NOT grammar rules — they are runtime rules.

Rule 1

Variable must exist before use (except when being defined).

Invalid:

CALCULATE surplus = income - expenses

If income wasn’t defined earlier.

Rule 2

Division by zero throws runtime error.

Rule 3

ANALYZE arguments must exist in context.

Rule 4

Only one OUTPUT allowed.

Execution stops after OUTPUT.

Rule 5

Variables cannot overwrite system keywords.

Invalid:

SET OUTPUT = 5
🔒 8️⃣ Reserved Keywords

Case-insensitive:

SET
CALCULATE
ANALYZE
USING
OUTPUT

Cannot be used as identifiers.

📌 Example Valid FinQL Program
SET income = 6000
SET expenses = 4500
CALCULATE surplus = income - expenses
CALCULATE rate = surplus / income
ANALYZE health USING surplus, income
OUTPUT surplus, rate, health
