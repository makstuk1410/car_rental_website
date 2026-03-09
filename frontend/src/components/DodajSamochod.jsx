import { useState } from 'react';
import api from '../api/api';

function DodajSamochod() {
  const [form, setForm] = useState({
    marka: '',
    model: '',
    rocznik: '',
    nr_rejestracyjny: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    await api.post('/samochody', form);
    alert('Samochód dodany');
    window.location.reload();
  };

  return (
    <div className="card">
      <h2>➕ Dodaj samochód</h2>

      <form onSubmit={handleSubmit}>
        <input name="marka" placeholder="Marka" onChange={handleChange} required />
        <input name="model" placeholder="Model" onChange={handleChange} required />
        <input name="rocznik" placeholder="Rocznik" onChange={handleChange} />
        <input name="nr_rejestracyjny" placeholder="Nr rejestracyjny" onChange={handleChange} required />
        <div style={{ height: 8 }} />
        <button>Dodaj</button>
      </form>
    </div>
  );
}

export default DodajSamochod;
