//Materiels
const mongoose = require('mongoose');

let Materiel = new mongoose.Schema({
    Libelle_m: { type: String },
    Description_m: { type: String },
    aCommande: { type: Number },
    stock: { type: Number },
    Prix : { type: Number },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'SERVICE' }
}, { timestamps: true })


Materiel.methods.toDto = function() {
    return {
        mat_id: this._id,
        Libelle_m: this.Libelle_m,
        Description_m: this.Description_m,
        aCommande: this.aCommande,
        Prix : this.Prix,
        stock: this.stock
    }
};

mongoose.model('MATERIEL', Materiel);