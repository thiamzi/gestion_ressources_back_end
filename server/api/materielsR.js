const router = require("express").Router();
const mongoose = require("mongoose");

const Materiel = mongoose.model("MATERIEL");
const Service = mongoose.model("SERVICE");

router.get("/:id", (req, res) => {
  Materiel.find({ service: req.params.id })
    .then(materiels => {
      if (!materiels) {
        res.statusCode(404);
      }
      return res.json({
        materiels: materiels.map(materiel => {
          return materiel.toDto();
        })
      });
    })
    .catch(err => {
      res.send("error" + err);
    });
});

router.get("/mat/:id", (req, res) => {
  Materiel.findById(req.params.id)
    .then(materiel => {
      if (!materiel) {
        res.statusCode(404);
      } else {
        return res.json({
          Materiel: materiel.toDto()
        });
      }
    })
    .catch(err => {
      res.send("error" + err);
    });
});
router.post("/:id", (req, res) => {
  Service.findById(req.params.id).then(service => {
    if (!service) {
      res.statusCode(404);
    } else {
      let materiel = new Materiel();
      (materiel.Libelle_m = req.body.Libelle_m),
        (materiel.Description_m = req.body.Description_m),
        (materiel.aCommande = req.body.aCommande),
        (materiel.stock = req.body.stock),
        (materiel.Prix = req.body.Prix),
        (materiel.service = service);

      Materiel.create(materiel).then(() => {
          service.MAteriels.push(materiel);
          service.save();
        res.json(materiel.toDto());
      });
    }
  });
});

router.put("/:id", (req, res) => {
  console.log("modifier materiel");
  Materiel.findById(req.params.id)
    .then(materiel => {
      if (materiel)
        (materiel.Libelle_m = req.body.Libelle_m),
          (materiel.Description_m = req.body.Description_m),
          (materiel.aCommande = req.body.aCommande),
          (materiel.Prix = req.body.Prix),
          (materiel.stock = req.body.stock),
          materiel
            .save()
            .then(materiel => {
              res.json(materiel.toDto());
            })
            .catch(err => {
              res.send("error" + err);
            });
    })
    .catch(err => {
      res.send("error" + err);
    });
});

router.put("/acomm/:id", (req, res) => {
  console.log("modifier materiel");
  Materiel.findById(req.params.id)
    .then(materiel => {
      if (materiel)
          (materiel.aCommande = req.body.aCommande),
          materiel
            .save()
            .then(materiel => {
              res.json(materiel.toDto());
            })
            .catch(err => {
              res.send("error" + err);
            });
    })
    .catch(err => {
      res.send("error" + err);
    });
});

router.route("/delete/:id").delete((req, res, next) => {
  Materiel.findById(req.params.id).then(materiel => {
    if (materiel) {
      Service.findById(materiel.service).then(service => {
        if (service) {
            console.log(service.MAteriels)
          for (let i = 0; i < service.MAteriels.length; i++) {
            console.log('vfdl,kv')
            if (service.MAteriels[i] == req.params.id) {
                console.log('vfdl,kv')
              service.MAteriels.splice(i, 1);
              service.save();
              materiel.remove();
              res.json(materiel);
            }
          }
        }
      });
    } else {
      res.json({ sup: true });
    }
  });
});

module.exports = router;
