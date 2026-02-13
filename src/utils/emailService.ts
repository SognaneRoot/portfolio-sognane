// Service d'envoi d'email utilisant EmailJS et alternatives
interface EmailData {
  name: string;
  email: string;
  message: string;
}

interface EmailServiceResponse {
  success: boolean;
  message: string;
}

// Configuration EmailJS - Instructions pour configuration :
// 1. Créer un compte sur https://www.emailjs.com/
// 2. Créer un service email (Gmail, Outlook, etc.)
// 3. Créer un template avec les variables : from_name, from_email, message, to_name
// 4. Remplacer les IDs ci-dessous par vos vrais IDs
const EMAILJS_CONFIG = {
  serviceId: 'service_pcxpsjn', // Remplacer par votre Service ID
  templateId: 'template_zenli2e', // Remplacer par votre Template ID
  publicKey: 'eduWk3H7qIiot8TVr'    // Remplacer par votre Public Key
};

// Alternative Web3Forms (gratuit, sans inscription)
const WEB3FORMS_KEY = 'fb5b69ee-1c64-46c0-bfdc-f117a608eb73'; // Obtenir sur https://web3forms.com

export const sendEmail = async (formData: EmailData): Promise<EmailServiceResponse> => {
  try {
    // Méthode 1: EmailJS (service professionnel recommandé)
    if (EMAILJS_CONFIG.publicKey !== 'eduWk3H7qIiot8TVr') {
      try {
        const emailjs = await import('@emailjs/browser');

        const templateParams = {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_name: 'Ndiaga Sognane',
          reply_to: formData.email
        };

        const response = await emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          templateParams,
          EMAILJS_CONFIG.publicKey
        );

        if (response.status === 200) {
          return {
            success: true,
            message: 'Email envoyé avec succès via EmailJS!'
          };
        }
      } catch (emailJSError) {
        console.error('Erreur EmailJS:', emailJSError);
      }
    }

    // Méthode 2: Web3Forms (alternative gratuite)
    if (WEB3FORMS_KEY !== 'fb5b69ee-1c64-46c0-bfdc-f117a608eb73') {
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            name: formData.name,
            email: formData.email,
            message: formData.message,
            subject: `Nouveau message de ${formData.name} depuis votre portfolio`
          })
        });

        const result = await response.json();

        if (result.success) {
          return {
            success: true,
            message: 'Email envoyé avec succès via Web3Forms!'
          };
        }
      } catch (web3FormsError) {
        console.error('Erreur Web3Forms:', web3FormsError);
      }
    }

    // Méthode 3: Formspree (alternative populaire)
    try {
      const formspreeResponse = await fetch('https://formspree.io/f/mnjbpwwg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `Contact depuis le portfolio - ${formData.name}`
        }),
      });

      if (formspreeResponse.ok) {
        return {
          success: true,
          message: 'Email envoyé avec succès via Formspree!'
        };
      }
    } catch (formspreeError) {
      console.error('Erreur Formspree:', formspreeError);
    }

    throw new Error('Tous les services d\'email ont échoué');

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);

    // Fallback: Mailto comme dernière option
    const subject = encodeURIComponent(`Contact depuis le portfolio - ${formData.name}`);
    const body = encodeURIComponent(
      `Bonjour Ndiaga,\n\n` +
      `Vous avez reçu un nouveau message depuis votre portfolio :\n\n` +
      `👤 Nom : ${formData.name}\n` +
      `📧 Email : ${formData.email}\n\n` +
      `💬 Message :\n${formData.message}\n\n` +
      `---\n` +
      `Message envoyé depuis monportfolio.ct.ws le ${new Date().toLocaleDateString('fr-FR')}`
    );

    const mailtoLink = `mailto:sognanendiaga221@gmail.com?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_blank');

    return {
      success: true,
      message: 'Votre client email va s\'ouvrir pour envoyer le message.'
    };
  }
};

// Fonction pour envoyer une notification via WhatsApp (optionnel)
export const sendWhatsAppNotification = (formData: EmailData) => {
  const phoneNumber = '221706056839';
  const message = encodeURIComponent(
    `📧 *Nouveau message reçu sur votre portfolio*\n\n` +
    `👤 *De:* ${formData.name}\n` +
    `📧 *Email:* ${formData.email}\n\n` +
    `💬 *Message:*\n${formData.message}\n\n` +
    `---\n` +
    `Notification depuis monportfolio.ct.ws`
  );

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(whatsappUrl, '_blank');
  return true;
};

// Instructions de configuration pour les développeurs
export const getEmailSetupInstructions = () => {
  return `
📧 CONFIGURATION DES SERVICES EMAIL
=====================================

Pour activer l'envoi d'emails automatique, configurez l'un de ces services :

🔧 EMAILJS (Recommandé)
-----------------------
1. Créer un compte sur https://www.emailjs.com/
2. Ajouter un service email (Gmail, Outlook, etc.)
3. Créer un template avec ces variables :
   - {{from_name}} : Nom de l'expéditeur
   - {{from_email}} : Email de l'expéditeur
   - {{message}} : Message
   - {{to_name}} : Votre nom
4. Remplacer les IDs dans emailService.ts

🔧 WEB3FORMS (Gratuit)
----------------------
1. Aller sur https://web3forms.com/
2. Obtenir une clé d'accès gratuite
3. Remplacer WEB3FORMS_KEY dans emailService.ts

🔧 FORMSPREE (Alternative)
-------------------------
1. Créer un compte sur https://formspree.io/
2. Créer un nouveau formulaire
3. Remplacer l'URL dans le code

📝 Actuellement configuré avec Formspree par défaut
`;
};
