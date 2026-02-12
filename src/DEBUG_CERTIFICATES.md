# 🔍 Guide de Débogage - Images de Certificats

## 🎯 Problème : Les images ne s'affichent pas

Si vous avez uploadé vos certificats dans Supabase mais qu'ils ne s'affichent pas, suivez ce guide étape par étape.

---

## ✅ Étape 1 : Vérifier que Supabase est bien connecté

### 1.1 Ouvrir la Console
- Appuyez sur **F12** (ou clic droit → Inspecter)
- Allez dans l'onglet **Console**

### 1.2 Chercher ces messages
Lors du chargement de la page, vous devriez voir :
```
🔧 Configuration Supabase:
  URL: https://ajubxxipfclkgmlpyzvk.supabase.co
  Key: ✅ Configurée
🔍 CertificateService - Supabase détecté: true
```

✅ **Si vous voyez ces messages** : Supabase est bien connecté, passez à l'étape 2

❌ **Si vous ne voyez pas ces messages** : Problème de configuration Supabase
   - Vérifiez `/lib/supabase.ts`
   - Assurez-vous que l'URL et la clé sont correctes

---

## ✅ Étape 2 : Vérifier que les fichiers sont dans Supabase

### 2.1 Test depuis le Modal
1. Cliquez sur n'importe quelle certification (icône 🏆)
2. Dans le modal qui s'ouvre, cliquez sur **"🧪 Test Connexion"**
3. Une alerte va s'afficher avec le nombre de certificats trouvés

### 2.2 Analyser les logs
Dans la console, vous devriez voir :
```
🔄 Récupération des certificats depuis Supabase...
📦 5 fichier(s) image trouvé(s) dans Supabase
📋 Tous les fichiers: [...]
✅ Fichier certificat trouvé: CCNA1-Certificate.png
✅ Fichier certificat trouvé: Python1.jpg
🎓 5 certificat(s) trouvé(s) au total
```

### 2.3 Vérifier les fichiers listés
Les logs montrent **tous** les fichiers. Vérifiez :
- ✅ Vos fichiers sont listés ?
- ✅ Les noms contiennent les bons mots-clés ?
- ✅ Le type est "image" ?
- ✅ Les URLs sont présentes (public_url) ?

---

## ✅ Étape 3 : Vérifier le matching des certificats

### 3.1 Cliquer sur un certificat spécifique
Exemple : Cliquez sur **CCNA 1**

### 3.2 Logs attendus
```
🖼️ Chargement image pour certificat: cert1 - CCNA 1: Introduction to Networks
🔗 URL par défaut: https://images.unsplash.com/...
🎓 Recherche certificat: cert1 → ccna1
🔍 Recherche de "ccna1" parmi 5 certificat(s)
✅ Certificat trouvé par nom: CCNA1-Certificate.png
✅ Image trouvée pour cert1: https://ajubxxipfclkgmlpyzvk.supabase.co/storage/v1/object/public/portfolio-files/...
🖼️ URL finale utilisée: https://ajubxxipfclkgmlpyzvk.supabase.co/...
📍 Source: Supabase (personnalisée)
```

### 3.3 Si l'image n'est pas trouvée
```
🔍 Recherche de "ccna1" parmi 5 certificat(s)
❌ Aucun certificat trouvé pour: ccna1
📋 Certificats disponibles: ["Python1.jpg", "AWS-Cert.png", ...]
⚠️ Image par défaut utilisée pour cert1
📍 Source: Unsplash (défaut)
```

**Solution** : Le nom du fichier ne contient pas le bon mot-clé

---

## 🛠️ Solutions aux Problèmes Courants

### Problème 1 : "0 fichier(s) trouvé(s)"

**Cause** : Aucun fichier n'est dans Supabase ou problème de connexion

**Solution** :
1. Vérifiez la connexion admin Supabase (⚙️)
2. Allez dans "Gestionnaire de Fichiers"
3. Vérifiez que des fichiers sont listés
4. Si vide : Uploadez vos certificats

### Problème 2 : "Certificats trouvés mais aucun match"

**Cause** : Les noms de fichiers ne contiennent pas les bons mots-clés

**Solution** : Renommez vos fichiers dans Supabase

| Certificat | Nom du fichier doit contenir |
|------------|------------------------------|
| CCNA 1 | `ccna1` ou `ccna-1` ou `CCNA1` |
| CCNA 2 | `ccna2` ou `ccna-2` ou `CCNA2` |
| CCNA 3 | `ccna3` ou `ccna-3` ou `CCNA3` |
| Python 1 | `python1` ou `python-1` |
| Python 2 | `python2` ou `python-2` |
| AWS | `aws` ou `AWS` |
| Linux | `linux` |
| CyberOps | `cyberops` ou `cyber` |
| ADDS | `adds` ou `ADDS` |
| FSMO | `fsmo` ou `FSMO` |
| GPO | `gpo` ou `GPO` |
| DNS | `dns` ou `DNS` |

**Exemples de bons noms** :
- ✅ `CCNA1-Certificate.png`
- ✅ `cisco-ccna2-2024.jpg`
- ✅ `Python1-Essential.png`
- ✅ `ADDS-Microsoft.jpg`

### Problème 3 : "Fichiers trouvés mais URLs invalides"

**Cause** : Le bucket Supabase n'est pas public ou mal configuré

