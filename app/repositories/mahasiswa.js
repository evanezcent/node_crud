'use strict'

let Mhs = require('../domains/mhs');
let db = require('../config/mysql');

let mhsRepo = function(db){
    this.db = db;
};

mhsRepo.prototype = {
    save: function(m, cb, errCb){
        let db = this.db;
        let data = {nim: m.nim, nama: m.nama, jurusan: m.jurusan, angkatan: m.angkatan, password: m.password};
        let query = 'INSERT INTO mahasiswas SET ?';

        db.query(query, data, (err, results) => {
            if(err){
                errCb(err);
            }
            cb(results);
        });
    },

    update: function(m, cb, errCb){
        let db = this.db;
        let data = [m.nama, m.jurusan, m.angkatan, m.nim];
        let query = 'UPDATE mahasiswas SET nama = ?, jurusan = ?, angkatan = ? WHERE nim = ?';

        db.query(query, data, (err, results) => {
            if(err){
                errCb(err);
            }
            // console.log(data.nama);
            cb(results);
        });
    },

    delete: function(nim, cb, errCb){
        let db = this.db;
        let query = 'DELETE FROM mahasiswas WHERE nim = ?';
        
        db.query(query, [nim], (err, results) => {
            if(err){
                errCb(err);
            }
            cb(results);
        });
    },

    searchMhs: function(nim, cb, errCb){
        let db = this.db;
        let query = 'SELECT * FROM mahasiswas WHERE nim = ?';

        db.query(query, [nim], (err, results, fields) => {
            if(err){
                errCb(err);
            }

            // CEK APAKAH DATA ADA ATAU TIDAK
            if(!results){
                cb(`Data dengan NIM : ${nim}, tidak ditemukan`);
            }else{
                let m = results[0];
                let mhs = new Mhs(m.nim, m.nama, m.jurusan, m.angkatan);
                cb(mhs);
            }
        });
    },

    getAll: function(cb, errCb){
        let db = this.db;
        let query = 'SELECT * FROM mahasiswas';
        db.query(query, (err, results, fields) => {
            if(err){
                errCb(err);
            }

            // CEK APAKAH DATA ADA ATAU TIDAK
            if(!results){
                cb(`Tabel Mahasiswa Kosong !`);
            }else{
                let mhsArray = [];
                for (let i = 0; i < results.length; i++){
                    let m = results[i];
                    let mhs = new Mhs(m.nim, m.nama, m.jurusan, m.angkatan, m.foto_profil , m.password);
                    mhsArray.push(mhs);
                }
                cb(mhsArray);
            }
        });
    }
};

module.exports = mhsRepo;