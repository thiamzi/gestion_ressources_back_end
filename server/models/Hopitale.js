//Hopital
const mongoose = require('mongoose');
let Hopital = new mongoose.Schema({
    Siret: { type: String },
    NomH: { type: String },
    AdresseH: { type: String },
    Telephone: { type: Number },

})

Hopital.methods.toDto = function() {
    return {
        _id: this._id,
        Siret: this.Siret,
        NomH: this.NomH,
        AdresseH: this.AdresseH,
        Telephone : this.Telephone
    }
};

mongoose.model('HOPITAL', Hopital);