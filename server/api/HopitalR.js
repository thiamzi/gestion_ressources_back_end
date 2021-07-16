const router = require("express").Router();
const mongoose = require("mongoose");

const Hopital = mongoose.model("HOPITAL");

router.get("/", (req, res) => {
  Hopital.find()
    .then(hopital => {
      if (!hopital) {
        res.send("error" + err);
      }
      return res.json({
        hopital: hopital.map(hopital => {
          return hopital.toDto();
        })
      });
    })
    .catch(err => {
      res.send("error" + err);
    });
});

router.post("/", (req, res) => {
  let hopital = new Hopital();
  hopital.Siret = req.body.Siret;
  hopital.NomH = req.body.NomH;
  hopital.AdresseH = req.body.AdresseH;
  hopital.Telephone = req.body.Telephone;

  hopital
    .save()
    .then(() => {
      res.json(hopital._id);
    })
    .catch(err => {
      res.send("error" + err);
    });
});

router.put("/:id", (req, res) => {
  Hopital.findById(req.params.id).then(hopital => {
    hopital.Siret = req.body.Siret;
    hopital.NomH = req.body.NomH;
    hopital.AdresseH = req.body.AdresseH;
    hopital.Telephone = req.body.Telephone;

    hopital.save().then(hopital => {
      res.json(hopital.toDto());
    });
  });
});

module.exports = router;
