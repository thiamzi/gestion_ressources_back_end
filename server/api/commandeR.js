const router = require("express").Router();
const mongoose = require("mongoose");

const Commande = mongoose.model("COMMANDE");

router.get("/", (req, res) => {
  Commande.find()
    .then(commandes => {
      if (!commandes) {
        res.send("error" + err);
      }
      return res.json({
        commandes: commandes.map(commande => {
          return commande.toDto();
        })
      });
    })
    .catch(err => {
      res.send("error" + err);
    });
});

router.get("/:id", (req, res) => {
  Commande.findById(req.params.id)
    .then(commande => {
      if (!commande) {
        res.send("error" + err);
      }
      return res.json({
        commande: commande.toDto()
      });
    })
    .catch(err => {
      res.send("error" + err);
    });
});

router.post("/", (req, res) => {
  let command = new Commande();
  command.date = req.body.date;
  command.numero = null;

  command.save().then(() => {
    res.json(command._id);
  });
});

router.put("/:id", (req, res) => {
  Commande.findById(req.params.id)
    .then(commande => {
      let chaine = "";
      let table = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
      let a = 0;
      for (i = 0; i < 6; i++) {
        a = Math.random();
        a = Math.round(a * 8);
        chaine += table[a];
      }

      if (commande) {
        commande.numero = chaine;
        commande.save().then(commande => {
          res.json(commande.toDto());
        });
      }
    })
    .catch(err => {
      res.send("error" + err);
    });
});

router.route("/delete/:id").delete((req, res, next) => {
  Commande.findOneAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      });
    }
  });
});

module.exports = router;
