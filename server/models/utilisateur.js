//utilisateur
const mongoose = require('mongoose');

let Utilisateur = new mongoose.Schema({

  numero: { type: String, maxlength: 200 },
  nom_utilisateur: { type: String, maxlength: 200 },
  adresse_mail: { type: String, maxlength: 200 },
  Mot_de_passe: { type: String, maxlength: 200 },
}, { timestamps: true});

Utilisateur.methods.toDto = function () {
  return {
    _id: this._id,
    numero: this.numero,
    nom_utilisateur: this.nom_utilisateur,
    adresse_mail: this.adresse_mail,
    Mot_de_passe: this.Mot_de_passe,
  }
};

 mongoose.model('USER', Utilisateur);
