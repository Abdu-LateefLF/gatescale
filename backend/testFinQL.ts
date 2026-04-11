import queryService from './src/services/query/query.service';

async function executeQuery(query: string) {
    try {
        const result = await queryService.executeQuery(query);
        console.log(result);
        console.log('--------------------------------');
        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// const query1 = `
// SET income = 6000
// SET expenses = 4500
// CALCULATE surplus = income - expenses
// CALCULATE rate = surplus / income
// ANALYZE health USING surplus, income
// OUTPUT surplus, rate, health
// `;

// executeQuery(query1);

// const query2 = `
// SET income = 6000
// SET expenses = 4500
// CALCULATE difference = income - expenses
// OUTPUT difference
// `;
// executeQuery(query2);

const query3 = `
SET test = true
CALCULATE test = test + 100
OUTPUT test
`;
executeQuery(query3);
