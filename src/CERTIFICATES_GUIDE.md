# 📜 Guide de Gestion des Certificats

## 🎯 Vue d'ensemble

Ce guide explique comment uploader et gérer les images de vos certificats dans le portfolio.

---

## 📋 Liste des Certifications

### Certifications déjà configurées (16 au total)

1. **cert1** - CCNA 1: Introduction to Networks
2. **cert2** - CCNA 2: Switching, Routing, and Wireless Essentials
3. **cert2b** - CCNA 3: Enterprise Networking, Security, and Automation
4. **cert3** - Python Essential 1
5. **cert4** - Python Essential 2
6. **cert5** - AWS Cloud Practitioner
7. **cert6** - NDG Linux Essential
8. **cert7** - Linux Server 1
9. **cert8** - CyberOps
10. **cert9** - ITE (IT Essentials)
11. **cert10** - IoT Fundamentals
12. **cert11** - ADDS (Active Directory Domain Services) - Microsoft
13. **cert12** - FSMO (Flexible Single Master Operations) - Microsoft
14. **cert13** - Introduction à la Cybersécurité - Cisco
15. **cert14** - GPO (Group Policy Objects) - Microsoft
16. **cert15** - DNS (Domain Name System) - Microsoft
17. **cert16** - Windows Operating System Fundamentals - Cisco

---

## 🚀 Comment Uploader un Certificat

### Méthode 1 : Via Supabase Admin (Recommandée)

1. **Accéder à l'interface admin**
   - Cliquez sur l'icône ⚙️ en haut à droite
   - Connectez-vous avec : `admin@portfolio.local` / `Sogn@ne2K2`

2. **Uploader l'image**
   - Allez dans l'onglet "📁 Gestionnaire de Fichiers"
   - Glissez-déposez votre image de certificat (PNG, JPG, JPEG)
   - Ou cliquez sur "Sélectionner des fichiers"

3. **Nommer le fichier correctement**
   
   Le nom du fichier doit contenir l'identifiant du certificat pour être détecté automatiquement :
   
   | Certificat | Mots-clés à inclure dans le nom |
   |------------|----------------------------------|
   | CCNA 1 | `ccna1`, `ccna-1`, `CCNA1` |
   | CCNA 2 | `ccna2`, `ccna-2`, `CCNA2` |
   | CCNA 3 | `ccna3`, `ccna-3`, `CCNA3` |
   | Python 1 | `python1`, `python-1`, `Python1` |
   | Python 2 | `python2`, `python-2`, `Python2` |
   | AWS | `aws`, `AWS` |
   | Linux | `linux`, `Linux` |
   | Linux Server | `linuxserver`, `linux-server` |
   | CyberOps | `cyberops`, `cyber-ops` |
   | IT Essentials | `ite`, `IT-Essentials` |
   | IoT | `iot`, `IoT` |
   | ADDS Microsoft | `adds-microsoft`, `ADDS`, `Active-Directory` |
   | FSMO Microsoft | `fsmo-microsoft`, `FSMO` |
   | Intro Cybersécurité | `intro-cybersecurity`, `cybersecurity-intro` |
   | GPO Microsoft | `gpo-microsoft`, `GPO` |
   | DNS Microsoft | `dns-microsoft`, `DNS` |
   | Windows OS | `windows-os-cisco`, `Windows-Operating-System` |

4. **Liaison avec le projet (optionnel)**
   
   Dans l'éditeur de fichier :
   - Cliquez sur "✏️ Modifier" à côté du fichier uploadé
   - Dans "Lier à un projet", sélectionnez le certificat correspondant
   - Sauvegardez

---

## 📝 Exemples de Noms de Fichiers Valides

✅ **Bons exemples** :
- `CCNA1-Certificate.png`
- `cisco-ccna2-cert.jpg`
- `Python1-Essential.png`
- `ADDS-Microsoft-Certificate.jpg`
- `GPO-Microsoft-2024.png`
- `Introduction-Cybersecurity.png`

