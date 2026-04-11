import z from 'zod';

export const generateReportRequestSchema = z.object({
    income: z.number().min(0),
    expenses: z.number().min(0),
    currentSavings: z.number().min(0),
    interestRate: z.number().min(0).max(100),
    years: z.number().min(1),
});

export type GenerateReportRequest = z.infer<typeof generateReportRequestSchema>;

export interface GenerateReportResult {
    monthlyIncome: number;
    monthlyExpenses: number;
    monthlySavings: number;
    monthlySurplus: number;
    projectedSavings: number;
    financialHealthScore: number;
    advice: string;
}
