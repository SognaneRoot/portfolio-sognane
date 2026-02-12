# 📧 Configuration des Services Email

Ce portfolio utilise plusieurs services d'envoi d'email pour garantir la réception des messages de contact.

## 🎯 Services Disponibles

### 1. **EmailJS** (Recommandé)
- ✅ **Gratuit** : 200 emails/mois
- ✅ **Professionnel** : Interface admin complète
- ✅ **Fiable** : Service établi et stable

**Configuration :**
```bash
# 1. Créer un compte sur https://www.emailjs.com/
# 2. Connecter votre service email (Gmail, Outlook, etc.)
# 3. Créer un template avec ces variables :
#    - {{from_name}} : Nom de l'expéditeur
#    - {{from_email}} : Email de l'expéditeur
#    - {{message}} : Message
#    - {{to_name}} : Votre nom
#    - {{reply_to}} : Email de réponse
```

Modifier dans `/utils/emailService.ts` :
```javascript
const EMAILJS_CONFIG = {
  serviceId: 'service_XXXXXXX',     // Votre Service ID
  templateId: 'template_XXXXXXX',   // Votre Template ID  
  publicKey: 'XXXXXXXXXXXXXXX'      // Votre Public Key
};
```

### 2. **Web3Forms** (Le plus simple)
- ✅ **Gratuit** : Illimité
- ✅ **Sans inscription** : Juste besoin d'un email
- ✅ **Rapide** : Configuration en 2 minutes

**Configuration :**
```bash
# 1. Aller sur https://web3forms.com/
# 2. Entrer votre email pour recevoir une clé d'accès
# 3. Copier la clé reçue par email
```

Modifier dans `/utils/emailService.ts` :
```javascript
const WEB3FORMS_KEY = 'votre-cle-web3forms'; // Remplacer par votre vraie clé
```

### 3. **Formspree** (Pré-configuré)
- ✅ **Déjà configuré** : Fonctionne immédiatement
- ✅ **50 emails/mois gratuit**
- ⚠️ **Limitation** : Utilise un formulaire de démonstration

**Pour votre propre formulaire :**
```bash
# 1. Créer un compte sur https://formspree.io/
# 2. Créer un nouveau formulaire
# 3. Copier l'URL du formulaire
```

Modifier dans `/utils/emailService.ts` :
```javascript
// Remplacer 'https://formspree.io/f/xwpkvgok' 
// par votre URL Formspree
```

## 🔧 Installation et Configuration

### Étape 1 : Choisir un service
Nous recommandons **EmailJS** pour un usage professionnel ou **Web3Forms** pour simplicité.

### Étape 2 : Obtenir les identifiants
Suivre les instructions du service choisi ci-dessus.

### Étape 3 : Modifier le code
Remplacer les placeholders dans `/utils/emailService.ts` par vos vrais identifiants.

### Étape 4 : Tester
1. Remplir le formulaire de contact sur votre portfolio
2. Vérifier que vous recevez l'email
3. Tester la réponse

## 📋 Système de Fallback

Le système essaie les services dans cet ordre :
1. **EmailJS** (si configuré)
2. **Web3Forms** (si configuré)  
3. **Formspree** (toujours disponible)
4. **Mailto** (dernière option)

## 🛠️ Template Email Recommandé

Pour EmailJS, voici un template HTML recommandé :

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Nouveau message depuis votre portfolio</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; color: white;">
        <h1>💼 Nouveau message depuis votre portfolio</h1>
    </div>
    
    <div style="padding: 20px; background: #f9f9f9;">
        <h2>Informations du contact :</h2>
        <p><strong>👤 Nom :</strong> {{from_name}}</p>
        <p><strong>📧 Email :</strong> {{from_email}}</p>
        
        <h2>Message :</h2>
        <div style="background: white; padding: 15px; border-left: 4px solid #667eea;">
            {{message}}
        </div>
        
        <hr style="margin: 20px 0;">
        <p><em>Message reçu le {{date}} depuis monportfolio.ct.ws</em></p>
    </div>
</body>
</html>
```

## 🔐 Sécurité

- ✅ Toutes les clés API sont côté client (pas de secrets serveur)
- ✅ Validation des données avant envoi
- ✅ Protection contre le spam (rate limiting côté service)
- ✅ Fallback vers mailto si tous les services échouent

## 🎯 Prochaines Étapes

1. **Configurer EmailJS** pour un usage professionnel
2. **Personnaliser le template** avec votre branding
3. **Ajouter des notifications** WhatsApp (optionnel)
4. **Tester régulièrement** le bon fonctionnement

---

**📞 Support :** Si vous avez des questions, consultez la documentation de chaque service ou contactez-moi directement.