❌ **À éviter** :
- `certificat.png` (trop générique)
- `mon_diplome.jpg` (pas d'identification)
- `scan001.png` (pas de contexte)

---

## 🔍 Vérification du Fonctionnement

### 1. Logs de Débogage

Ouvrez la console du navigateur (F12) et vérifiez les logs :

```
🔍 CertificateService - Supabase détecté: true
📦 7 fichier(s) image trouvé(s) dans Supabase
🎓 5 certificat(s) trouvé(s): ["CCNA1-cert.png", "Python1.jpg", ...]
🎓 Recherche certificat: cert1 → ccna1
✅ Certificat trouvé par nom: CCNA1-cert.png
```

### 2. Tester un Certificat

1. Allez dans la section **CV**
2. Cliquez sur une certification (icône 🏆)
3. La modal devrait afficher :
   - **Si l'image est trouvée** : Votre certificat scanné
   - **Si l'image n'est pas trouvée** : Image par défaut Unsplash

---

## 🛠️ Dépannage

### Problème : "Image par défaut utilisée"

**Causes possibles** :
1. Le nom du fichier ne contient pas le bon mot-clé
2. Le fichier n'est pas de type "image"
3. Supabase n'est pas connecté

**Solutions** :
1. Renommez le fichier avec le bon mot-clé (voir tableau ci-dessus)
2. Vérifiez que le fichier est bien uploadé comme "image"
3. Vérifiez la connexion Supabase dans la console

### Problème : "Aucune image ne s'affiche"

**Solutions** :
1. Videz le cache du navigateur (Ctrl + Shift + R)
2. Vérifiez les logs de la console
3. Reconnectez-vous à l'interface admin

### Problème : "Les certificats ne sont pas listés"

**Solution** :
1. Ouvrez la console (F12)
2. Cherchez `📦 X fichier(s) image trouvé(s)`
3. Si 0 fichier : uploadez des images
4. Si des fichiers mais 0 certificat : vérifiez les noms

---

## 💡 Conseils

### 1. Format des Images
- **Format recommandé** : PNG (meilleure qualité pour les certificats)
- **Résolution** : 1920x1080 ou supérieur
- **Taille** : < 10 MB (limite Supabase)

### 2. Organisation
Utilisez des noms clairs :
```
CCNA1-Cisco-2023.png
CCNA2-Cisco-2024.png
Python1-Essential-Skills.png
ADDS-Microsoft-2024.png
```

### 3. Métadonnées
Dans l'éditeur de fichier Supabase, ajoutez :
- **Description** : "Certificat CCNA 1 - Introduction to Networks"
- **Tags** : `certification`, `cisco`, `networking`
- **Catégorie** : `certifications`

---

## 🔗 Mapping Automatique

Le système détecte automatiquement les certificats par :

1. **ID de certificat** (si défini manuellement via projectId)
2. **Nom de fichier** contenant les mots-clés
3. **Recherche flexible** (ignore les tirets, espaces, majuscules)

### Exemple de détection :

Fichier : `CCNA-1-Certificate.png`
- ✅ Détecté pour `cert1` (CCNA 1)
- Mapping : `cert1` → `ccna1` → recherche `ccna1` dans le nom

---

## 📊 Statistiques

Une fois uploadés, vous pouvez voir dans les logs :
- Nombre total de certificats disponibles
- Certificats avec/sans image personnalisée
- Taux de correspondance

---

## 🎯 Objectif

**But final** : Avoir vos 16+ vrais certificats affichés dans le portfolio au lieu des images génériques Unsplash.

**Avancement** : 
- ☐ 0/16 certificats uploadés
- Mise à jour automatique après chaque upload

---

## 🆘 Support

Si vous rencontrez des problèmes :

1. **Vérifiez les logs** dans la console (F12)
2. **Testez la connexion** Supabase
3. **Vérifiez les noms** de fichiers
4. **Re-uploadez** si nécessaire

---

**Dernière mise à jour** : 4 octobre 2025
