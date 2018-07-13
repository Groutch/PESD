CREATE DATABASE Plaisir;
USE Plaisir;


CREATE TABLE Candidat(
  idCandidat INT NOT NULL AUTO_INCREMENT,
  nom VARCHAR(45) NOT NULL,
  prenom VARCHAR(45) NOT NULL,
  mail VARCHAR(45) NOT NULL,
  ville VARCHAR(45) NOT NULL,
  pays VARCHAR(45) NOT NULL,
  naissance DATE NOT NULL,
  password VARCHAR(45) NOT NULL,
  PRIMARY KEY(idCandidat)
  );
  
CREATE TABLE Mediateur(
  idMediateur INT NOT NULL AUTO_INCREMENT,
  nom VARCHAR(45) NOT NULL,
  prenom VARCHAR(45) NOT NULL,
  mail VARCHAR(45) NOT NULL,
  password VARCHAR(45) NOT NULL,
  PRIMARY KEY(idMediateur)
  );
 
 CREATE TABLE PESD(
   idPESD INT NOT NULL AUTO_INCREMENT,
   date DATETIME NOT NULL,
   idMediateur INT NOT NULL,
   idCandidat INT NOT NULL,
   PRIMARY KEY(idPESD),
   FOREIGN KEY(idMediateur) REFERENCES Mediateur(idMediateur),
   FOREIGN KEY(idCandidat) REFERENCES Candidat(idCandidat)
   );
   
 CREATE TABLE Reponse(
     idReponse INT NOT NULL AUTO_INCREMENT,
     numReponse VARCHAR(2) NOT NULL,
     reponse TEXT NOT NULL,
     idPESD INT NOT NULL,
     PRIMARY KEY(idReponse),
     FOREIGN KEY(idPESD) REFERENCES PESD(idPESD)
     );

CREATE TABLE Cotation(
  idCotation INT NOT NULL AUTO_INCREMENT,
  cotation VARCHAR(45) NOT NULL,
  numstrat VARCHAR(45) NOT NULL,
  idPESD INT NOT NULL,
  PRIMARY KEY(idCotation),
  FOREIGN KEY(idPESD) REFERENCES PESD(idPESD)
  );

CREATE TABLE MotClef(
  idMotClef INT NOT NULL AUTO_INCREMENT,
  mot VARCHAR(45) NOT NULL,
  valeur INT NOT NULL,
  numReponse VARCHAR(2),
  PRIMARY KEY(idMotClef)
  );
