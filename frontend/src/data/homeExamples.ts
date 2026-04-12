export const HERO_SNIPPET = `SET income = 6000
SET expenses = 4500
CALCULATE surplus = income - expenses
CALCULATE savingsRate = surplus / income
ANALYZE health USING surplus, income
OUTPUT surplus, savingsRate, health`;

export const HERO_RESPONSE = `{
  "results": {
    "surplus": 1500,
    "savingsRate": 0.25,
    "health": "Strong"
  },
  "executionTimeMs": 14
}`;
