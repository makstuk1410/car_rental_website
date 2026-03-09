const express = require('express');
const router = express.Router();
const pool = require('../db');


// GET /samochody – lista wszystkich aut
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM samochody ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd pobierania samochodów' });
  }
});


// GET /samochody/:id – jedno auto
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM samochody WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Samochód nie istnieje' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd pobierania samochodu' });
  }
});


// POST /samochody – dodanie auta
router.post('/', async (req, res) => {
  const { marka, model, rocznik, nr_rejestracyjny } = req.body;

  if (!marka || !model || !nr_rejestracyjny) {
    return res.status(400).json({ error: 'Brak wymaganych danych' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO samochody (marka, model, rocznik, nr_rejestracyjny)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [marka, model, rocznik, nr_rejestracyjny]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);

    if (err.code === '23505') {
      // UNIQUE violation
      return res.status(409).json({ error: 'Numer rejestracyjny już istnieje' });
    }

    res.status(500).json({ error: 'Nie udało się dodać samochodu' });
  }
});


// PUT /samochody/:id – edycja auta
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { marka, model, rocznik, dostepnosc } = req.body;

  try {
    const result = await pool.query(
      `UPDATE samochody
       SET marka = $1,
           model = $2,
           rocznik = $3,
           dostepnosc = $4
       WHERE id = $5
       RETURNING *`,
      [marka, model, rocznik, dostepnosc, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Samochód nie istnieje' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Nie udało się zaktualizować samochodu' });
  }
});


// DELETE /samochody/:id – usunięcie auta
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM samochody WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Samochód nie istnieje' });
    }

    res.json({ message: 'Samochód usunięty' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Nie udało się usunąć samochodu' });
  }
});

module.exports = router;
