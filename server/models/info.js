//info
const mongoose = require('mongoose');

let Info = new mongoose.Schema({

    CSS: { type: String, maxlength: 200 },
    Base: { type: Number },
    Taux_salarial: { type: Number },
    part_salarie: { type: Number },
    part_employeur: { type: Number },
    bulletin: { type: mongoose.Schema.Types.ObjectId, ref: 'BULLETIN_PAIE' }
});

Info.methods.toDto = function() {
    return {
        info_id: this._id,
        CSS: this.CSS,
        Base: this.Base,
        Taux_salarial: this.Taux_salarial,
        part_salarie: this.part_salarie,
        part_employeur: this.part_employeur
    }
};



mongoose.model('INFO', Info);