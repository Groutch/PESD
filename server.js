const express = require('express');
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const connection = require('./connect');
const session = require('express-session');
const nodemailer = require('nodemailer');
app.locals.moment = require('moment');
//Lancement serveur pour app type heroku ou port 8080
const PORT = process.env.PORT || 8080;
server = app.listen(PORT, (req, res) => {
});
const io = require('socket.io')(server);

const {checkStep} = require('./utils/utils.js');

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 6000000000
    }
}));
//Fonction anti-injection
function secure(str) {
    if (str == null) return '';

    return String(str).
    replace(/&/g, '&amp;').
    replace(/</g, '&lt;').
    replace(/>/g, '&gt;').
    replace(/"/g, '&quot;').
    replace(/'/g, '&#039;').
    replace(/--/g, '&#151;').
    replace(/;/g, '&#59;');
};

const bodyparser = require('body-parser');
//Utilisation body parser pour les recuperer des inputs
app.use(bodyparser.urlencoded({
    extended: false
}))
//Utilisation de ejs en template
app.set('view engine', 'ejs');
//Utilisation du css dans le dossier public
app.use(express.static('public'));
app.use('/candidat', express.static('public'))
//Page accueil du site
app.get('/', (req, res) => {
    let userdisp = '';
    if (req.session.user) {
        userdisp = req.session.user.prenom;
    }
    res.render('index', {
        username: userdisp
    });
});
//Page d'inscription
app.get('/signup', (req, res) => {
    let message = '';
    let userdisp = '';
    if (req.session.user) {
        userdisp = req.session.user.prenom;
    }
    res.render('forms/signup', {
        message: message,
        username: userdisp
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
        for (var i = 0; i < result.length; i++) {
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
            let userdisp = '';
            if (req.session.user) {
                userdisp = req.session.user.prenom;
            }
            message = 'Le mail existe déjà';
            res.render('forms/signup', {
                message: message,
                username: userdisp
            });
        }
    });
});


//Tableau de bord d'un candidat une fois connecté
app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        let userdisp = req.session.user.prenom;
        if (req.session.user.idRole == 1) {
        	let lst= "SELECT nom,prenom,DATE_FORMAT(date,'%d/%m/%Y %H:%i') AS 'date' FROM Personne,PESD WHERE Personne.idPersonne = PESD.idCandidat AND DATEDIFF(PESD.date,NOW())>=0 ORDER BY DATEDIFF(date,NOW());";
        	connection.query(lst,(err,result)=>{
        		if(err){
        			console.log(err);
        		}else {
                    let sqlListPESDMed = "SELECT PESD.idPESD, DATE_FORMAT(PESD.date,'%d/%m/%Y %H:%i') AS 'date', Personne.nom as nom,Personne.prenom as prenom FROM PESD, Personne WHERE PESD.idMediateur=" + req.session.user.idPersonne + " AND PESD.idMediateur=Personne.idPersonne AND DATEDIFF(date,NOW())>=0 ORDER BY DATEDIFF(date,NOW());";
                    connection.query(sqlListPESDMed,(err,resultt)=>{
                        if(err){
                            console.log(err)
                        }else{
                            //console.log(resultt)
                            res.render('dashboard_mediateur/index', {
                                result: result,
                                username: userdisp,
                                listPESD: resultt,
                                etape: "A",
                            })}
                        });
                }
            })
        } else if (req.session.user.idRole == 2) {
            let sqlListPESDCand = "SELECT PESD.idPESD, DATE_FORMAT(PESD.date,'%d/%m/%Y %H:%i') AS 'date', Personne.nom as nom,Personne.prenom as prenom FROM PESD, Personne WHERE PESD.idCandidat=" + req.session.user.idPersonne + " AND PESD.idMediateur=Personne.idPersonne";
            connection.query(sqlListPESDCand, (err, result) => {
                res.render('dashboard_candidat/index', {
                    user: req.session.user,
                    listPESD: result,
                    username: userdisp
                });
            });

        }
    } else {
        res.redirect("/");
    }
});

