# 🔄 Guide de Renommage des Certificats

## 📊 Analyse de vos fichiers actuels

### ✅ Fichiers Détectés dans Supabase (9)

| Fichier Actuel | Certificat Cible | Action Requise |
|----------------|------------------|----------------|
| **Python2.PNG** | ✅ Python Essential 2 (cert4) | ✅ OK - Sera détecté |
| **NDG-Linux.PNG** | ✅ NDG Linux Essential (cert6) | ✅ OK - Sera détecté |
| **Itessentiel-cert.PNG** | ✅ IT Essentials (cert9) | ✅ OK - Sera détecté |
| **GPO.PNG** | ✅ GPO Microsoft (cert14) | ✅ OK - Sera détecté |
| **DNS.PNG** | ✅ DNS Microsoft (cert15) | ✅ OK - Sera détecté |
| **Cybersec.PNG** | ✅ Intro Cybersécurité (cert13) | ✅ OK - Sera détecté |
| **CCNA-ENSA.PNG** | ✅ CCNA 3 (cert2b) | ✅ OK - Sera détecté |
| **ADDS-FSMO.PNG** | ✅ FSMO Microsoft (cert12) | ✅ OK - Sera détecté |
| **ADDS.PNG** | ✅ ADDS Microsoft (cert11) | ✅ OK - Sera détecté |
| **NB.PNG** | ❓ Non identifié | ⚠️ À renommer ou supprimer |

### ❌ Certificats Manquants

Ces certificats n'ont pas encore de fichier uploadé :

1. **CCNA 1** (cert1) - Mot-clé : `ccna1`
2. **CCNA 2** (cert2) - Mot-clé : `ccna2`
3. **Python Essential 1** (cert3) - Mot-clé : `python1`
4. **AWS Cloud Practitioner** (cert5) - Mot-clé : `aws`
5. **Linux Server 1** (cert7) - Mot-clé : `linuxserver` ou `linux-server`
6. **CyberOps** (cert8) - Mot-clé : `cyberops`
7. **IoT Fundamentals** (cert10) - Mot-clé : `iot`
8. **Windows OS Cisco** (cert16) - Mot-clé : `windows`

---

## 🎯 Actions Recommandées

### Option 1 : Uploader les Certificats Manquants (Recommandé)

Si vous avez ces certificats, uploadez-les avec ces noms :

```
CCNA1.PNG          → CCNA 1: Introduction to Networks
CCNA2.PNG          → CCNA 2: Switching, Routing, and Wireless
Python1.PNG        → Python Essential 1
AWS.PNG            → AWS Cloud Practitioner
LinuxServer.PNG    → Linux Server 1
CyberOps.PNG       → CyberOps
IoT.PNG            → IoT Fundamentals
Windows-OS.PNG     → Windows Operating System Fundamentals
```

### Option 2 : Identifier "NB.PNG"

**Question** : Le fichier `NB.PNG` correspond à quel certificat ?

Possibilités :
- Si c'est **CCNA 1** → Renommez en `CCNA1.PNG`
- Si c'est **Python 1** → Renommez en `Python1.PNG`
- Si c'est autre chose → Supprimez ou clarifiez

---

## 🔧 Comment Renommer dans Supabase

### Méthode 1 : Via l'Interface Admin du Portfolio

1. Cliquez sur ⚙️ en haut à droite
2. Connectez-vous : `admin@portfolio.local` / `Sogn@ne2K2`
3. Dans "Gestionnaire de Fichiers", trouvez le fichier
4. Cliquez sur ✏️ **Modifier**
5. Changez le **Nom** du fichier
6. Cliquez sur **Sauvegarder**

### Méthode 2 : Via le Dashboard Supabase (Plus rapide)

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet `ajubxxipfclkgmlpyzvk`
3. Allez dans **Storage** → `portfolio-files`
4. Trouvez le fichier → Cliquez sur **⋮** (menu)
5. **Move/Rename** → Changez le nom
6. Sauvegardez

⚠️ **Important** : Si vous renommez via le dashboard Supabase, vous devez aussi mettre à jour l'entrée dans la table `portfolio_files` :

```sql
-- Dans SQL Editor
UPDATE portfolio_files 
SET name = 'NouveauNom.PNG' 
WHERE name = 'AncienNom.PNG';
```

---

## 📝 Tableau de Correspondance Complet

### Section CV (Timeline)

