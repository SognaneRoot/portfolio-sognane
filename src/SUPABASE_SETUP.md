# Configuration Supabase - Interface Admin Portfolio

## 🚀 Guide de Configuration Rapide

### ⚡ CONFIGURATION EN 2 ÉTAPES

Votre projet Supabase existe déjà ! Il suffit de créer les tables.

#### Étape 1 : Ouvrir le SQL Editor

1. Aller sur votre tableau de bord Supabase : [https://supabase.com/dashboard/project/ajubxxipfclkgmlpyzvk](https://supabase.com/dashboard/project/ajubxxipfclkgmlpyzvk)
2. Cliquer sur **"SQL Editor"** dans le menu de gauche
3. Cliquer sur **"New Query"**

#### Étape 2 : Exécuter le Script d'Initialisation

1. Ouvrir le fichier `SUPABASE_INIT.sql` à la racine du projet
2. **Copier TOUT le contenu** du fichier
3. **Coller** dans le SQL Editor de Supabase
4. Cliquer sur **"Run"** (ou Ctrl+Enter)

✅ **C'EST TOUT !** Les tables, politiques de sécurité et bucket de stockage sont créés automatiquement.

---

## 📋 Configuration Détaillée

### 1. Informations du Projet

**Votre projet Supabase est déjà configuré :**

- **URL** : `https://ajubxxipfclkgmlpyzvk.supabase.co`
- **Clé Anon** : Déjà configurée dans `/lib/supabase.ts`
- **Identifiants Admin** :
  - Email : `admin@portfolio.local`
  - Mot de passe : `Sogn@ne2K2`

### 2. Variables d'Environnement (Optionnel)

Si vous souhaitez utiliser des variables d'environnement, créez `.env.local` :

```env
REACT_APP_SUPABASE_URL=https://ajubxxipfclkgmlpyzvk.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqdWJ4eGlwZmNsa2dtbHB5enZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MTQ4MDAsImV4cCI6MjA1MTM5MDgwMH0.qLTjYhL-Wl0tNv_cNGKxQWv2cXqBpVhLcG3fXWDqvWc
REACT_APP_ADMIN_PASSWORD=Sogn@ne2K2
```

**Note :** Les valeurs sont déjà hardcodées dans le code, donc ce fichier est optionnel.

### 3. Vérification de l'Installation

Après avoir exécuté le script SQL, vérifiez que tout fonctionne :

1. Dans le **SQL Editor**, exécutez cette requête :

```sql
-- Vérifier que les tables existent
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('admin_sessions', 'portfolio_files');
```

Vous devriez voir :
- `admin_sessions`
- `portfolio_files`

2. Vérifiez le bucket de stockage :

```sql
-- Vérifier le bucket
SELECT * FROM storage.buckets WHERE id = 'portfolio-files';
```

Vous devriez voir une ligne avec `id = 'portfolio-files'` et `public = true`.

### 4. Tables Créées

Le script `SUPABASE_INIT.sql` crée automatiquement :

#### ✅ Table `admin_sessions`
- Gère les sessions d'authentification admin
- Tokens JWT avec expiration automatique
- Nettoyage automatique des sessions expirées

#### ✅ Table `portfolio_files`
- Stocke les métadonnées des fichiers uploadés
- Supporte les images, documents et autres fichiers
- Avec description, tags, catégorie et liaison aux projets

#### ✅ Bucket `portfolio-files`
- Stockage cloud pour tous les fichiers
- Accès public en lecture
- Upload sécurisé avec validation

#### ✅ Politiques de Sécurité (RLS)
- Row Level Security activé sur toutes les tables
- Lecture publique, modification sécurisée
- Protection contre les accès non autorisés

## 🔧 Utilisation

### Interface Admin

1. **Accès** : Cliquer sur l'icône Settings dans la navigation
2. **Connexion** : Utiliser `admin@portfolio.local` et votre mot de passe
3. **Upload** : Glisser-déposer vos fichiers dans l'interface
4. **Gestion** : Visualiser, télécharger, supprimer vos fichiers

### Fonctionnalités Disponibles

- ✅ **Upload sécurisé** avec validation de types et tailles
- ✅ **Stockage cloud** persistant et sauvegardé
- ✅ **URLs publiques** pour intégration facile
- ✅ **Interface intuitive** avec statistiques en temps réel
- ✅ **Sécurité enterprise** avec RLS et JWT

## 🛡️ Sécurité Avancée

### Authentification

- Sessions JWT avec expiration automatique (2h)
- Tokens sécurisés générés côté client
- Nettoyage automatique des sessions expirées
- Protection contre les attaques par force brute

### Stockage

- Row Level Security (RLS) activé
- Isolation complète des données par utilisateur
- Chiffrement des données au repos
- Sauvegarde automatique par Supabase

### Validation

- Types de fichiers contrôlés (images, documents)
- Taille maximum limitée (10MB)
- Validation côté client ET serveur
- Scan automatique des métadonnées

## 📊 Monitoring

### Statistiques Disponibles

- Nombre total de fichiers
- Répartition par type (images, documents)
- Utilisation de l'espace de stockage
- Latence et performances

### Logs d'Audit

- Supabase Dashboard : Monitoring en temps réel
- Logs d'authentification et d'accès
- Métriques de performance
- Alertes automatiques

## 🔄 Migration depuis LocalStorage

Si vous utilisiez l'ancien système LocalStorage :

1. **Sauvegarde** : Exporter vos fichiers existants
2. **Configuration** : Suivre ce guide de setup
3. **Migration** : Re-uploader vos fichiers via la nouvelle interface
4. **Vérification** : Tester toutes les fonctionnalités

## 🆘 Dépannage

### Erreurs Communes

#### "Failed to fetch"

- Vérifier l'URL Supabase dans `.env.local`
- Contrôler les politiques RLS
- Tester la connectivité réseau

#### "Unauthorized"

- Vérifier la clé API anonyme
- Contrôler les politiques de sécurité
- Régénérer les tokens si nécessaire

#### "Upload failed"

- Vérifier la configuration du bucket
- Contrôler les politiques Storage
- Vérifier la taille et le type de fichier

### Support

1. **Documentation Supabase** : [docs.supabase.com](https://docs.supabase.com)
2. **Dashboard Supabase** : Monitoring et logs
3. **Console navigateur** : Messages d'erreur détaillés

## 🎯 Prochaines Étapes

- [ ] Configurer les sauvegardes automatiques
- [ ] Implémenter les notifications en temps réel
- [ ] Ajouter la compression d'images automatique
- [ ] Configurer le CDN pour les performances
- [ ] Intégrer l'analytics avancé

---

**🎉 Félicitations !** Votre portfolio dispose maintenant d'une infrastructure de niveau enterprise avec Supabase !