//poste
const mongoose = require('mongoose');

let Poste = new mongoose.Schema({
    Active: { type: Boolean, default: true },
    Libelle_p: { type: String },
    Description_p: { type: String },
    Service: { type: mongoose.Schema.Types.ObjectId, ref: 'SERVICE' },
    Employers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EMPLOYER' }]

}, { timestamps: true })


Poste.methods.toDto = function() {
    return {
        Active: this.Active,
        pos_id: this._id,
        Libelle_p: this.Libelle_p,
        Description_p: this.Description_p,
        Employers: this.Employers
    }
};

mongoose.model('POSTE', Poste);