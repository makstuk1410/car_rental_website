import { useEffect, useState } from 'react';
import api from '../api/api';

function Wypozyczenia() {
  const [wypozyczenia, setWypozyczenia] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/wypozyczenia?aktywne=true');
      setWypozyczenia(res.data);
    } catch (err) {
      console.error(err);
      alert('Błąd pobierania wypożyczeń');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const zakoncz = async (id) => {
    if (!window.confirm('Zakończyć to wypożyczenie?')) return;

    try {
      await api.put(`/wypozyczenia/${id}/zakoncz`);
      load();
    } catch (err) {
      console.error(err);
      alert('Nie udało się zakończyć wypożyczenia');
    }
  };

  const oplac = async (idPlatnosci) => {
    if (!window.confirm('Oznaczyć płatność jako opłaconą?')) return;

    try {
      await api.put(`/platnosci/${idPlatnosci}/oplac`);
      load();
    } catch (err) {
      console.error(err);
      alert('Nie udało się opłacić płatności');
    }
  };

  return (
    <div className="card">
      <h2>Aktywne wypożyczenia</h2>

      {loading && <p>Ładowanie...</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Klient</th>
            <th>Samochód</th>
            <th>Od</th>
            <th>Cena</th>
            <th>Płatność</th>
            <th>Akcja</th>
          </tr>
        </thead>
        <tbody>
          {wypozyczenia.length === 0 && (
            <tr>
              <td colSpan="7">Brak aktywnych wypożyczeń</td>
            </tr>
          )}

          {wypozyczenia.map(w => (
            <tr key={w.id}>
              <td>{w.id}</td>
              <td>{w.klient}</td>
              <td>{w.samochod}</td>
              <td>{w.data_wypozyczenia}</td>
              <td>{w.cena}</td>
              <td>
                <span className={`status ${w.status_platnosci}`}>
                  {w.status_platnosci}
                </span>
                {w.status_platnosci !== 'OPLACONE' && (
                  <>
                    <br />
                    <button onClick={() => oplac(w.id_platnosci)}>
                      Opłać
                    </button>
                  </>
                )}
              </td>
              <td>
                <button className="btn-danger" onClick={() => zakoncz(w.id)}>
                  Zakończ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Wypozyczenia;
