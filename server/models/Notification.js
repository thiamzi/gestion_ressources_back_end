//Notfication
const mongoose = require('mongoose');

let Notification = new mongoose.Schema({
    sender: { type: String, maxlength: 200 },
    destinataire: { type: String, maxlength: 200 },
    contenu: { type: String, maxlength: 200 },
    vue: { type: Boolean, default: false },
    dateCreation: { type: String, maxlength: 200 },
});

Notification.methods.toDto = function() {
    return {
        _id: this._id,
        sender: this.sender,
        destinataire: this.destinataire,
        contenu: this.contenu,
        vue: this.vue,
        dateCreation: this.dateCreation,
    }
};

mongoose.model('NOTIFICATION', Notification);