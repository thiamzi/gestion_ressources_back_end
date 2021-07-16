//service
const mongoose = require('mongoose');
let Service = new mongoose.Schema({
    Active: { type: Boolean, default: true },
    Libelle_s: { type: String },
    Description_s: { type: String },
    Postes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'POSTE' }],
    MAteriels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MATERIEL' }],
    MAteriels_a_comm: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MATERIELS_C' }],
    chef: { type: mongoose.Schema.Types.ObjectId, ref: 'CHEFSERVICE', default: null }
}, { timestamps: true })

Service.methods.toDto = function() {
    return {
        Active: this.Active,
        ser_id: this._id,
        Libelle_s: this.Libelle_s,
        Description_s: this.Description_s,
        Postes: this.Postes,
        chef: this.chef,
        MAteriels_a_comm : this.MAteriels_a_comm
    }
};

mongoose.model('SERVICE', Service);