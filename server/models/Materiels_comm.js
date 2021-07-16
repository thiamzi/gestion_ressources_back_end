//Materiels à commander
const mongoose = require("mongoose");

let Materiel_comm = new mongoose.Schema({
  reference: { type: String },
  Quantite: { type: Number },
  description: { type: String },
  Prix_unitair: { type: Number },
  Valide: { type: Boolean },
  Commande: { type: mongoose.Schema.Types.ObjectId, ref: "COMMANDE" },
  Service: { type: mongoose.Schema.Types.ObjectId, ref: "SERVICE" },
});

Materiel_comm.methods.toDto = function() {
  return {
    mat_comm_id: this._id,
    reference: this.reference,
    Quantite: this.Quantite,
    description: this.description,
    Prix_unitair: this.Prix_unitair,
    Valide : this.Valide,
    Service: this.Service,
    Commande: this.Commande,
  };
};

Materiel_comm.methods.supprimer = function(materiel) {
  materiel.remove();
};
mongoose.model("MATERIELS_C", Materiel_comm);
