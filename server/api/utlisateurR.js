const router = require('express').Router();
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const User = mongoose.model('USER');
router.use(cors());



process.env.SECRET_KEY = 'secret'

router.post('/creation', (req, res) => {

    const userData = {
        numero: req.body.numero,
        nom_utilisateur: req.body.nom_utilisateur,
        adresse_mail: req.body.adresse_mail,
        Mot_de_passe: req.body.Mot_de_passe

    }
    User.findOne({
            adresse_mail: req.body.adresse_mail
        })
        .then(user => {
            if (!user) {
                bcrypt.hash(req.body.Mot_de_passe, 10, (err, hash) => {
                    userData.Mot_de_passe = hash
                    User.create(userData)
                        .then(user => {
                            res.json({ status: user.adresse_mail + 'compte cree' })
                        })
                        .catch(err => {
                            res.send('error' + err)
                        })
                })
            } else {
                res.json({ error: 'Utlisateur deja existant' })
            }
        })
        .catch(err => {
            res.send('error' + err)
        })
})

router.put('/modifier', (req, res) => {



    User.findOne({
            _id: req.body._id
        })
        .then(user => {
            if (user) {
                user.nom_utilisateur = req.body.nom_utilisateur;
                user.adresse_mail = req.body.adresse_mail;
                bcrypt.hash(req.body.Mot_de_passe, 10, (err, hash) => {
                    user.Mot_de_passe = hash;
                    user.save()
                        .then(user => {
                            console.log('update fonctionne');
                            res.json({ status: user.adresse_mail + 'mis à jour reussi' })
                        })
                        .catch(err => {
                            console.log('update ne fonctionne pas');
                            res.send('error' + err)
                        })
                })
            } else {
                res.json({ error: 'Utlisateur existe pas' })
            }
        })
        .catch(err => {
            res.send('error' + err)
        })
});
router.post('/connection', (req, res) => {
    User.findOne({
            adresse_mail: req.body.adresse_mail
        })
        .then((user) => {
            if (user) {
                if (bcrypt.compareSync(req.body.Mot_de_passe, user.Mot_de_passe)) {
                    const payload = {
                        _id: user._id,
                        numero: user.numero,
                        nom_utilisateur: user.nom_utilisateur,
                        adresse_mail: user.adresse_mail,
                        Mot_de_passe: user.Mot_de_passe
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
            res.send('error' + err)
        });
});

router.get('/profil', (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    User.findOne({
            _id: decoded._id
        })
        .then(user => {
            if (user) {
                res.json(user)
            } else {
                res.send('error' + err)
            }
        })
        .catch(err => {
            res.send('error' + err)
        })
})

router.get('/users_recup/', (req, res) => {
    User.find()
        .then((users) => {
            if (!users) { res.send('error' + err) }
            return res.json({
                users: users.map((user) => {
                    return user.toDto();
                })
            })
        }).catch(err => {
            res.send('error' + err)
        })

});


//ENVOIE DE MAIL

async function sendMail(user, callback) {
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
        to: `<${user.adresse_mail}>`,
        subject: "<Recuperation mot de passe>",
        html: `<h1>Votre mot de passe : </h1><h2> ${user.Mot_de_passe} </h2>`
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
    User.findOne({
            adresse_mail: req.body.adresse_mail
        })
        .then(user => {

            if (user) {
                for (let i = 0; i < 8; i++) {
                    a = Math.random();
                    a = Math.round(a * 61);
                    chaine += table[a];
                }
                bcrypt.hash(chaine, 10, (err, hash) => {
                    user.Mot_de_passe = chaine;
                    sendMail(user, (err, info) => {
                        console.log("Email has been sent");
                        res.send(info);
                    })
                    user.Mot_de_passe = hash
                    user.save().then(() => {
                        res.json(user);
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



module.exports = router;