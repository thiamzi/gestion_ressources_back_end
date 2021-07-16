const router = require('express').Router();
const mongoose = require('mongoose');

const Notification = mongoose.model('NOTIFICATION');


router.get('/:id', (req, res) => {

    Notification.find({ destinataire: req.params.id })
        .then((notifications) => {
            if (!notifications) {
                res.send('error');
            }

            res.json({
                notifications: notifications.map((notification) => {
                    return notification.toDto();
                })
            });
            for (var i in notifications) {
                notifications[i].vue = true;
                notifications[i].save();
            }

        }).catch(err => {
            res.send('error' + err)
        });
});

router.post('/', (req, res) => {

    var notification = new Notification();
    notification.sender = req.body.sender;
    notification.destinataire = req.body.destinataire;
    notification.contenu = req.body.contenu;
    notification.dateCreation = new Date();


    Notification.create(notification).then(notification => {
        res.json(notification.toDto());
    });
});



module.exports = router;