//lorsqu'on souhaite modifier les infos utilisateur dans le dashboard:
app.post('/modifyInfos', (req, res) => {
    let nom = req.body.Nom;
    let prenom = req.body.Prenom;
    let ville = req.body.Ville;
    let pays = req.body.Pays;
    let naissance = req.body.date_naissance;
    let sqlModInfos = "UPDATE Personne SET nom ='" + nom + "', prenom = '" + prenom + "', ville = '" + ville + "', pays = '" + pays + "', naissance = '" + naissance + "' WHERE Personne.idPersonne =" + req.session.user.idPersonne;
    connection.query(sqlModInfos, (err, result) => {
        if (err) {
            console.log(err);
        }
    })
    //lorsque les modifications sont apportées on pense à modifier req.session.user avec les nouvelles infos
    let sqlUpdateUserInfo = "SELECT idPersonne, nom, prenom, mail, ville, pays, naissance, idRole, password FROM Personne WHERE idPersonne = " + req.session.user.idPersonne;
    connection.query(sqlUpdateUserInfo, (err, result) => {
        req.session.user = result[0];
        res.redirect("/dashboard");
    });

});

app.get('/startPESD', (req, res) => {
    // if (req.session.user && ) {
    //     // socket
    //     io.of('/'+req.session.user.idPersonne).on('connection', socket => {
    //         socket.on('message', data => {
    //             socket.broadcast.emit('message', {
    //                 message: data.message
    //             });
    //         });
    //     });
    //     if (req.session.user.idRole == 1) {
    //         res.render('PESD/index',{userid: req.session.user.idPersonne}) // à changer pour afficher le PESD du médiateur
    //     } else if (req.session.user.idRole == 2) {
    //         res.render('PESD/index',{userid: req.session.user.idPersonne});
    //     }
    // } else res.redirect('/');
    res.redirect('/');
});

app.post('/startPESD' , (req,res)=>{
    if(req.session.user && req.body.etape && req.body.id){
      let answer = secure(req.body.answer);
      let etape = req.body.etape;
      let idpesd = req.body.id;

    // socket
    io.of('/'+idpesd).on('connection', socket => {
        socket.on('message', data => {
            socket.broadcast.emit('message', {
                message: data.message
            });
        });
    });
    //si on est pas a debut on peut envoyer la réponse
    if (etape != "debut"){
    let sqlAnswer = `INSERT INTO Reponse (idPESD,numReponse,reponse) VALUES ('${idpesd}','${etape}','${answer}');`;
    // connection + query
    }

    console.log (sqlAnswer);
    let dataStep = checkStep(etape);

    if (req.session.user.idRole == 1) {
        res.render('PESD/index',{rankid: req.session.user.idRole,userid:req.session.user.idPersonne, consigne:dataStep[1] , histoire:dataStep[0],etape:dataStep[2], idP:idpesd});
    } else if (req.session.user.idRole == 2) {
        res.render('PESD/index',{rankid: req.session.user.idRole,userid:req.session.user.idPersonne, consigne:dataStep[1] , histoire:dataStep[0],etape:dataStep[2], idP:idpesd});
    }else {
        res.redirect('/');
    }
}else{res.redirect('/')}
});

