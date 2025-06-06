gestionprojets

CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "fname" VARCHAR(100) NOT NULL,
  "lname" VARCHAR(100) NOT NULL,
  "email" VARCHAR(150) NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "role" VARCHAR(20) NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "poste_ormvag" VARCHAR(150)
);

INSERT INTO "users" (
  "fname",
  "lname",
  "email",
  "password",
  "role",
  "poste_ormvag"
) VALUES (
  'Demo',
  'Admin',
  'administrateur@ormvag.com',
  '$2b$10$ZoNohtTUGdwBFJiVRTMYKuO7AncN7fYzL.O9xQBNgHqAPsn0piEqS',
  'Administrateur',
  'Chef de services'
);

CREATE TABLE IF NOT EXISTS "projets" (
  "INDICE" VARCHAR,
  "EPI" INTEGER,
  "AR" INTEGER,
  "ET" INTEGER,
  "N° Boite" INTEGER,
  "Intitulé du Projet" VARCHAR,
  "Etude" VARCHAR,
  "Date" INTEGER,
  "Secteur" VARCHAR,
  "TI" VARCHAR,
  "titre du documemt" VARCHAR,
  "Nbre des documents A3" INTEGER,
  "Nbre des documents A4" INTEGER,
  "Nbre des plans" INTEGER,
  "TYPE DE DOCUMENT A4" VARCHAR,
  "TYPE DE DOCUMENT A3" VARCHAR,
  "TYPE DE DOCUMENT A0" VARCHAR,
  "Nbre des copies" INTEGER,
  "Nbre des examplaire" INTEGER,
  "N° DOSSIER" INTEGER,
  "Salle" VARCHAR,
  "id" SERIAL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS "projets2" (
  "indice" VARCHAR,
  "NOM" VARCHAR,
  "Nature du plan" VARCHAR,
  "type d'ouvrage / réseau" VARCHAR,
  "feuille" VARCHAR,
  "Secteur" VARCHAR,
  "realisateur" VARCHAR,
  "Echelle" VARCHAR,
  "mappe" VARCHAR,
  "Annee" VARCHAR,
  "tranche d'irrigation" VARCHAR,
  "id" SERIAL PRIMARY KEY
);

