import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { 
  ChevronDown, 
  ChevronRight, 
  Mail, 
  Settings, 
  CheckCircle,
  ExternalLink,
  Copy,
  AlertCircle
} from 'lucide-react';

export default function EmailSetupInstructions() {
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [copiedText, setCopiedText] = useState<string>('');

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const emailServices = [
    {
      id: 'emailjs',
      name: 'EmailJS',
      description: 'Service professionnel avec 200 emails/mois gratuits',
      status: 'recommended',
      setupSteps: [
        'Créer un compte sur emailjs.com',
        'Connecter votre service email (Gmail, Outlook, etc.)',
        'Créer un template avec les variables : from_name, from_email, message, to_name',
        'Copier les IDs et remplacer dans emailService.ts'
      ],
      url: 'https://www.emailjs.com/',
      variables: `
// Dans emailService.ts, remplacer :
const EMAILJS_CONFIG = {
  serviceId: 'service_XXXXXXX',     // Votre Service ID
  templateId: 'template_XXXXXXX',   // Votre Template ID  
  publicKey: 'XXXXXXXXXXXXXXX'      // Votre Public Key
};`
    },
    {
      id: 'web3forms',
      name: 'Web3Forms',
      description: 'Service gratuit, sans inscription, simple à utiliser',
      status: 'easy',
      setupSteps: [
        'Aller sur web3forms.com',
        'Entrer votre email pour recevoir une clé d\'accès',
        'Copier la clé et remplacer dans emailService.ts'
      ],
      url: 'https://web3forms.com/',
      variables: `
// Dans emailService.ts, remplacer :
const WEB3FORMS_KEY = 'votre-cle-web3forms';`
    },
    {
      id: 'formspree',
      name: 'Formspree',
      description: 'Service populaire avec intégration facile',
      status: 'configured',
      setupSteps: [
        'Créer un compte sur formspree.io',
        'Créer un nouveau formulaire',
        'Copier l\'URL du formulaire',
        'Remplacer dans emailService.ts'
      ],
      url: 'https://formspree.io/',
      variables: `
// Dans emailService.ts, remplacer :
// l'URL 'https://formspree.io/f/xwpkvgok' 
// par votre URL Formspree`
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'recommended':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'easy':
        return <AlertCircle className="h-5 w-5 text-blue-600" />;
      case 'configured':
        return <Settings className="h-5 w-5 text-orange-600" />;
      default:
        return <Mail className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'recommended':
        return 'Recommandé';
      case 'easy':
        return 'Facile';
      case 'configured':
        return 'Pré-configuré';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-6 w-6 text-blue-600" />
            Configuration des Services Email
          </CardTitle>
          <p className="text-gray-600">
            Configurez l'un de ces services pour activer l'envoi d'emails automatique depuis votre portfolio.
          </p>
        </CardHeader>
      </Card>

      {emailServices.map((service) => (
        <Card key={service.id} className="overflow-hidden">
          <Collapsible 
            open={openSections.includes(service.id)}
            onOpenChange={() => toggleSection(service.id)}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {getStatusText(service.status)}
                    </span>
                  </div>
                  {openSections.includes(service.id) ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Étapes de configuration :</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                      {service.setupSteps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(service.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ouvrir {service.name}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(service.variables, service.id)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {copiedText === service.id ? 'Copié !' : 'Copier le code'}
                    </Button>
                  </div>

                  <div className="bg-gray-100 p-3 rounded-lg">
                    <h4 className="font-medium mb-2 text-sm">Code à modifier :</h4>
                    <pre className="text-xs bg-gray-800 text-green-400 p-2 rounded overflow-x-auto">
                      {service.variables}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}

      <Card>
        <CardContent className="p-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">📝 Note importante :</h4>
            <p className="text-blue-800 text-sm">
              Le portfolio utilise actuellement Formspree avec un formulaire de démonstration. 
              Pour recevoir les vrais messages, configurez l'un des services ci-dessus avec vos propres identifiants.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}