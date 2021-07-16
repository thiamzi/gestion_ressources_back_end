const router = require('express').Router();
const mongoose = require('mongoose');

const Bulletin = mongoose.model('BULLETIN_PAIE');
const Info = mongoose.model('INFO');

router.get('/:id', (req, res) => {
    Info.find({ bulletin: req.params.id })
        .then((infos) => {
            if (!infos) {
                res.send('error' + err)
            }
            return res.json({
                infos: infos.map((info) => {
                    return info.toDto();
                })
            })
        }).catch(err => {
            res.send('error' + err)
        })
});

router.post('/:id', (req, res) => {
    console.log('tyuiop')
    Bulletin.findById(req.params.id)
        .then((bulletin) => {
            if (!bulletin) { res.send('error' + err); } else {
                let infos = [];
                for (let inf in req.body.infos) {
                    let info = new Info();
                    info.CSS = req.body.infos[inf].CSS;
                    info.Base = req.body.infos[inf].Base;
                    info.Taux_salarial = req.body.infos[inf].Taux_salarial;
                    info.part_salarie = req.body.infos[inf].part_salarie;
                    info.part_employeur = req.body.infos[inf].part_employeur;
                    info.bulletin = bulletin;
                    infos.push(info);
                }
                Info.create(infos).then((infos) => {
                    for (let inf in infos) {
                        bulletin.Infos.push(infos[inf]);
                    }
                    // bulletin.Infos.push(infos);
                    bulletin.save();
                    res.json({
                        infos: infos.map((info) => {
                            return info.toDto();
                        })
                    });
                });
            }

        }).catch(err => {
            res.send('error' + err)
        });
});
router.put('/:id', (req, res) => {

    info.findById(req.params.id).then((info) => {

        info.CCS = req.body.CCS;
        info.Base = req.body.Base;
        info.Taux_salarial = req.body.Taux_salarial;
        info.part_salarie = req.body.part_salarie;
        info.part_employeur = req.body.part_employeur;

        info.save().then(() => {
            res.json(info.toDto()).statusCode(200);
        })
    })
})

router.route('/delete/:id').delete((req, res, next) => {
    Info.findOneAndRemove(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

module.exports = router;