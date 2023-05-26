const express = require('express');
const app = express();
const port = 3001;
const cors = require('cors');

const connectDB = require('./db');
const userRoutes = require('./routes/userRoutes');

// Middleware
app.use(cors())
app.use(express.json());

// Connect to database
connectDB();

// Use User routes
app.use('/', userRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Terjadi kesalahan dalam server');
});

app.listen(port, () => {
  console.log('Server berjalan pada port', port);
});
