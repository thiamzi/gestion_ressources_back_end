//bulletin de paie
const mongoose = require('mongoose');

let Commande = new mongoose.Schema({
    date: { type: Date },
    numero: {type: String},
    MAteriels_a_comm: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MATERIELS_C' }],
}, { timestamps: true });


Commande.methods.toDto = function() {
    return {
        comm_id: this._id,
        date: this.date,
        numero : this.numero
    };
};

mongoose.model('COMMANDE', Commande);