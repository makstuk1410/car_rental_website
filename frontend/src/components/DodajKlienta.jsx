import { useState } from 'react';
import api from '../api/api';

function DodajKlienta() {
  const [form, setForm] = useState({
    imie: '',
    nazwisko: '',
    telefon: '',
    email: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    await api.post('/klienci', form);
    alert('Klient dodany');
    window.location.reload();
  };

  return (
    <div className="card">
      <h2>➕ Dodaj klienta</h2>

      <form onSubmit={handleSubmit}>
        <input name="imie" placeholder="Imię" onChange={handleChange} required />
        <input name="nazwisko" placeholder="Nazwisko" onChange={handleChange} required />
        <input name="telefon" placeholder="Telefon" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <div style={{ height: 8 }} />
        <button>Dodaj</button>
      </form>
    </div>
  );
}

export default DodajKlienta;
