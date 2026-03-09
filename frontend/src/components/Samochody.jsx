import { useEffect, useState } from 'react';
import api from '../api/api';

function Samochody() {
  const [samochody, setSamochody] = useState([]);

  useEffect(() => {
    api.get('/samochody')
      .then(res => setSamochody(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="card">
      <h2>Samochody</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Marka</th>
            <th>Model</th>
            <th>Rocznik</th>
            <th>Dostępny</th>
          </tr>
        </thead>
        <tbody>
          {samochody.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.marka}</td>
              <td>{s.model}</td>
              <td>{s.rocznik}</td>
              <td>{s.dostepnosc ? 'TAK' : 'NIE'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Samochody;
