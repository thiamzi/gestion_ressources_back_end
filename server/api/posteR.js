const router = require('express').Router();
const mongoose = require('mongoose');
const Employer = mongoose.model('EMPLOYER');
const Poste = mongoose.model('POSTE');
const Service = mongoose.model('SERVICE');

router.get('/:id', (req, res) => {
    Poste.find({ Service: req.params.id })
        .populate('Employers')
        .then((postes) => {

            if (!postes) {
                res.send('error');

            }

            return res.json({
                postes: postes.map((poste) => {
                    return poste.toDto();
                })
            })
        }).catch(err => {
            res.send('error' + err)
        });


});
router.get('/permit/:id', (req, res) => {
    console.log('je suis la')
    Poste.find({ Service: req.params.id })
        .then((postes) => {
            if (!postes) {
                res.statusCode(404);
            }

            return res.json({
                postes: postes.map((poste) => {
                    return { pos_id: poste._id, Libelle_p: poste.Libelle_p };
                })
            })
        }).catch(err => {
            res.send('error' + err)
        });


});
router.get('/', (req, res) => {
    Poste.find()
        .then((postes) => {
            if (!postes) {
                res.sendStatus(404);
            }
            return res.json({
                postes: postes.map((poste) => {
                    return poste.toDto();
                })
            })
        }).catch(err => {
            res.send('error' + err)
        });


});

router.get('/unposte/:id', (req, res) => {

    Poste.findById(req.params.id)
        .then((poste) => {
            if (!poste) { res.send('error' + err) }
            return res.json({
                poste: poste.toDto()
            })
        }).catch(err => {
            console.log("requete bien reçue");

            res.send('error' + err + 'c l erreur')
        })
});





router.post('/:id', (req, res) => {
    Service.findById(req.params.id)
        .then((service) => {
            if (!service) {
                res.json({ error: 'snep' });
            } else {
                let poste = new Poste();

                poste.Libelle_p = req.body.Libelle_p;
                poste.Description_p = req.body.Description_p;
                poste.Active = req.body.Active;

                poste.Service = service;
                Poste.create(poste).then(pos => {
                    service.Postes.push(pos);
                    service.save();
                    res.json(pos.toDto());
                });
            }

        }).catch(err => {
            res.send('error' + err)
        });
});

router.put('/:id', (req, res) => {

    Poste.findById(req.params.id)
        .then((poste) => {

            if (poste) {

                poste.Libelle_p = req.body.Libelle_p;
                poste.Description_p = req.body.Description_p;
                if (req.body.Active) {
                    poste.Active = true;
                } else {
                    poste.Active = false;
                }
                poste.save().then((poste) => {
                    res.json(poste.toDto());
                });
            }
        }).catch(err => {
            res.send('error' + err);
        });
});

router.route('/delete/:id').delete((req, res, next) => {
    Poste.findById(req.params.id).then((poste) => {
        if (poste) {
            if (poste.Employers.length == 0) {
                Service.findById(poste.Service).then((service) => {
                    if (service) {
                        for (let i = 0; i < service.Postes.length; i++) {
                            if (service.Postes[i] == req.params.id) {
                                service.Postes.splice(i, 1);
                                service.save();
                            }
                        }

                    }
                })
                poste.remove();
                res.json({ sup: true });
            } else {
                res.json({ sup: false });
            }
        } else {
            res.json({ sup: true });
        }

    });
});

module.exports = router;
// const router = require('express').Router();
// const mongoose = require('mongoose');
// const Employer = mongoose.model('EMPLOYER');
// const Poste = mongoose.model('POSTE');
// const Service = mongoose.model('SERVICE');

// // router.get('/:id', (req, res) => {
// //     console.log("requete bien reçue 1");
// //     
// // });
// router.get('/:id', (req, res) => {
//     Poste.find({ Service: req.params.id })
//         .populate('Employers')
//         .then((postes) => {
//             if (!postes) {
//                 res.send('error');

//             }

//             return res.json({
//                 postes: postes.map((poste) => {
//                     return poste.toDto();
//                 })
//             })
//         }).catch(err => {
//             res.send('error' + err)
//         });


// });
// router.get('/permit/:id', (req, res) => {
//     console.log('je suis la')
//     Poste.find({ Service: req.params.id })
//         .then((postes) => {
//             if (!postes) {
//                 res.statusCode(404);
//             }

//             return res.json({
//                 postes: postes.map((poste) => {
//                     return { pos_id: poste._id, Libelle_p: poste.Libelle_p };
//                 })
//             })
//         }).catch(err => {
//             res.send('error' + err)
//         });


// });
// router.get('/', (req, res) => {
//     Poste.find()
//         .then((postes) => {
//             if (!postes) {
//                 res.sendStatus(404);
//             }
//             return res.json({
//                 postes: postes.map((poste) => {
//                     return poste.toDto();
//                 })
//             })
//         }).catch(err => {
//             res.send('error' + err)
//         });


// });

// router.get('/unposte/:id', (req, res) => {

//     Poste.findById(req.params.id)
//         .then((poste) => {
//             if (!poste) { res.send('error' + err) }
//             return res.json({
//                 poste: poste.toDto()
//             })
//         }).catch(err => {
//             console.log("requete bien reçue");

//             res.send('error' + err + 'c l erreur')
//         })
// });





// router.post('/:id', (req, res) => {
//     Service.findById(req.params.id)
//         .then((service) => {
//             if (!service) {
//                 res.json({ error: 'snep' });
//             } else {
//                 let poste = new Poste();

//                 poste.Libelle_p = req.body.Libelle_p;
//                 poste.Description_p = req.body.Description_p;
//                 poste.Active = req.body.Active;

//                 poste.Service = service;
//                 Poste.create(poste).then(pos => {
//                     service.Postes.push(pos);
//                     service.save();
//                     res.json(pos.toDto());
//                 });
//             }

//         }).catch(err => {
//             res.send('error' + err)
//         });
// });

// router.put('/:id', (req, res) => {

//     Poste.findById(req.params.id)
//         .then((poste) => {

//             if (poste) {

//                 poste.Libelle_p = req.body.Libelle_p;
//                 poste.Description_p = req.body.Description_p;
//                 if (req.body.Active) {
//                     poste.Active = true;
//                 } else {
//                     poste.Active = false;
//                 }
//                 poste.save().then((poste) => {
//                     res.json(poste.toDto());
//                 });
//             }
//         }).catch(err => {
//             res.send('error' + err);
//         });
// });

// router.route('/delete/:id').delete((req, res, next) => {
//     Poste.findById(req.params.id).then((poste) => {
//         if (poste) {
//             if (poste.Employers.length == 0) {
//                 Service.findById(poste.Service).then((service) => {
//                     if (service) {
//                         for (let i = 0; i < service.Postes.length; i++) {
//                             if (service.Postes[i] == req.params.id) {
//                                 service.Postes.splice(i, 1);
//                                 service.save();
//                             }
//                         }

//                     }
//                 })
//                 poste.remove();
//                 res.json({ sup: true });
//             } else {
//                 res.json({ sup: false });
//             }
//         } else {
//             res.json({ sup: true });
//         }

//     });
// });

// module.exports = router;