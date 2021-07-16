let express = require('express');
let path = require('path');
let http = require('http');
let bodyParser = require('body-parser');
let cors = require('cors')
let mongoose = require('mongoose');

//Connect to mongoDB server
mongoose.connect('mongodb://localhost:27017/gestionRessource', { useNewUrlParser: true }).then(() => console.log("connecte"));
mongoose.set('debug', true);

//Init express
const app = express();

//Enable bodyParser
app.use(bodyParser.json());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));

//Enable CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

/*//Static path to dist
app.use(express.static(path.join(__dirname, './Gestion/src/app')));
 
//Catch all other routes and return to the index file
app.get('*', (req, res) =>{
   res.sendFile(path.join(__dirname, './Gestion/src/app/app.component.html'));
})*/

//Get environment port or use 3000
const port = process.env.PORT || '4000';
app.set('port', port);

//Create HTTP server.
const server = http.createServer(app);

//Listen on port
server.listen(port, () => console.log(`API running on localhost:${port}`));

require('./server/models/info');
require('./server/models/Bulletin_paie');
require('./server/models/Employer');
require('./server/models/Poste');
require('./server/models/Materiels');
require('./server/models/Service');
require('./server/models/Notification');
require('./server/models/Materiels_comm');
require('./server/models/Commande');
require('./server/models/Chefservice');
require('./server/models/utilisateur');
require('./server/models/Hopitale');


//Get our API routes
const Users = require('./server/api/utlisateurR');
app.use('/users', Users);

const Chef = require('./server/api/ChefserviceR');
app.use('/chef', Chef);

const Notfications = require('./server/api/NotificationR');
app.use('/notifications', Notfications);

const Service = require('./server/api/serviceR');
app.use('/services', Service);

const Poste = require('./server/api/posteR');
app.use('/postes', Poste);

const EMployer = require('./server/api/employerR');
app.use('/employers', EMployer);

const Bulletin = require('./server/api/bulletin_paieR');
app.use('/bulletins', Bulletin);

const Info = require('./server/api/infoR');
app.use('/infos', Info);

const Materiels = require('./server/api/materielsR');
app.use('/materiels', Materiels);

const Commande = require('./server/api/commandeR');
app.use('/commandes', Commande);

const Materiels_comm = require('./server/api/materiels_commR');
app.use('/materiels_comms', Materiels_comm);

const Hopital = require('./server/api/HopitalR');
app.use('/hopital', Hopital);