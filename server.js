const express = require('express');
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const connection = require('./connect');
const session = require('express-session');

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 6000000000
    }
}))

const bodyparser = require('body-parser');
//Utilisation body parser pour les recuperer des inputs
app.use(bodyparser.urlencoded({
    extended: false
}))
//Utilisation de ejs en template
app.set('view engine', 'ejs');
//Utilisation du css dans le dossier public
app.use('/', express.static('public'));
//Page accueil du site
app.get('/', (req, res) => {
    let userdisp = '';
    if (req.session.user) {
        userdisp = req.session.user.prenom;
    }
    res.render('index', {
        user: userdisp
    });
});
//Page d'inscription
app.get('/signup', (req, res) => {
    let message = '';
    res.render('forms/signup', {
        message: message
    });
});

//Lorsqu'on valide le formulaire d'inscription
app.post('/signup', (req, res) => {
    //on liste tous les mails utilisateurs
    let sqlListMails = "SELECT mail FROM Personne";
    connection.query(sqlListMails, (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        //si le mail pas trouvé dans la liste
        let message = '';
        let found = false;
        console.log(req.body.Mail);
        for (var i = 0; i < result.length; i++) {
            console.log(result[i].mail);
            if (result[i].mail == req.body.Mail) {
                found = found || true;
            }
        }
        if (!found) {
            //on hash le password
            bcrypt.hash(req.body.password, 10, function (err, hash) {
                let sqlInsertCandidate = "INSERT INTO Personne (nom, prenom, mail, ville, pays, naissance, password, idRole) VALUES('" + req.body.Nom + "','" + req.body.Prenom + "','" + req.body.Mail + "','" + req.body.Ville + "','" + req.body.Pays + "','" + req.body.date_naissance + "','" + hash + "',2)";
                connection.query(sqlInsertCandidate, (err, result) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    res.redirect("/");
                });
            });

        } else {
            message = 'Le mail existe déjà';
            res.render('forms/signup', {
                message: message
            });
        }
    });
});


//Tableau de bord d'un candidat une fois connecté
app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        if (req.session.user.idRole == 1) {
        	let lst= "SELECT nom,prenom,DATE_FORMAT(date,'%d/%m/%Y %H:%i') AS 'date' FROM Personne,PESD WHERE Personne.idPersonne = PESD.idCandidat;";
        	connection.query(lst,(err,result)=>{
        		if(err){
        			console.log(err);
        		}else {
        			res.render('dashboard_mediateur/index',{result:result});
        		}
        	})
            
        } else if (req.session.user.idRole == 2) {
            let sqlListPESDCand = "SELECT PESD.idPESD, DATE_FORMAT(PESD.date,'%d/%m/%Y %H:%i') AS 'date', Personne.nom as nom,Personne.prenom as prenom FROM PESD, Personne WHERE PESD.idCandidat="+req.session.user.idPersonne+" AND PESD.idMediateur = Personne.idPersonne; SELECT PESD.idPESD, DATE_FORMAT(PESD.date,'%d/%m/%Y %H:%i') AS 'date', Personne.nom as nom,Personne.prenom as prenom FROM PESD, Personne WHERE PESD.idCandidat="+req.session.user.idPersonne+" AND PESD.idMediateur = Personne.idPersonne AND DATEDIFF(NOW(),PESD.date) >= 0;";
            connection.query(sqlListPESDCand,(err,result)=>{
                console.log(result);
                res.render('dashboard_candidat/index',{user:req.session.user, histoPESD:result[0], futurPESD:result[1]});
            });
            
        }
    }else{
        res.redirect("/");
    }
});

app.get('/dashboard/startPESD' , (req,res) => {
    if (req.session.user) {
        if (req.session.user.idRole == 1) {
            res.redirect('/') // à changer pour afficher le PESD du médiateur
        } else if (req.session.user.idRole == 2) {
            res.render('PESD/index');
        }
    } else res.redirect('/');

});

//Page de connexion
app.get('/signin', (req, res) => {
    let message = ''
    res.render('forms/signin', {
        message: message
    });
});
//Lorsqu'on valide le formulaire de connexion
app.post('/signin', (req, res) => {
    var mail = req.body.mail;
    var pass = req.body.pass;
    var sqlLogin = "SELECT idPersonne, nom, prenom, mail, ville, pays, naissance, idRole, password FROM Personne WHERE `mail`='" + mail + "'";
    connection.query(sqlLogin, (err, result) => {
        if (result.length) {
            bcrypt.compare(pass, result[0].password, function (err, rescrypt) {
                // rescrypt == true le mot de passe correspond
                if (rescrypt) {
                    console.log("bon password");
                    req.session.user = result[0];
                    res.redirect('/');
                } else {
                    console.log("mauvais password");
                    let message = 'Mot de passe incorrect';
                    res.render('forms/signin', {
                        message: message
                    });
                }
            });
        } else {
            console.log("mauvais login");
            let message = 'Login incorrect';
            res.render('forms/signin', {
                message: message
            });
        }
    });
});


//Lancement serveur pour app type heroku ou port 8080
const PORT = process.env.PORT || 8080;

server = app.listen(PORT, (req, res) => {
    console.log('Connected');
});

// socket

const io = require('socket.io')(server);

io.on('connection' , socket => {
    socket.on('answer' , data => {
        socket.broadcast.emit('answer' , {answer : data.answer} );
    });
});


module.exports = app;
