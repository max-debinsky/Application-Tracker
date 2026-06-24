import fs from 'node:fs';
import path from 'node:path';
import database from './db.js';

const schema = fs.readFileSync(path.join(import.meta.dirname, 'schema.sql')).toString();

database.exec(schema);

console.log("Database migration complete.");