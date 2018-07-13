const express = require('express');
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
const connection = require('./connect');

const bodyparser = require('body-parser')
app.use(bodyparser.urlencoded({
    extended: false
}))

app.set('view engine', 'ejs');

app.use('/', express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/signup', (req, res) => {
    res.render('forms/signup');
});

//Lors qu'on valide le formulaire d'inscription
app.post('/signup', (req, res) => {
    //on liste tous les mails utilisateurs
    let sqlListMails = "SELECT mail FROM Personne";
    connection.query(sqlListMails, (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        //si le mail pas trouvé dans la liste
        if (result.indexOf(req.body.Mail) == -1) {
            //on hash le password
            bcrypt.hash(req.body.password, 10, function (err, hash) {
                let sqlInsertCandidate = "INSERT INTO Personne (nom, prenom, mail, ville, pays, naissance, password, idRole) VALUES('" + req.body.Nom + "','" + req.body.Prenom + "','" + req.body.Mail + "','" + req.body.Ville + "','" + req.body.Pays + "','" + req.body.date_naissance + "','" + hash + "',2)";
                console.log(sqlInsertCandidate);
                connection.query(sqlInsertCandidate, (err, result) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    res.redirect("/");
                });
            });

        } else {
            res.redirect("/signup");
        }
    });

});

app.get('/dashboard-c', (req, res) => {
    res.render('dashboard_candidat/index.ejs');
});



const PORT = process.env.PORT || 8080;

app.listen(PORT, (req, res) => {
    console.log('Connected');
});

module.exports = app;
