const express = require('express');
const cors = require('cors');

const klienciRoutes = require('./routes/klienci');
const samochodyRoutes = require('./routes/samochody');
const pracownicyRoutes = require('./routes/pracownicy');
const platnosciRoutes = require('./routes/platnosci');
const wypozyczeniaRoutes = require('./routes/wypozyczenia');



const app = express();
app.use(cors());
app.use(express.json());

app.use('/klienci', klienciRoutes);
app.use('/samochody', samochodyRoutes)
app.use('/pracownicy', pracownicyRoutes);
app.use('/platnosci', platnosciRoutes);
app.use('/wypozyczenia', wypozyczeniaRoutes);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend działa na http://localhost:${PORT}`);
});
