const mongoose = require('mongoose');

const password = 'Ssmmg021717';
const dbURI = `mongodb+srv://user:${password}@stheven.qoxhup8.mongodb.net/absen?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Terhubung ke MongoDB');
  } catch (err) {
    console.log('Kesalahan koneksi MongoDB:', err);
  }
};

module.exports = connectDB;
