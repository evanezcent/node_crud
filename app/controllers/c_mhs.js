'use strict'

let db = require('../config/mysql');
let MahasiswaRepo = require('../repositories/mahasiswa');
let Mhs = require('../domains/mhs');

//Buka view add mahasiswa
let saveView = (req, res, next) => {
    res.render('add_mahasiswa', {'title': 'Add new Mahasiswa'});
};

let saveMhs = (req, res, next) => {
    if(!req.body){
        next('Empty fields !');
    }

    let data = req.body;
    let mhs = new Mhs(data.nim, data.nama, data.jurusan, data.kelas);
    let mhsRepo = new MahasiswaRepo(db);
    mhsRepo.save(mhs, result => {
        res.redirect('/');
    }, err => {
        if(err){
            next(err);
        }
    });
};

//Buka view update mahasiswa
let updateView = (req, res, next) => {
    if(!req.params){
        next('NIM Not found !');
    }

    let nim = req.params.nim;
    let mhsRepo = new MahasiswaRepo(db);
    mhsRepo.searchMhs(nim, result => {
        res.render('update_mahasiswa', {'mahasiswa': result, 'title': 'Update Mahasiswa' })
    }, err => {
        if(err){
            next(err);
        }
    });
};

let updateMhs = (req, res, next) => {
    if(!req.body){
        next('Empty fields !');
    }

    let data = req.body;
    let mhs = new Mhs(data.nim, data.nama, data.jurusan, data.kelas);
    let mhsRepo = new MahasiswaRepo(db);
    mhsRepo.update(mhs, result => {
        res.redirect('/');
    }, err => {
        if(err){
            next(err);
        }
    });
};

//Delete Mahasiswa
let deleteMhs = (req, res, next) => {
    if(!req.params){
        next('NIM Not found !');
    }

    let nim = req.params.nim;
    let mhsRepo = new MahasiswaRepo(db);
    mhsRepo.searchMhs(nim, result => {
        res.redirect('/')
    }, err => {
        if(err){
            next(err);
        }
    });
};

// Buka view detail tentang mahasiswa
let getMhs = (req, res, next) => {
    if(!req.params){
        next('NIM Not found !');
    }

    let nim = req.params.nim;
    let mhsRepo = new MahasiswaRepo(db);
    mhsRepo.searchMhs(nim, result => {
        res.render('data_mahasiswa', {'mahasiswa': result, 'title': 'Data Mahasiswa' })
    }, err => {
        if(err){
            next(err);
        }
    });
};

let getAllMhs = (req, res, next) => {
    let mhsRepo = new MahasiswaRepo(db);
    mhsRepo.getAll(result => {
        res.render('index', {'mahasiswa': result, 'title': 'List Mahasiswa' })
        //gaharus index, disini cm sekalian digunain buat nampilin list mahasiswa
    }, err => {
        if(err){
            next(err);
        }
    });
};

module.exports = {
    saveView : saveView,
    updateView : updateView,

    saveMhs : saveMhs,
    updateMhs : updateMhs,
    getMhs : getMhs,
    getAllMhs : getAllMhs
};