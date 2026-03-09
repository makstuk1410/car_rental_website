import { useEffect, useState } from 'react';
import api from '../api/api';

function DodajWypozyczenie() {
  const [klienci, setKlienci] = useState([]);
  const [samochody, setSamochody] = useState([]);
  const [form, setForm] = useState({
    id_klienta: '',
    id_samochodu: '',
    cena: ''
  });

  // pobranie klientów i dostępnych samochodów
  useEffect(() => {
    api.get('/klienci').then(res => setKlienci(res.data));
    api.get('/samochody').then(res =>
      setSamochody(res.data.filter(s => s.dostepnosc))
    );
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await api.post('/wypozyczenia', {
        id_klienta: form.id_klienta,
        id_samochodu: form.id_samochodu,
        data_wypozyczenia: new Date().toISOString().slice(0, 10),
        cena: form.cena
      });

      alert('Wypożyczenie dodane!');
      window.location.reload();
    } catch (err) {
      alert('Błąd dodawania wypożyczenia');
      console.error(err);
    }
  };

  return (
    <div className="card">
      <h2>➕ Nowe wypożyczenie</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Klient:</label>
          <select name="id_klienta" onChange={handleChange} required>
            <option value="">-- wybierz --</option>
            {klienci.map(k => (
              <option key={k.id} value={k.id}>
                {k.imie} {k.nazwisko}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Samochód:</label>
          <select name="id_samochodu" onChange={handleChange} required>
            <option value="">-- wybierz --</option>
            {samochody.map(s => (
              <option key={s.id} value={s.id}>
                {s.marka} {s.model}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Cena:</label>
          <input
            type="number"
            name="cena"
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ height: 8 }} />
        <button type="submit">Wypożycz</button>
      </form>
    </div>
  );
}

export default DodajWypozyczenie;
