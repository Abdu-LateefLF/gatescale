export const FULL_EXAMPLE = `SET income = 6000
SET expenses = 4500
CALCULATE surplus = income - expenses
CALCULATE savingsRate = surplus / income
ANALYZE health USING surplus, income
OUTPUT surplus, savingsRate, health`;

export const FULL_RESPONSE = `{
  "results": {
    "surplus": 1500,
    "savingsRate": 0.25,
    "health": "Strong"
  },
  "executionTimeMs": 14
}`;

export const REQUEST_EXAMPLE = `POST /api/run HTTP/1.1
Host: your-api-host
x-api-key: YOUR_API_KEY
Content-Type: application/json

{
  "query": "SET income = 6000\\nSET expenses = 4500\\nCALCULATE surplus = income - expenses\\nOUTPUT surplus"
}`;

export const SUCCESS_RESPONSE = `{
  "results": {
    "surplus": 1500
  },
  "executionTimeMs": 8
}`;

export const ERROR_RESPONSE_SYNTAX = `{
  "error": "Invalid syntax in CALCULATE statement",
  "line": 3
}`;

export const ERROR_RESPONSE_UNDEF = `{
  "error": "Undefined variable: income",
  "line": 2
}`;

export const ERROR_RESPONSE_DIV = `{
  "error": "Division by zero",
  "line": 4
}`;
