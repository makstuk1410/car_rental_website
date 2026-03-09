const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /klienci
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM klienci');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd bazy danych' });
  }
});

// POST /klienci
router.post('/', async (req, res) => {
  const { imie, nazwisko, telefon, email } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO klienci (imie, nazwisko, telefon, email)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [imie, nazwisko, telefon, email]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Nie udało się dodać klienta' });
  }
});

module.exports = router;
