# Guide de Sécurité - Interface Admin Portfolio

## 🔐 Authentification Actuelle

### Configuration de base
- **Mot de passe par défaut** : `admin123` (⚠️ À CHANGER IMMÉDIATEMENT !)
- **Durée de session** : 2 heures
- **Stockage** : LocalStorage (temporaire)
- **Accès** : Interface visible via icône Settings dans la navigation

### Comment changer le mot de passe
1. Modifiez la variable `adminPassword` dans `/hooks/useAdmin.ts` ligne 30
2. Remplacez `'admin123'` par un mot de passe fort
3. Redéployez l'application

## ⚠️ Limitations de Sécurité Actuelles

### Stockage Local
- Les fichiers sont stockés en mémoire/LocalStorage
- **Risque** : Perte des données au vidage du cache
- **Impact** : Données non persistantes entre les sessions

### Authentification Simple
- Mot de passe en dur dans le code
- **Risque** : Exposition du mot de passe si le code source est accessible
- **Impact** : Accès non autorisé possible

### Validation des Fichiers
- Types de fichiers limités mais pas de scan antivirus
- **Risque** : Upload de fichiers malveillants possibles
- **Impact** : Potentiels problèmes de sécurité

## 🛡️ Mesures de Sécurité Implémentées

### ✅ Protection des Sessions
- Sessions temporaires (2h max)
- Déconnexion automatique
- Vérification d'authentification à chaque chargement

### ✅ Validations Upload
- Types de fichiers contrôlés
- Taille maximum limitée (10MB)
- Extensions autorisées uniquement

### ✅ Interface Sécurisée
- Accès discret via icône Settings
- Pas de lien direct visible
- Interface moderne et protégée

## 🔧 Recommandations de Sécurité

### Pour Usage Immédiat
1. **Changer le mot de passe par défaut**
2. **Utiliser HTTPS** en production
3. **Limiter l'accès réseau** si possible
4. **Sauvegarder régulièrement** les fichiers uploadés

### Pour Amélioration Future

#### Authentification Avancée
```javascript
// Exemple avec JWT
const token = jwt.sign({ admin: true }, process.env.JWT_SECRET);
```

#### Stockage Sécurisé
```javascript
// Exemple avec Supabase
const { data, error } = await supabase.storage
  .from('portfolio-files')
  .upload('path/file.jpg', file);
```

#### Logs d'Audit
```javascript
// Traçabilité des actions
const logAction = (action, details) => {
  console.log(`[${new Date().toISOString()}] ${action}:`, details);
};
```

## 🚀 Migration vers Supabase (Recommandée)

### Avantages Supabase
- **Authentification sécurisée** (OAuth, JWT)
- **Stockage cloud** sécurisé et persistant
- **Base de données** PostgreSQL
- **APIs sécurisées** automatiques
- **Logs d'audit** intégrés

### Fonctionnalités à implémenter
1. **Auth Supabase** : Remplacement du système actuel
2. **Storage Supabase** : Upload et gestion de fichiers
3. **Database** : Métadonnées des fichiers
4. **RLS (Row Level Security)** : Sécurité au niveau des données

## 📋 Checklist Sécurité

### Avant Mise en Production
- [ ] Mot de passe par défaut changé
- [ ] HTTPS activé
- [ ] Variables d'environnement sécurisées
- [ ] Validation côté serveur implémentée
- [ ] Tests de sécurité effectués

### Monitoring Continu
- [ ] Logs d'accès surveillés
- [ ] Tentatives de connexion tracées
- [ ] Fichiers uploadés vérifiés
- [ ] Sessions utilisateurs monitrées

## 🆘 En Cas de Problème

### Accès Perdu
1. Supprimer les données LocalStorage : `localStorage.clear()`
2. Recharger la page
3. Se reconnecter avec le nouveau mot de passe

### Fichiers Perdus
1. Les fichiers en LocalStorage peuvent être perdus
2. Sauvegarder régulièrement les fichiers importants
3. Migrer vers une solution cloud dès que possible

### Support
Pour toute question de sécurité, vérifiez :
1. Les logs de la console navigateur
2. L'état des sessions dans LocalStorage
3. La configuration réseau/HTTPS

---

**⚠️ IMPORTANT** : Cette implémentation est adaptée pour un développement/test. Pour un environnement de production, une migration vers Supabase ou une solution backend sécurisée est fortement recommandée.