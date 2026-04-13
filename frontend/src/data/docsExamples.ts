import { BASE_API_URL } from '../apiClient';

export const FULL_EXAMPLE = `SET income = 6000
SET expenses = 4500
SET rate = 0.05
CALCULATE surplus = income - expenses
CALCULATE savingsRate = surplus / income
ANALYZE health USING surplus, income
SCORE stability USING surplus, income
FORECAST growth USING surplus, rate FOR 3 YEARS
ASSERT surplus > 0
OUTPUT surplus, savingsRate, health, stability, growth`;

export const FULL_RESPONSE = `{
  "results": {
    "surplus": 1500,
    "savingsRate": 0.25,
    "health": "Strong",
    "stability": 25,
    "growth": 1736.44
  },
  "executionTimeMs": 14
}`;

const apiUrl = BASE_API_URL.replace('https://', '')
    .replace('http://', '')
    .replace('www.', '')
    .replace('//', '/');

export const REQUEST_EXAMPLE = `POST /api/run HTTP/1.1
Host: ${apiUrl}
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

export const ERROR_RESPONSE_ASSERT = `{
  "error": "Assertion failed: surplus > 0",
  "line": 4
}`;
