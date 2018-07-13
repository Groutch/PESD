const express = require('express');
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

const bodyparser = require('body-parser');
//Utilisation body parser pour les recuperer des inputs
app.use(bodyparser.urlencoded({ extended: false }))
//Utilisation de ejs en template
app.set('view engine','ejs');
//Utilisation du css dans le dossier public
app.use('/',express.static('public'));
//Page accueil du site
app.get('/' , (req,res) =>{
	res.render('index');
});
//Page d'inscription
app.get('/signup',(req,res)=>{
	res.render('forms/signup');
});
//Tableau de bord d'un candidat une fois connecté
app.get('/dashboard-c' , (req,res) => {
	res.render('dashboard_candidat/index.ejs');
});
//Page de connexion
app.get('/signin',(req,res)=>{
	res.render('forms/signin');
});
//Lancement serveur pour app type heroku ou port 8080
const PORT = process.env.PORT || 8080; 

app.listen(PORT , (req,res) => {
	console.log('Connected');
});

module.exports = app ;