//Page de connexion
app.get('/signin', (req, res) => {
    let message = ''
    let userdisp = '';
    if (req.session.user) {
        userdisp = req.session.user.prenom;
    }
    res.render('forms/signin', {
        message: message,
        username: userdisp
    });
});
app.post('/candidat', (req, res) => {
    let candidat = req.body.candidat;
    if (candidat == '') {
        res.redirect('/dashboard')
    } else
    res.redirect('/candidat/' + candidat + '');
})
app.get('/candidat/:id', (req, res) => {
    let candidate = secure(req.params.id);
    let cand = `Select nom,prenom,mail,ville,DATE_FORMAT(naissance,'%d/%m/%Y') AS 'naissance' FROM Personne WHERE (nom = '${candidate}' OR prenom = '${candidate}') AND idRole = 2 ;`;
    connection.query(cand, (err, result) => {
        if (err) {
            console.log(err)
        } else if (req.session.user) {
            if (req.session.user.idRole == 1) {
                userdisp = req.session.user.prenom;
                res.render('dashboard_mediateur/index', {
                    candidat: result,
                    username: userdisp
                })
            } else {
                res.redirect('/dashboard');
            }
        } else {
            res.redirect('/dashboard');
        }
    })
})
//Lorsqu'on valide le formulaire de connexion
app.post('/signin', (req, res) => {
    var mail = req.body.mail;
    var pass = req.body.pass;
    let userdisp = '';
    if (req.session.user) {
        userdisp = req.session.user.prenom;
    }
    var sqlLogin = "SELECT idPersonne, nom, prenom, mail, ville, pays, naissance, idRole, password FROM Personne WHERE `mail`='" + mail + "'";
    connection.query(sqlLogin, (err, result) => {
        if (result.length) {
            bcrypt.compare(pass, result[0].password, function (err, rescrypt) {
                // rescrypt == true le mot de passe correspond
                if (rescrypt) {
                    req.session.user = result[0];
                    res.redirect('/');
                } else {
                    let message = 'Mot de passe incorrect';
                    res.render('forms/signin', {
                        message: message,
                        username: userdisp
                    });
                }
            });
        } else {
            let message = 'Login incorrect';
            res.render('forms/signin', {
                message: message,
                username: userdisp
            });
        }
    });
});
//Logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/');
    });
});
//Pour une prevision PESD

app.get('/rdv',(req,res)=>{
    let lst=`SELECT * FROM Personne WHERE idRole = 2;`
    if(req.session.user){
    connection.query(lst,(err,result)=>{
        if (err){
            console.log(err)
        }else {
            let verif=`SELECT Personne.nom,Personne.prenom,DATE_FORMAT(PESD.date,'%d/%m/%Y %H:%i') AS date FROM PESD,PERSONNE WHERE Personne.idPersonne=PESD.idCandidat AND DATEDIFF(date,NOW())>=0 ORDER BY DATEDIFF(date,NOW()) ;`;
            connection.query(verif,(err,resultt)=>{
                if(req.session.user){
                    if(req.session.user.idRole == 1){
                        res.render('dashboard_mediateur/agenda',{username: req.session.user.prenom,list:result,verif:resultt});
                    }else {
                        res.redirect('/')
                    }
                }else{
                    res.redirect('/');
                }
            })}
        })
}else{res.redirect('/')}
});
//verification prise de rendez-vous
app.post('/rdv',(req,res)=>{
    if(req.session.user){
    if(req.body.date=="" || req.body.time==""){
        let lst=`SELECT * FROM Personne WHERE idRole= 2;`
        connection.query(lst,(err,result)=>{
            if(err){
                console.log(err)
            }else{
               res.render('dashboard_mediateur/agenda',{list:result,username: req.session.user.prenom,fail:req.session.user});
           }
       })
    }else{
        let mediateur=req.session.user.idPersonne;
        let date=req.body.date+' '+req.body.time+':00';
        date=secure(date);
        let candidat=secure(req.body.candidat);
    //req.body.candidat = option choisi , req.body.date = date choisi, req.body.time= heure
    let rdv=`INSERT INTO PESD (date,idCandidat,idMediateur) VALUES ('${date}','${candidat}','${mediateur}')`;
    connection.query(rdv,(err,result)=>{
        if(err){
            console.log(err)
        }else {
           res.redirect('/rdv');
       }
   })
}}else{res.redirect('/')}
});

module.exports = app;
