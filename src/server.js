import app from './app.js';
import './lib/migrate.js';

const port = 3000;

app.listen(port, () => {
  console.log(`Server running on:  localhost:${port}`)
})