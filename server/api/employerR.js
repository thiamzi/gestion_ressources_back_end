const router = require('express').Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const Poste = mongoose.model('POSTE');
const Employer = mongoose.model('EMPLOYER');
const Service = mongoose.model('SERVICE');


router.get('/:id', (req, res) => {
    Employer.findById(req.params.id)
        .populate('Bulletins')
        .then((employer) => {
            if (!employer) {
                res.statusCode(404);
            }
            return res.json({
                employer: employer.toDto()
            })
        }).catch(err => {
            res.send('error' + err)
        })

});


router.get('/', (req, res) => {

    Employer.find()
        .then((employers) => {
            return res.json({
                employers: employers.map((employer) => {
                    return employer.toDto();
                })
            })
        })
});
router.get('/poste/:id', (req, res) => {

    Employer.find({ poste: req.body.pos_id })
        .then((employers) => {
            if (!employers) { res.statusCode(404); }
            return res.json({
                employers: employers.map((employer) => {
                    return employer.toDto();
                })
            })
        }).catch(err => {
            res.send('error' + err)
        })
});

router.post('/:id', (req, res) => {

    Poste.findById(req.params.id)
        .then((poste) => {
            if (!poste) {
                res.statusCode(404);
            } else {
                let employer = new Employer();
                employer.Nom = req.body.Nom;
                employer.Prenom = req.body.Prenom;
                employer.Statut = req.body.Statut;
                employer.Sexe = req.body.Sexe;
                employer.Nss = req.body.Nss;
                employer.Date_naiss = req.body.Date_naiss;
                employer.Email = req.body.Email;
                employer.Anciennete = req.body.Anciennete;
                employer.Adresse = req.body.Adresse;
                employer.Telephone = req.body.Telephone;
                employer.poste = poste;
                Employer.create(employer).then((employer) => {
                    poste.Employers.push(employer);
                    poste.save();
                    res.json(employer.toDto());
                });
            }

        }).catch(err => {
            res.send('error' + err)
        });
});

router.put('/affecter/:id_e/:id_p/:id_serv', (req, res) => {
    Employer.findById(req.params.id_e).then((employer) => {
        if (employer) {
            Service.findById(req.params.id_serv).then((service) => {
                if (service) {
                    Poste.findById(req.params.id_p).then((poste) => {
                        if (poste, 3) {
                            employer.poste = poste;
                            poste.Employers.push(employer);
                            poste.save();

                            Poste.findById(req.body.Poste)
                                .then((pos) => {
                                    if (pos) {
                                        console.log("sup")
                                        for (let i = 0; i < pos.Employers.length; i++) {
                                            if (pos.Employers[i] == req.params.id_e) {
                                                pos.Employers.splice(i, 1);
                                                pos.save();
                                            }
                                        }

                                    }
                                });
                            employer.save().then((employer) => {
                                sendMail(employer, service, poste, (err, info) => {
                                    console.log("Email has been sent");
                                });
                                res.json(employer.toDto());
                            })
                            console.log('apres')


                        }
                    })
                }
            })
        }
    }).catch(err => {
        res.send('error' + err)
    });


});

router.route('/delete/:id').delete((req, res, next) => {
    Employer.findById(req.params.id).then((employer) => {
        if (employer) {
            employer.sup(employer);
            Poste.findById(employer.poste)
                .then((poste) => {
                    if (poste) {
                        for (let i = 0; i < poste.Employers.length; i++) {
                            if (poste.Employers[i] == req.params.id) {
                                poste.Employers.splice(i, 1);
                                poste.save();
                            }
                        }

                    }
                });
            employer.remove();
            res.json({ sup: true });
        } else {
            res.json({ sup: true });
        }

    }).catch(err => {
        res.send('error' + err)
    });
})

router.put('/:id', (req, res) => {

    Employer.findById(req.params.id)
        .then((employer) => {
            if (!employer) {
                res.statusCode(404);
            }
            employer.Nom = req.body.Nom;
            employer.Prenom = req.body.Prenom;
            employer.Statut = req.body.Statut;
            employer.Nss = req.body.Nss;
            employer.Sexe = req.body.Sexe;
            employer.Date_naiss = req.body.Date_naiss;
            employer.Email = req.body.Email;
            employer.Anciennete = req.body.Anciennete;
            employer.Adresse = req.body.Adresse;
            employer.Telephone = req.body.Telephone;

            employer.save().then((employer) => {
                res.json(employer.toDto());
            });
        });
});
async function sendMail(employe, service, poste, callback) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: 'dalalgaan@gmail.com',
            pass: 'dfkesrabm1998'
        }
    })

    let mailOptions = {
        from: `<dalalgaan@gmail.com>`,
        to: `<${employe.Email}>`,
        subject: "<Affection>",
        html: `Salut!!! Vous avez été affecter au service ${service.Libelle_s}, Vous allez occuper le poste de ${poste.Libelle_p}`
    };
    let info = await transporter.sendMail(mailOptions);
    callback(info);
}

module.exports = router;