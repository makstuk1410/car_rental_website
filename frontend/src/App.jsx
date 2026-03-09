import Samochody from './components/Samochody';
import Wypozyczenia from './components/Wypozyczenia';
import DodajWypozyczenie from './components/DodajWypozyczenie';
import DodajKlienta from './components/DodajKlienta';
import DodajSamochod from './components/DodajSamochod';

function App() {
  return (
    <div className="app">
      <h1>🚗 Wypożyczalnia samochodów</h1>

      <DodajKlienta />
      <DodajSamochod />
      <DodajWypozyczenie />

      <Samochody />

      <Wypozyczenia />
    </div>
  );
}

export default App;
