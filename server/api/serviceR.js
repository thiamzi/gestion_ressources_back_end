const router = require("express").Router();
const mongoose = require("mongoose");
const Chef = mongoose.model("CHEFSERVICE");

const Service = mongoose.model("SERVICE");

router.get("/", (req, res) => {
    Service.find()
        .then(services => {
            if (!services) {
                res.send("error" + err);
            }
            return res.json({
                services: services.map(service => {
                    return service.toDto();
                })
            });
        })
        .catch(err => {
            res.send("error" + err);
        });
});
router.get("/permit", (req, res) => {
    Service.find()
        .then(services => {
            if (!services) {
                res.sendStatus(404);
            }
            return res.json({
                services: services.map(service => {
                    return { ser_id: service._id, Libelle_s: service.Libelle_s };
                })
            });
        })
        .catch(err => {
            res.send("error" + err);
        });
});

router.get("/:id", (req, res) => {
    Service.findById(req.params.id)
        .then(service => {
            if (!service) {
                res.send("error" + err);
            }
            return res.json({
                service: service.toDto()
            });
        })
        .catch(err => {
            res.send("error" + err);
        });
});

router.post("/", (req, res) => {
    console.log("avant");
    let service = new Service();
    service.Libelle_s = req.body.Libelle_s;
    service.Description_s = req.body.Description_s;

    service
        .save()
        .then(() => {
            console.log("de dans");

            res.json(service._id);
        })
        .catch(err => {
            res.send("error" + err);
        });
    console.log("apres");
});

router.put("/:id", (req, res) => {
    Service.findById(req.params.id).then(service => {
        service.Libelle_s = req.body.Libelle_s;
        service.Description_s = req.body.Description_s;
        service.Active = req.body.Active;

        service.save().then(service => {
            res.json(service.toDto());
        });
    });
});

router.route("/delete/:id").delete((req, res, next) => {
    Service.findById(req.params.id).then(service => {
        if (service) {
            if (service.Postes.length == 0 && service.MAteriels.length == 0) {
                Chef.findById(service.chef).then(chef => {
                    if (chef) {
                        chef.remove();
                    }
                });
                res.json({ sup: true, ser: service.Libelle_s });

                service.remove();
            } else {
                res.json({ sup: false });
                console.log("service non supprimé supprimé");
            }
        } else {
            res.json({ sup: true });
        }
    });
});
module.exports = router;