const express = require('express');
const router = express.Router();
const pool = require('../db');


// GET /platnosci
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM platnosci ORDER BY id'
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Błąd pobierania płatności' });
    }
});


// GET /platnosci/:id
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM platnosci WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Płatność nie istnieje' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Błąd pobierania płatności' });
    }
});


// POST /platnosci
router.post('/', async (req, res) => {
    const { metoda, kwota, status } = req.body;

    if (!metoda || kwota == null) {
        return res.status(400).json({ error: 'Metoda i kwota są wymagane' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO platnosci (metoda, kwota, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
            [metoda, kwota, status || 'NIEOPLACONE']
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Nie udało się dodać płatności' });
    }
});


// PUT /platnosci/:id
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { metoda, kwota, status } = req.body;

    try {
        const result = await pool.query(
            `UPDATE platnosci
       SET metoda = $1,
           kwota = $2,
           status = $3
       WHERE id = $4
       RETURNING *`,
            [metoda, kwota, status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Płatność nie istnieje' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Nie udało się zaktualizować płatności' });
    }
});


// DELETE /platnosci/:id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM platnosci WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Płatność nie istnieje' });
        }

        res.json({ message: 'Płatność usunięta' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Nie udało się usunąć płatności' });
    }
});

// PUT /platnosci/:id/oplac
router.put('/:id/oplac', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `UPDATE platnosci
       SET status = 'OPLACONE'
       WHERE id = $1 AND status <> 'OPLACONE'
       RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Płatność już opłacona lub nie istnieje' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Nie udało się opłacić płatności' });
    }
});


module.exports = router;