| ID Cert | Titre | Mots-clés Détectés | Votre Fichier |
|---------|-------|-------------------|---------------|
| cert1 | CCNA 1 | `ccna1`, `ccna-1` | ❌ MANQUANT |
| cert2 | CCNA 2 | `ccna2`, `ccna-2`, `srwe` | ❌ MANQUANT |
| cert2b | CCNA 3 | `ccna3`, `ensa` | ✅ CCNA-ENSA.PNG |
| cert3 | Python 1 | `python1`, `python-1` | ❌ MANQUANT |
| cert4 | Python 2 | `python2`, `python-2` | ✅ Python2.PNG |
| cert5 | AWS | `aws` | ❌ MANQUANT |
| cert6 | Linux Essential | `linux`, `ndg` | ✅ NDG-Linux.PNG |
| cert7 | Linux Server | `linuxserver`, `linux-server` | ❌ MANQUANT |
| cert8 | CyberOps | `cyberops`, `cyber-ops` | ❌ MANQUANT |
| cert9 | IT Essentials | `ite`, `itessential` | ✅ Itessentiel-cert.PNG |
| cert10 | IoT | `iot` | ❌ MANQUANT |
| cert11 | ADDS | `adds` | ✅ ADDS.PNG |
| cert12 | FSMO | `fsmo` | ✅ ADDS-FSMO.PNG |
| cert13 | Intro Cyber | `cybersec`, `intro`, `cybersecurity` | ✅ Cybersec.PNG |
| cert14 | GPO | `gpo` | ✅ GPO.PNG |
| cert15 | DNS | `dns` | ✅ DNS.PNG |
| cert16 | Windows OS | `windows`, `windows-os` | ❌ MANQUANT |

### Section Projets & Certifications

| ID | Titre | Alias de Recherche | Fichiers Matchés |
|----|-------|-------------------|------------------|
| cert1 | Python Essential 1 & 2 | `python1`, `python2` | ✅ Python2.PNG (partiel) |
| cert2 | CCNA 1 & 2 | `ccna1`, `ccna2` | ❌ MANQUANT |
| cert3 | NDG Linux Essential | `linux`, `ndg` | ✅ NDG-Linux.PNG |
| cert4 | CyberOps | `cyberops` | ❌ MANQUANT |
| cert5 | Linux Server 1 | `linuxserver` | ❌ MANQUANT |
| cert6 | ITE (IT Essentials) | `ite`, `itessential` | ✅ Itessentiel-cert.PNG |

---

## ✅ Plan d'Action Étape par Étape

### Étape 1 : Identifier NB.PNG
1. Ouvrez le fichier `NB.PNG` pour voir de quel certificat il s'agit
2. Renommez-le selon le certificat (ex: si c'est CCNA1 → renommez en `CCNA1.PNG`)

### Étape 2 : Uploader les Certificats Manquants
Pour chaque certificat que vous possédez :
1. Allez dans l'admin (⚙️)
2. Uploadez avec le bon nom (voir tableau ci-dessus)

### Étape 3 : Vérifier
1. Ouvrez la console (F12)
2. Cliquez sur un certificat
3. Vérifiez les logs :
   ```
   ✅ Certificat trouvé par nom: CCNA1.PNG
   📍 Source: Supabase (personnalisée)
   ```

### Étape 4 : Tester
Cliquez sur chaque certification et vérifiez que la bonne image s'affiche

---

## 💡 Noms Recommandés (Simple et Efficace)

Pour faciliter la détection, utilisez ces noms exacts :

```
CCNA1.PNG
CCNA2.PNG
CCNA3.PNG (ou gardez CCNA-ENSA.PNG)
Python1.PNG
Python2.PNG (déjà OK)
AWS.PNG
Linux.PNG (ou gardez NDG-Linux.PNG)
LinuxServer.PNG
CyberOps.PNG
ITE.PNG (ou gardez Itessentiel-cert.PNG)
IoT.PNG
ADDS.PNG (déjà OK)
FSMO.PNG (ou gardez ADDS-FSMO.PNG)
Cybersec.PNG (déjà OK)
GPO.PNG (déjà OK)
DNS.PNG (déjà OK)
Windows.PNG
```

---

## 🆘 Besoin d'Aide ?

**Question** : Quel certificat correspond à `NB.PNG` ?

Répondez avec le nom du certificat (ex: "CCNA 1") et je vous guiderai pour le renommage approprié.

**Vous ne possédez pas tous les certificats ?**

Pas de problème ! Le système affichera :
- ✅ Vos certificats uploadés avec leurs vraies images
- 📷 Images génériques Unsplash pour les certificats manquants

---

**Date de création** : 4 octobre 2025
