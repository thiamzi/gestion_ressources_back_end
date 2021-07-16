const router = require("express").Router();
const mongoose = require("mongoose");

const Materiels_comm = mongoose.model("MATERIELS_C");
const Commande = mongoose.model("COMMANDE");
const Service = mongoose.model("SERVICE");

router.get("/un/:id", (req, res) => {
  Materiels_comm.findById(req.params.id)
    .then(materiels_comm => {
      if (!materiels_comm) {
        res.send("error" + err);
      }
      return res.json({
        materiels_comm: materiels_comm.toDto()
      });
    })
    .catch(err => {
      res.send("error" + err);
    });
});

router.get("/serv/:id", (req, res) => {
  Materiels_comm.find({ Service: req.params.id })
    .then(materiels_comms => {
      if (!materiels_comms) {
        res.send("error" + err);
      }
      return res.json({
        materiels_comms: materiels_comms.map(materiels_comm => {
          return materiels_comm.toDto();
        })
      });
    })
    .catch(err => {
      res.send("error" + err);
    });
});

router.get("/comm/:id", (req, res) => {
  Materiels_comm.find({ Commande: req.params.id })
    .then(materiels_comms => {
      if (!materiels_comms) {
        res.send("error" + err);
      }
      return res.json({
        materiels_comms: materiels_comms.map(materiels_comm => {
          return materiels_comm.toDto();
        })
      });
    })
    .catch(err => {
      res.send("error" + err);
    });
});

router.post("/:id", (req, res) => {
  Service.findById(req.params.id).then(service => {
    if (!service) {
      res.send("error" + err);
    } else {
      let materiels_comm = new Materiels_comm();
      materiels_comm.reference = req.body.reference;
      materiels_comm.Quantite = req.body.Quantite;
      materiels_comm.description = req.body.description;
      materiels_comm.Prix_unitair = req.body.Prix_unitair;
      materiels_comm.Valide = false;
      materiels_comm.Service = service;
      Materiels_comm.create(materiels_comm).then(materiels_com => {
        service.MAteriels_a_comm.push(materiels_com);
        service.save();
        res.json(materiels_com.toDto());
      });
    }
  });
});

router.put("/:id_c/:id", (req, res) => {
  Commande.findById(req.params.id_c)
    .then(commande => {
      Materiels_comm.findById(req.params.id)
        .then(materiels_comm => {
          materiels_comm.Commande = commande;

          materiels_comm.save().then(() => {
            commande.MAteriels_a_comm.push(materiels_comm);
            commande.save();
            res.json(materiels_comm.toDto());
          });
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
  Materiels_comm.findById(req.params.id)
    .then(materiels_comm => {
      if (materiels_comm) {
        Service.findById(materiels_comm.Service)
          .then(service => {
            if (service) {
              for (let i = 0; i < service.MAteriels_a_comm.length; i++) {
                if (service.MAteriels_a_comm[i] == req.params.id) {
                  console.log(service);
                  service.MAteriels_a_comm.splice(i, 1);
                  service.save();
                  materiels_comm.remove();
                  res.status(200).json({
                    msg: data
                  });
                }
              }
            } else {
              console.log("jqjhs");
            }
          })
          .catch(err => {
            res.send("error" + err);
          });
      } else {
        res.json({ sup: true });
      }
    })
    .catch(err => {
      res.send("error" + err);
    });
});
router.put("/delete/mat/:id", (req, res, next) => {
  Materiels_comm.findById(req.params.id)
    .then(materiels_comm => {
      if (materiels_comm) {
        materiels_comm.Valide = true;
        materiels_comm.save();
      } else {
        res.json({ sup: true });
      }
    })
    .catch(err => {
      res.send("error" + err);
    });
});
module.exports = router;