**Solution** :
1. Allez dans le tableau de bord Supabase
2. Onglet **Storage**
3. Sélectionnez le bucket `portfolio-files`
4. Vérifiez que "Public" est activé
5. Si nécessaire, exécutez à nouveau le script SQL `SUPABASE_INIT.sql`

### Problème 4 : "Type de fichier incorrect"

**Cause** : Les fichiers ne sont pas marqués comme "image"

**Solution** :
1. Dans Supabase Admin, cliquez sur ✏️ Modifier
2. Changez le type en "image"
3. Sauvegardez

### Problème 5 : Images Unsplash qui s'affichent

**Cause** : Matching échoué, le système utilise les images par défaut

**Solution** :
1. Vérifiez les logs (étape 3.2)
2. Identifiez quel certificat ne match pas
3. Renommez le fichier dans Supabase avec le bon mot-clé
4. Rechargez la page (Ctrl+R)
5. Re-testez

---

## 🧪 Test Complet Étape par Étape

### Test 1 : Connexion Supabase
```
Ouvrir Console (F12) → Chercher "Supabase détecté: true"
```
✅ Vu ? → Continuer
❌ Non ? → Vérifier /lib/supabase.ts

### Test 2 : Fichiers présents
```
Cliquer sur un certificat → Bouton "Test Connexion"
```
✅ X certificats trouvés (X > 0) ? → Continuer
❌ 0 trouvés ? → Uploader les fichiers

### Test 3 : Matching
```
Console → Chercher "✅ Certificat trouvé par nom"
```
✅ Vu pour vos certificats ? → Tout fonctionne !
❌ Vu "❌ Aucun certificat trouvé" ? → Renommer les fichiers

---

## 📋 Checklist Finale

Avant de demander de l'aide, vérifiez :

- [ ] J'ai ouvert la console (F12)
- [ ] Je vois "Supabase détecté: true"
- [ ] J'ai uploadé des images dans Supabase
- [ ] Les fichiers sont de type "image"
- [ ] Les noms contiennent les mots-clés (ccna1, python1, etc.)
- [ ] J'ai cliqué sur "Test Connexion" et vu le nombre de certificats
- [ ] J'ai regardé les logs détaillés dans la console
- [ ] J'ai essayé de renommer un fichier pour tester

---

## 💡 Astuces

### Astuce 1 : Test rapide d'un seul certificat
Pour tester rapidement si le système fonctionne :
1. Uploadez **1 seul fichier** nommé `CCNA1-test.png`
2. Cliquez sur le certificat CCNA 1
3. Vérifiez les logs
4. Si ça marche, uploadez les autres

### Astuce 2 : Noms simples
Utilisez des noms simples :
- `ccna1.png`
- `ccna2.png`
- `python1.png`
- `adds.png`

### Astuce 3 : Réinitialiser le cache
Si rien ne fonctionne :
1. Ctrl+Shift+R (hard refresh)
2. Ou videz le cache navigateur
3. Rechargez la page

---

## 🆘 Messages d'Erreur Courants

### "Could not find the table 'public.portfolio_files'"
**Cause** : Tables Supabase non créées

**Solution** : Exécutez le script `SUPABASE_INIT.sql` (voir `SUPABASE_SETUP.md`)

### "Invalid API key"
**Cause** : Clé API Supabase incorrecte

**Solution** : Vérifiez la clé dans `/lib/supabase.ts`

### "Failed to fetch"
**Cause** : Problème de connexion réseau ou bucket

**Solution** : 
1. Vérifiez votre connexion internet
2. Vérifiez les politiques RLS du bucket
3. Vérifiez que le bucket est public

---

## 📊 Exemple de Logs Normaux (Tout Fonctionne)

```
🔧 Configuration Supabase:
  URL: https://ajubxxipfclkgmlpyzvk.supabase.co
  Key: ✅ Configurée

🔍 CertificateService - Supabase détecté: true

🔄 Récupération des certificats depuis Supabase...
📦 8 fichier(s) image trouvé(s) dans Supabase
📋 Tous les fichiers: [
  { name: "CCNA1-Certificate.png", type: "image", url: "https://..." },
  { name: "CCNA2-Cisco.jpg", type: "image", url: "https://..." },
  { name: "Python1-Essential.png", type: "image", url: "https://..." },
  ...
]

✅ Fichier certificat trouvé: CCNA1-Certificate.png
🎓 Certificat mappé: { id: "xxx", name: "CCNA1-Certificate.png", url: "https://..." }
✅ Fichier certificat trouvé: CCNA2-Cisco.jpg
🎓 Certificat mappé: { id: "yyy", name: "CCNA2-Cisco.jpg", url: "https://..." }
...

🎓 8 certificat(s) trouvé(s) au total

🖼️ Chargement image pour certificat: cert1 - CCNA 1: Introduction to Networks
🔗 URL par défaut: https://images.unsplash.com/...
🎓 Recherche certificat: cert1 → ccna1
🔍 Recherche de "ccna1" parmi 8 certificat(s)
✅ Certificat trouvé par nom: CCNA1-Certificate.png
✅ Image trouvée pour cert1: https://ajubxxipfclkgmlpyzvk.supabase.co/storage/v1/object/public/portfolio-files/...
🖼️ URL finale utilisée: https://ajubxxipfclkgmlpyzvk.supabase.co/...
📍 Source: Supabase (personnalisée)
```

---

**Date de création** : 4 octobre 2025  
**Dernière mise à jour** : 4 octobre 2025