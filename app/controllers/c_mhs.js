'use strict'

let db = require('../config/mysql');
let MahasiswaRepo = require('../repositories/mahasiswa');
let Mhs = require('../domains/mhs');
var express = require('express');
let router = express.Router();

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mahasiswa'
    }
});

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

    knex('mahasiswas')
        .select()
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(404).send(err)
        })

    // let mhsRepo = new MahasiswaRepo(db);

    // mhsRepo.getAll(result => {
    //     res.send(
    //         result
    //     )
    // }, err => {
    //     if (err) {
    //         res.status(404).send({
    //             success: false
    //         })
    //     }
    // });
})

router.post('/addData', (req, res) => {
    if (!req.body) {
        next('Empty fields !');
    } else {
        let data = req.body;
        if (data.tx_cpass == data.tx_password) {
            knex('mahasiswas')
                .insert({
                    'nama': data.tx_name,
                    'nim': data.tx_nim,
                    'jurusan': data.tx_jurusan,
                    'angkatan': data.tx_angkatan,
                    'password': data.tx_password,
                })
                .then(data2 => {
                    res.send({
                        success: true,
                        data2
                    })
                })
        } else {
            res.status(404).send({
                success: false,
                msg: "Password tidak sama"
            })
        }
    }

    // if (data.tx_cpass == data.tx_password) {
    //     let mhs = new Mhs(data.tx_nim, data.tx_name, data.tx_jurusan, data.tx_angkatan, data.tx_password);
    //     let mhsRepo = new MahasiswaRepo(db);
    //     mhsRepo.save(mhs, result => {
    //         res.send(
    //             result
    //         )
    //     }, err => {
    //         if (err) {
    //             next(err);
    //             console.log('Tidak dapat menambah data')
    //         }
    //     });
    // } else {
    //     res.status(404).send({
    //         success: false,
    //         msg: "Password tidak sama"
    //     })
    // }
})

router.put("/editData/:nim", (req, res) => {
    if (!req.body) {
        next('Empty fields !');
    } else {
        let data = req.body;
        // console.log("JALAN!!!!!!")
        knex('mahasiswas')
            .where('nim', req.params.nim)
            .update({
                'nama': data.tx_name,
                'jurusan': data.tx_jurusan,
                'angkatan': data.tx_angkatan
            })
            .then(data2 => {
                res.send({
                    success: true,
                    data2
                })
            })
            .catch(err => {
                res.status(404).send({
                    success: false
                })
            })
    }
})

router.delete("/deleteData/:nim", (req, res) => {
    let nim = req.params.nim

    knex('mahasiswas')
        .where('nim', nim)
        .del()
        .then(() => {
            res.send({
                success: true
            })
        })
        .catch(err => {
            res.status(404).send({
                success: false
            })
        })
});


router.post('/uploadFoto/:nim', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        // console.log(req.files.photo)
        res.status(500).send({
            success: false,
            message: "File not found !"
        });
    }

    var file = req.files.photo
    var photo = Math.floor(Math.random() * 100000).toString() + ".png"

    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/png"){
        file.mv('uploads/' + photo, err =>{
            if (err) {
                log.error(err)
                console.log(err)
                res.status(404).send({
                    success: false,
                    message: "File is empty !",
                    url: "http://localhost:7000/uploads/" + photo
                })
            }else{
                knex('mahasiswas')
                .where('nim', req.params.nim)
                .update('foto_profil', photo)
                .then(data => {
                    res.send({
                        status: true
                    })
                })
                .catch(err => {
                    log.error(err)
                    console.log(err)
                    res.status(404).send({
                        status: false,
                        message: "Error request to the server"
                    })
                })
            }
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