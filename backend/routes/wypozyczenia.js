const express = require('express');
const router = express.Router();
const pool = require('../db');




router.get('/', async (req, res) => {
  const { klient, samochod, aktywne } = req.query;

  let query = `
    SELECT 
      w.id,
      k.imie || ' ' || k.nazwisko AS klient,
      s.marka || ' ' || s.model AS samochod,
      w.data_wypozyczenia,
      w.data_zwrotu,
      w.cena,
      p.id AS id_platnosci,
      p.status AS status_platnosci
    FROM wypozyczenia w
    JOIN klienci k ON w.id_klienta = k.id
    JOIN samochody s ON w.id_samochodu = s.id
    JOIN platnosci p ON w.id_platnosci = p.id
    WHERE 1=1
  `;

  const params = [];
  let idx = 1;

  if (klient) {
    query += ` AND w.id_klienta = $${idx++}`;
    params.push(klient);
  }

  if (samochod) {
    query += ` AND w.id_samochodu = $${idx++}`;
    params.push(samochod);
  }

  if (aktywne === 'true') {
    query += ` AND w.data_zwrotu IS NULL`;
  }

  query += ` ORDER BY w.data_wypozyczenia DESC`;

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd filtrowania wypożyczeń' });
  }
});




// GET /wypozyczenia/:id
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`
      SELECT *
      FROM wypozyczenia
      WHERE id = $1
    `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Wypożyczenie nie istnieje' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Błąd pobierania wypożyczenia' });
    }
});


// POST /wypozyczenia
// POST /wypozyczenia
router.post('/', async (req, res) => {
    const {
        id_klienta,
        id_samochodu,
        id_pracownika,
        id_platnosci,
        data_wypozyczenia,
        data_zwrotu,
        cena
    } = req.body;

    // minimalna walidacja
    if (!id_klienta || !id_samochodu || !data_wypozyczenia || !cena) {
        return res.status(400).json({
            error: 'Brak wymaganych danych (klient, samochód, data, cena)'
        });
    }

    try {
        let platnoscId = id_platnosci;

        // 👉 JEŚLI NIE MA PŁATNOŚCI — TWORZYMY JĄ AUTOMATYCZNIE
        if (!platnoscId) {
            const platnosc = await pool.query(
                `
        INSERT INTO platnosci (metoda, kwota, status)
        VALUES ($1, $2, $3)
        RETURNING id
        `,
                ['GOTOWKA', cena, 'NIEOPLACONE']
            );

            platnoscId = platnosc.rows[0].id;
        }

        // 👉 DOPIERO TERAZ TWORZYMY WYPOŻYCZENIE
        const result = await pool.query(
            `
      INSERT INTO wypozyczenia (
        id_klienta,
        id_samochodu,
        id_pracownika,
        id_platnosci,
        data_wypozyczenia,
        data_zwrotu,
        cena
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
            [
                id_klienta,
                id_samochodu,
                id_pracownika || null,
                platnoscId,
                data_wypozyczenia,
                data_zwrotu || null,
                cena
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Nie udało się dodać wypożyczenia' });
    }
});


router.put('/:id/zakoncz', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `
      UPDATE wypozyczenia
      SET data_zwrotu = CURRENT_DATE
      WHERE id = $1 AND data_zwrotu IS NULL
      RETURNING *
      `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({
                error: 'Wypożyczenie nie istnieje lub jest już zakończone'
            });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Nie udało się zakończyć wypożyczenia' });
    }
});

module.exports = router;
