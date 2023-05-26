const mongoose = require('mongoose');

const absenSchema = new mongoose.Schema({
  nama: String,
  ID: String,
  absen: [
    {
      date: String,
      timeIn: String,
      timeOut: String 
    }
  ]
}, {collection:'dataAbsen'})

const Absen = mongoose.model('Absen', absenSchema);

module.exports = Absen;
