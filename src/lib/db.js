import { DatabaseSync } from 'node:sqlite';
const database = new DatabaseSync('job-api.db');

database.exec(`
    PRAGMA foreign_keys = ON
    `);

export default database;