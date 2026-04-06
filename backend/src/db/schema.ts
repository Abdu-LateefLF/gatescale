import fs from 'node:fs';
import path from 'node:path';

const schemaDir = path.join(__dirname, 'schemas');
const tableFiles = fs.readdirSync(schemaDir).filter(file => file.endsWith('.ts'));

const tables = tableFiles.map(file => {
    const tablePath = path.join(schemaDir, file);
    return require(tablePath);
});

const schema = {
    ...tables.reduce((acc, table) => ({ ...acc, ...table }), {}),
};

export default schema;