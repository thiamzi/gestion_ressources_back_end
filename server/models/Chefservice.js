//chef de service
const mongoose = require('mongoose');

let Chefservice = new mongoose.Schema({

  nom_utilisateur: { type: String, maxlength: 200 },
  adresse_mail: { type: String, maxlength: 200 },
  Mot_de_passe: { type: String, maxlength: 200 },
  Service: { type: mongoose.Schema.Types.ObjectId, ref: 'SERVICE' }
}, { timestamps: true});

Chefservice.methods.toDto = function () {
  return {
    _id: this._id,
    nom_utilisateur: this.nom_utilisateur,
    adresse_mail: this.adresse_mail,
    Mot_de_passe: this.Mot_de_passe,
    Service: this.Service,
  }
};

 mongoose.model('CHEFSERVICE', Chefservice);