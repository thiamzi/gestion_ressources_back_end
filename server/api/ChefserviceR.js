const router = require('express').Router();
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const Chef = mongoose.model('CHEFSERVICE');
const Service = mongoose.model('SERVICE');
router.use(cors());



process.env.SECRET_KEY = 'secret'

router.post('/creation/:id', (req, res) => {

    let chefc = new Chef();

    let table = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'
    ];
    let chaine = '';
    let a = 0;
    Chef.findOne({
            adresse_mail: req.body.adresse_mail
        })
        .then(chef => {
            if (!chef) {
                for (var i = 0; i < 8; i++) {
                    a = Math.random();
                    a = Math.round(a * 61);
                    chaine += table[a];
                }
                console.log(chaine);
                bcrypt.hash(chaine, 10, (err, hash) => {
                    chefc.Mot_de_passe = hash;
                    chefc.nom_utilisateur = req.body.nom_utilisateur;
                    chefc.adresse_mail = req.body.adresse_mail;
                    Service.findById(req.params.id).then(service => {
                        if (service) {
                            chefc.Service = service;
                            Chef.create(chefc)
                                .then(chef => {
                                    console.log("avant ajout");
                                    service.chef = chef;
                                    console.log("apres ajout");
                                    res.json({ status: chef.adresse_mail + 'mis à jour reussi' })
                                    service.save().then(() => {
                                        chefc.Mot_de_passe = chaine;
                                        sendMail2(chefc, (err, info) => {
                                            console.log("Email has been sent");
                                            res.send(info);
                                        })
                                        res.json({ status: service.Libelle_s })
                                    })

                                })
                                .catch(err => {
                                    res.send('error' + err)
                                });
                        }
                    });
                });
            } else {
                res.json({ error: 'existe' });
            }
        })
        .catch(err => {
            res.send('error' + err)
        })
})

router.put('/modifier', (req, res) => {

    const userData = {
        nom_utilisateur: req.body.nom_utilisateur,
        adresse_mail: req.body.adresse_mail,
        Mot_de_passe: req.body.Mot_de_passe,

    }
    Chef.findOne({
            _id: req.body._id
        }).then(chef => {
            if (chef) {
                bcrypt.hash(req.body.Mot_de_passe, 10, (err, hash) => {
                    userData.Mot_de_passe = hash
                    Service.findById().then(service => {
                        if (service) {
                            userData.Service = service;

                            Chef.update(userData)
                                .then(chef => {
                                    service.chef = chef._id;
                                    res.json({ status: chef.adresse_mail + 'mis à jour reussi' })
                                    service.save().then(() => {
                                        res.json({ status: service.Libelle_s })
                                    })

                                })
                                .catch(err => {
                                    res.send('error' + err)
                                });
                        }
                    });
                });
            } else {
                res.json({ error: 'Utlisateur existe pas' })
            }
        })
        .catch(err => {
            res.send('error' + err)
        })
});
router.post('/connection', (req, res) => {
    Chef.findOne({
            adresse_mail: req.body.adresse_mail
        }).then((chef) => {

            if (chef) {
                if (bcrypt.compareSync(req.body.Mot_de_passe, chef.Mot_de_passe)) {
                    const payload = {
                        _id: chef._id,
                        nom_utilisateur: chef.nom_utilisateur,
                        adresse_mail: chef.adresse_mail,
                        Mot_de_passe: chef.Mot_de_passe,
                        Service: chef.Service
                    }
                    let token = jwt.sign(payload, process.env.SECRET_KEY)
                    res.json({ token: token })
                } else {
                    //res.json({ error: "Cet utilisateur n'existe pas" })
                    res.send('error')

                }
            } else {
                //res.json({ error: "Cet utilisateur n'existe paaaas" })
                res.send('error')
            }
        })
        .catch(err => {
            res.send('error' + ' accupe');
        })
})

router.get('/profil', (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    Chef.findOne({
            _id: decoded._id
        })
        .then(chef => {
            if (chef) {
                res.json(chef)
            } else {
                res.send("Cet utilisateur n'existe pas")
            }
        })
        .catch(err => {
            res.send('error' + err)
        })
})

router.get('/users_recup/', (req, res) => {
    Chef.find()
        .then((chefs) => {
            if (!chefs) { res.send('error' + err) }
            return res.json({
                chefs: chefs.map((chef) => {
                    return chef.toDto();
                })
            })
        }).catch(err => {
            res.send('error' + err)
        })

});


//ENVOIE DE MAIL

async function sendMail(chef, callback) {
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
        to: `<${chef.adresse_mail}>`,
        subject: "<Recuperation mot de passe>",
        html: `<h1>Votre mot de passe : </h1><h2> ${chef.Mot_de_passe} </h2>`
    };

    let info = await transporter.sendMail(mailOptions);
    callback(info);
}
router.put("/", (req, res) => {
    console.log("Email has been sent");
    let table = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'
    ];
    let chaine = '';
    let a = 0;
    Chef.findOne({
            adresse_mail: req.body.adresse_mail
        }).then(chef => {

            if (chef) {
                for (let i = 0; i < 8; i++) {
                    a = Math.random();
                    a = Math.round(a * 61);
                    chaine += table[a];
                }
                bcrypt.hash(chaine, 10, (err, hash) => {
                    chef.Mot_de_passe = chaine;
                    sendMail(chef, (err, info) => {
                        console.log("Email has been sent");
                        res.send(info);
                    })
                    chef.Mot_de_passe = hash
                    chef.save().then(() => {
                        res.json(chef);
                    })
                })

                console.log("Mot de passe modifier");

            } else {
                res.send("Cet utilisateur n'existe pas")
                console.log("Mot de passe modifier echec");
            }

        })
        .catch(err => {
            res.send('error' + err)
            console.log("Mot de passe modifier echec");
        })
});

//NOTFICATIONS

async function sendMail2(chef, callback) {
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
        to: `<${chef.adresse_mail}>`,
        subject: "<Creation de compte>",
        html: `<h3>Sallut!! Voici vos informations pour votre compte en tant que cehf de service : </h3>
        <h2>Votre nom d'utlisateur : ${chef.nom_utilisateur} </h2>
        <h2>Votre mot de passe : ${chef.Mot_de_passe} </h2>
        <h4>Cliquer sur ce lien pour accèdeer a la page de connexion : http://localhost:4200/profil </h4>`
    };

    let info = await transporter.sendMail(mailOptions);
    callback(info);
}

module.exports = router;