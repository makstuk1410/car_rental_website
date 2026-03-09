const express = require('express');
const router = express.Router();
const pool = require('../db');


// GET /pracownicy
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM pracownicy ORDER BY id'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd pobierania pracowników' });
  }
});


// GET /pracownicy/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM pracownicy WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pracownik nie istnieje' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd pobierania pracownika' });
  }
});


// POST /pracownicy
router.post('/', async (req, res) => {
  const { imie, nazwisko, stanowisko } = req.body;

  if (!imie || !nazwisko) {
    return res.status(400).json({ error: 'Imię i nazwisko są wymagane' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO pracownicy (imie, nazwisko, stanowisko)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [imie, nazwisko, stanowisko]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Nie udało się dodać pracownika' });
  }
});


// PUT /pracownicy/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { imie, nazwisko, stanowisko } = req.body;

  try {
    const result = await pool.query(
      `UPDATE pracownicy
       SET imie = $1,
           nazwisko = $2,
           stanowisko = $3
       WHERE id = $4
       RETURNING *`,
      [imie, nazwisko, stanowisko, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pracownik nie istnieje' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Nie udało się zaktualizować pracownika' });
  }
});


// DELETE /pracownicy/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM pracownicy WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pracownik nie istnieje' });
    }

    res.json({ message: 'Pracownik usunięty' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Nie udało się usunąć pracownika' });
  }
});

module.exports = router;
