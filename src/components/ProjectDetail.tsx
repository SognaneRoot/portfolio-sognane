import { ArrowLeft, Calendar, ExternalLink, Github } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SimpleFileService } from '../utils/simpleFileService';
import { useState, useEffect } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  year: string;
  category: 'certification' | 'project';
  image: string;
  technologies: string[];
  links?: {
    demo?: string;
    github?: string;
    certificate?: string;
  };
  featured?: boolean;
  fullDescription?: string;
  challenges?: string[];
  achievements?: string[];
  technicalDetails?: string;
}

interface ProjectDetails {
  fullDescription: string;
  challenges: string[];
  achievements: string[];
  technicalDetails: string;
}

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export default function ProjectDetail({ project, onBack }: ProjectDetailProps) {
  const [reportAvailable, setReportAvailable] = useState(false);

  // Données détaillées pour chaque projet (en réalité, cela viendrait d'une base de données)
  const getProjectDetails = (projectId: string): ProjectDetails => {
    const details = {
      'proj1': {
        fullDescription: 'Ce projet consiste en la conception et l\'implémentation d\'un système de sécurité domestique utilisant des technologies IoT. Le système intègre des capteurs de mouvement, des caméras de surveillance, et un système d\'alarme connecté permettant une surveillance à distance via une application mobile.',
        challenges: [
          'Intégration de multiples capteurs IoT',
          'Optimisation de la consommation énergétique',
          'Sécurisation des communications sans fil',
          'Interface utilisateur intuitive'
        ],
        achievements: [
          'Détection d\'intrusion avec 99.5% de précision',
          'Système d\'alerte en temps réel',
          'Interface mobile responsive',
          'Autonomie de 72h sur batterie'
        ],
        technicalDetails: 'Architecture basée sur ESP32, capteurs PIR, caméras IP, serveur Node.js avec base de données MongoDB. Protocoles: WiFi, MQTT, WebSocket pour communication temps réel.'
      },
      'proj2': {
        fullDescription: 'Déploiement complet d\'une solution de téléphonie IP avec serveurs Asterisk et interface de gestion Issabel. Le projet inclut la configuration des extensions, la mise en place de files d\'attente, l\'enregistrement des appels et l\'intégration avec des systèmes CRM.',
        challenges: [
          'Configuration avancée d\'Asterisk',
          'Optimisation de la qualité audio (QoS)',
          'Intégration avec infrastructure existante',
          'Formation des utilisateurs finaux'
        ],
        achievements: [
          'Support de 100+ extensions simultanées',
          'Qualité audio HD',
          'Réduction des coûts téléphoniques de 60%',
          'Interface d\'administration simplifiée'
        ],
        technicalDetails: 'Asterisk 18 avec FreePBX, codecs G.722/G.711, SIP trunking, base de données MySQL, monitoring avec Nagios.'
      },
      'proj3': {
        fullDescription: 'Réalisation de tests de pénétration spécialisés dans les attaques par force brute sur diverses surfaces d\'attaque. Le projet inclut l\'utilisation d\'outils comme Hydra, John the Ripper, et des scripts personnalisés pour évaluer la robustesse des systèmes d\'authentification.',
        challenges: [
          'Contournement des mécanismes de protection',
          'Optimisation des attaques par dictionnaire',
          'Tests sur différents protocoles (SSH, FTP, HTTP)',
          'Documentation détaillée des vulnérabilités'
        ],
        achievements: [
          'Identification de 15+ vulnérabilités critiques',
          'Développement d\'outils personnalisés',
          'Rapport de sécurité complet',
          'Recommandations de durcissement implémentées'
        ],
        technicalDetails: 'Kali Linux, Hydra, John the Ripper, Burp Suite, scripts Python personnalisés, méthodologie OWASP.'
      }
    };

    return details[projectId as keyof typeof details] || {
      fullDescription: project.description,
      challenges: ['Définition des exigences', 'Planification du projet', 'Implémentation technique', 'Tests et validation'],
      achievements: ['Objectifs atteints', 'Livraison dans les délais', 'Satisfaction client', 'Qualité optimale'],
      technicalDetails: `Technologies utilisées: ${project.technologies.join(', ')}`
    };
  };

  const [details, setDetails] = useState<ProjectDetails>(() => getProjectDetails(project.id));

  useEffect(() => {
    // Vérifier si un rapport est disponible pour ce projet
    const url = SimpleFileService.getFirstPdfUrl();
    setReportAvailable(url !== null);
  }, [project.id]);

  useEffect(() => {
    const projectDetails = getProjectDetails(project.id);
    setDetails(projectDetails);
  }, [project.id, project.description, project.technologies]);

  const handleViewDemo = async () => {
    console.log('🎬 handleViewDemo appelé pour projet:', project.id);
    
    try {
      // Vérifier d'abord si un PDF est disponible
      const pdfAvailable = await SimpleFileService.hasReportForProject(project.id);
      
      if (pdfAvailable) {
        console.log('📄 PDF disponible, ouverture du viewer...');
        const success = await SimpleFileService.openProjectReport(project.id);
        if (success) {
          console.log('✅ PDF viewer ouvert avec succès');
          return;
        }
      }
      
      // Fallback vers le lien demo original si pas de rapport importé
      // Ne pas ouvrir si c'est juste un "#"
      if (project.links?.demo && project.links.demo !== '#') {
        console.log('🔗 Fallback: ouverture lien démo externe:', project.links.demo);
        window.open(project.links.demo, '_blank');
      } else {
        console.log('❌ Aucun rapport ni démo disponible');
        alert('📄 Aucun rapport disponible pour ce projet.\n\n💡 Astuce : Vous pouvez importer des rapports PDF via l\'interface admin (⚙️ en haut à droite) et les lier aux projets.');
      }
    } catch (error) {
      console.error('❌ Erreur dans handleViewDemo:', error);
      
      // En cas d'erreur, essayer quand même le lien demo s'il existe et n'est pas "#"
      if (project.links?.demo && project.links.demo !== '#') {
        console.log('🔗 Erreur - fallback vers lien démo');
        window.open(project.links.demo, '_blank');
      } else {
        alert('⚠️ Erreur lors de l\'ouverture de la démonstration.\n\nVeuillez vérifier qu\'un fichier PDF est importé via l\'interface admin.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header avec bouton retour */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux projets
          </Button>
          
          <div className="flex items-center gap-4 mb-4">
            <Badge 
              variant="secondary" 
              className={
                project.category === 'certification' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-blue-100 text-blue-700'
              }
            >
              {project.category === 'certification' ? 'Certification' : 'Projet'}
            </Badge>
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-1" />
              {project.year}
            </div>
          </div>
        </div>

        {/* Image et informations principales */}
        <Card className="mb-8">
          <CardHeader className="p-0">
            <div className="relative overflow-hidden rounded-t-lg">
              <ImageWithFallback
                src={project.image}
                alt={project.title}
                className="w-full h-64 object-cover"
              />
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <h1 className="text-3xl mb-4">{project.title}</h1>
            <p className="text-xl text-gray-600 mb-6">{details.fullDescription}</p>
            
            {/* Technologies */}
            <div className="mb-6">
              <h3 className="text-lg mb-3">Technologies utilisées</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Liens */}
            <div className="flex gap-4">
              {/* Bouton Rapport/Démo intelligent */}
              <Button 
                variant="outline" 
                onClick={handleViewDemo}
                className={reportAvailable ? 'border-green-500 text-green-700' : ''}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                {reportAvailable ? 'Voir le rapport' : 'Voir la démo'}
              </Button>
              
              {project.links?.github && (
                <Button variant="outline" asChild>
                  <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    Code source
                  </a>
                </Button>
              )}
              {project.links?.certificate && (
                <Button variant="outline" asChild>
                  <a href={project.links.certificate} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Voir le certificat
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Détails techniques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Défis */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl mb-4">Défis relevés</h3>
              <ul className="space-y-2">
                {details.challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Réalisations */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl mb-4">Réalisations</h3>
              <ul className="space-y-2">
                {details.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Détails techniques */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl mb-4">Détails techniques</h3>
            <p className="text-gray-700 leading-relaxed">{details.technicalDetails}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}