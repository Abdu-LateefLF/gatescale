import {
    GenerateReportRequest,
    GenerateReportResult,
} from '../schemas/finance.schema';

class FinanceService {
    generateForecast(input: GenerateReportRequest): GenerateReportResult {
        const { income, expenses, currentSavings, interestRate, years } = input;

        const monthlyIncome = income / 12;
        const monthlyExpenses = expenses / 12;
        const monthlySavings = currentSavings / 12;

        const surplus = income - expenses;
        const monthlySurplus = surplus / 12;

        let futureSavings = currentSavings * (1 + interestRate / 100) ** years;
        futureSavings += surplus * 12 * years;

        const financialHealthScore = Math.min(
            100,
            Math.floor((surplus / income) * 100)
        );

        const advice = this.generateAdvice(income, expenses, currentSavings);

        const result: GenerateReportResult = {
            monthlyIncome,
            monthlyExpenses,
            monthlySavings,
            monthlySurplus,
            projectedSavings: futureSavings,
            financialHealthScore,
            advice,
        };

        return result;
    }

    private generateAdvice(
        income: number,
        expenses: number,
        currentSavings: number
    ) {
        const surplus = income - expenses;
        const savingsRate = surplus / income;
        const monthsCovered = currentSavings / expenses;

        if (surplus < 0) {
            return "You're spending more than you earn. Focus on reducing expenses immediately.";
        }

        if (savingsRate >= 0.2 && monthsCovered >= 6) {
            return "You're in a strong financial position. Consider investing to grow wealth.";
        }

        if (savingsRate >= 0.1 && monthsCovered >= 3) {
            return "You're stable, but increasing your savings rate would strengthen security.";
        }

        if (savingsRate > 0) {
            return 'Your savings cushion is limited. Prioritize building an emergency fund.';
        }

        return 'Financial risk detected. Review your budget and reduce expenses.';
    }
}

const financeService = new FinanceService();
export default financeService;
