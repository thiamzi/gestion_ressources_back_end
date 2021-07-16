//bulletin de paie
const mongoose = require('mongoose');
const Info = mongoose.model('INFO');


let Bulletin = new mongoose.Schema({
    Date_c: { type: Date, defalut: new Date() },
    Periode: { type: String },
    Employer: { type: mongoose.Schema.Types.ObjectId, ref: 'EMPLOYER' },
    Infos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'INFO' }]

}, { timestamps: true });

Bulletin.methods.toDto = function() {
    return {
        bull_id: this._id,
        Date_c: this.Date_c,
        Infos: this.Infos,
        Periode: this.Periode,
    };
};
Bulletin.methods.sup = function(bulletin) {
    for (let i in bulletin.Infos) {
        Info.findById(i)
            .then((info) => {
                if (info) {
                    info.remove();
                }
            });
    }

};


mongoose.model('BULLETIN_PAIE', Bulletin);