'use strict'

let db = require('../config/mysql');
let MahasiswaRepo = require('../repositories/mahasiswa');
let Mhs = require('../domains/mhs');
var express = require('express');
let router = express.Router();

//Buka view add mahasiswa
let saveView = (req, res, next) => {
    res.render('add_mahasiswa', { 'title': 'Add new Mahasiswa' });
};

let saveMhs = (req, res, next) => {
    if (!req.body) {
        next('Empty fields !');
    }

    let data = req.body;
    let mhs = new Mhs(data.nim, data.nama, data.jurusan, data.kelas);
    let mhsRepo = new MahasiswaRepo(db);
    mhsRepo.save(mhs, result => {
        res.redirect('/');
    }, err => {
        if (err) {
            next(err);
            console.log('ERROR KAH ?')
        }
    });
};

//Buka view update mahasiswa
let updateView = (req, res, next) => {
    if (!req.params) {
        next('NIM Not found !');
    }

    let nim = req.params.nim;
    let mhsRepo = new MahasiswaRepo(db);
    mhsRepo.searchMhs(nim, result => {
        res.render('update_mahasiswa', { 'mahasiswa': result, 'title': 'Update Mahasiswa' })
    }, err => {
        if (err) {
            next(err);
        }
    });
};

let updateMhs = (req, res, next) => {
    if (!req.body) {
        next('Empty fields !');
    }

    let data = req.body;
    let mhs = new Mhs(data.nim, data.nama, data.jurusan, data.kelas);
    let mhsRepo = new MahasiswaRepo(db);
    mhsRepo.update(mhs, result => {
        // console.log(mhs.nama);
        res.redirect('/');
    }, err => {
        if (err) {
            next(err);
        }
    });
};

//Delete Mahasiswa
let deleteMhs = (req, res, next) => {
    if (!req.params) {
        next('NIM Not found !');
    }

    let nim = req.params.nim;
    let mhsRepo = new MahasiswaRepo(db);
    mhsRepo.delete(nim, result => {
        res.redirect('/')
    }, err => {
        if (err) {
            next(err);
        }
    });
};

// Buka view detail tentang mahasiswa
let getMhs = (req, res, next) => {
    if (!req.params) {
        next('NIM Not found !');
    }

    let nim = req.params.nim;
    // console.log(nim);
    let mhsRepo = new MahasiswaRepo(db);
    mhsRepo.searchMhs(nim, result => {
        res.render('data_mahasiswa', { 'mahasiswa': result, 'title': 'Data Mahasiswa' })
    }, err => {
        if (err) {
            next(err);
        }
    });
};

let getAllMhs = (req, res, next) => {
    let mhsRepo = new MahasiswaRepo(db);
    mhsRepo.getAll(result => {
        res.render('index', { 'mahasiswa': result, 'title': 'List Mahasiswa' })
        //gaharus index, disini cm sekalian digunain buat nampilin list mahasiswa
    }, err => {
        if (err) {
            next(err);
        }
    });
};


// API=================================================================
// Get all data
router.get('/getData', (req, res) => {
    let mhsRepo = new MahasiswaRepo(db);

    mhsRepo.getAll(result => {
        res.send(
            result
        )
    }, err => {
        if (err) {
            res.status(404).send({
                success: false
            })
        }
    });
})

router.post('/addData', (req, res) => {
    if (!req.body) {
        next('Empty fields !');
    }

    let data = req.body;
    if (data.tx_cpass == data.tx_password) {
        let mhs = new Mhs(data.tx_nim, data.tx_name, data.tx_jurusan, data.tx_angkatan, data.tx_password);
        let mhsRepo = new MahasiswaRepo(db);
        mhsRepo.save(mhs, result => {
            res.send(
                result
            )
        }, err => {
            if (err) {
                next(err);
                console.log('Tidak dapat menambah data')
            }
        });
    }else{
        res.status(404).send({
            success: false,
            msg : "Password tidak sama"
        })
    }
})

module.exports = router

// module.exports = {
//     saveView: saveView,
//     updateView: updateView,

//     saveMhs: saveMhs,
//     updateMhs: updateMhs,
//     getMhs: getMhs,
//     getAllMhs: getAllMhs,
//     deleteMhs: deleteMhs,
//     router
// };