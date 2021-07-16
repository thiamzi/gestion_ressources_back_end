const router = require('express').Router();
const mongoose = require('mongoose');

const Bulletin = mongoose.model('BULLETIN_PAIE');
const Employer = mongoose.model('EMPLOYER');


router.get('/:id', (req, res) => {
    Bulletin.findById(req.params.id)
        .populate('Infos')
        .then((bulletin) => {
            if (!bulletin) {
                res.send('error' + err);
            }
            return res.json({
                bulletin: bulletin.toDto()
            })
        }).catch(err => {
            res.send('error' + err)
        })

});
router.post('/:id', (req, res) => {
    Employer.findById(req.params.id).then((employer) => {
        if (!employer) { res.send('error' + err); }
        let bulletin = new Bulletin();
        bulletin.Date_c = new Date();
        bulletin.Periode = req.body.Periode;
        bulletin.employer = employer;
        Bulletin.create(bulletin).then((bullet) => {
            employer.Bulletins.push(bullet);
            employer.save();
            res.json({ bulletin: bullet.toDto() });
        });
    });
});

router.route('/delete/:id').delete((req, res, next) => {
    Bulletin.findOneAndRemove(req.params.id, (error, data) => {
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