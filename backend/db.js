const { Pool } = require('pg');

const pool = new Pool({
  host: 'db',   // bo Docker wystawia port
  port: 5432,
  user: 'postgres',
  password: '14102311Mm',
  database: 'wypozyczalnia'
});

module.exports = pool;
