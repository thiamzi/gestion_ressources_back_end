//bposte
const mongoose = require('mongoose');
const Bulletin = mongoose.model('BULLETIN_PAIE');
let Employer = new mongoose.Schema({

    Nom: { type: String, maxlegnth: 200 },
    Prenom: { type: String, maxlegnth: 200 },
    Nss: { type: String, maxlegnth: 15 },
    Adresse: { type: String, maxlegnth: 200 },
    Statut: { type: String, maxlegnth: 200 },
    Sexe: { type: String, maxlegnth: 200 },
    Date_naiss: { type: Date },
    Anciennete: { type: Date },
    Email: { type: String, maxlegnth: 200 },
    Telephone: { type: Number, maxlegnth: 9 },
    poste: { type: mongoose.Schema.Types.ObjectId, ref: 'POSTE' },
    Bulletins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BULLETIN_PAIE' }]



}, { timestamps: true });


Employer.methods.toDto = function() {
    return {
        emp_id: this._id,
        Nom: this.Nom,
        Prenom: this.Prenom,
        Nss: this.Nss,
        Adresse: this.Adresse,
        Sexe: this.Sexe,
        Statut: this.Statut,
        Anciennete: this.Anciennete,
        Date_naiss: this.Date_naiss,
        Email: this.Email,
        Telephone: this.Telephone,
        Poste: this.poste,
        Bulletins: this.Bulletins

    };
};
Employer.methods.sup = function(employer) {
    for (let b in employer.Bulletins) {
        Bulletin.findById(b)
            .then((bulletin) => {
                if (bulletin) {
                    bulletin.sup(bulletin);
                    bulletin.remove();
                }
            });
    }


};

mongoose.model('EMPLOYER', Employer);