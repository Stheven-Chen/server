const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Absen = require('../models/absen');


router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find({}, { nama:1, user:1 , _id:0});
    res.json(users);
  } catch (err) {
    next(err);
  }
});
router.post('/absen', async (req, res, next) => {
  try {
    const users = await Absen.find({}, { _id:0});
    res.json(users);
  } catch (err) {
    next(err);
  }
});






router.post('/:user', async (req, res, next) => {
  try {
    const { user } = req.params;

    // Mencari pengguna berdasarkan user
    const userData = await User.findOne({ user });
    const { nama } = userData;
    // console.log(nama)

    if (!userData) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }

    // Mencari data absen berdasarkan nama
    const absenData = await Absen.findOne({ nama }, {_id:0});

    if (!absenData) {
      return res.status(404).json({ message: 'Data absen tidak ditemukan' });
    }

    res.json({ absenData });
  } catch (err) {
    next(err);
  }
});

router.put('/timein/:user', async (req, res, next) => {
  try {
    const currentdate = new Date().toISOString().split("T")[0];
    const { user } = req.params;
    const { date, timeIn, timeOut } = req.body;

    const userData = await User.findOne({ user });
    if (!userData) {
      return res.status(404).json({ message: 'Pengguna tidak ada' });
    }

    const { nama } = userData;

    const dataAbsen = await Absen.findOne({ nama });

    if (!dataAbsen) {
      return res.status(404).json({ message: 'Data absen tidak ditemukan' });
    }

    const { absen } = dataAbsen;

    const existingDate = absen.find(item=>item.date===currentdate);

    if (existingDate) {
      return res.status(400).json({ message: 'Sudah absen' });
    } else {
      const update = await Absen.updateOne(
        { nama },
        { $push: { absen: { date, timeIn, timeOut } } }
      );

      if (update.nModified === 0) {
        return res.status(400).json({ message: 'Gagal memperbarui data absen' });
      }

      res.json({ message: 'Data absen berhasil diperbarui' });
    }
  } catch (e) {
    next(e);
  }
});

router.put('/timeout/:user', async (req, res, next) => {
  try {
    const currentDate = new Date().toISOString().split('T')[0];
    const { user } = req.params;
    const { timeOut } = req.body;

    const userData = await User.findOne({ user });
    if (!userData) {
      return res.status(404).json({ message: 'Pengguna tidak ada' });
    }
    const { nama } = userData;
    const dataAbsen = await Absen.findOne({ nama });
    const { absen } = dataAbsen;
    const existingDate = absen.find(item => item.date === currentDate);

    if (!existingDate) {
      return res.status(400).json({ message: "Belum Absen Masuk" });
    } else if (existingDate.timeOut === "") {
      const update = await Absen.updateOne(
        { nama, "absen.date": currentDate },
        { $set: { "absen.$.timeOut": timeOut } }
      );
      if (update.nModified === 0) {
        return res.status(400).json({ message: 'Gagal memperbarui data absen' });
      }
      return res.json({ message: "Berhasil TimeOut" });
    } else {
      return res.status(400).json({ message: "Sudah timeOut" });
    }

  } catch (e) {
    next(e);
  }
});

router.delete('/reset/:user', async (req,res, next)=>{
  try{
    const {user} = req.params;

    const userData = await User.findOne({user})
    const {nama}= userData;


    const del = await Absen.updateOne(
      {nama},
      {$set: {absen:[]}}
    )

    if(del.nModified===0){
      return (res.status(400).json({message:"Gagal Melakukan Reset"}))
    }

    res.json({message:"Sukses Reset"})

  }catch(e){
    next(e);
  }
})

router.delete('/resetAll', async (req,res,next)=>{
  

  try{
    const reset = await Absen.updateMany(
      {},
      {$set:{absen:[]}} 
      )
  
    if(reset.nModified ===0){
      return(res.status(400).json({message:"Gagal Melakukan Reset"}))
    }
  
    res.json({message:"Sukses Reset"})

  }catch(e){
    next(e)
  }

})

  


module.exports = router;


