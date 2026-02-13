import { useState } from "react";
import {
  Calendar,
  MapPin,
  ExternalLink,
  Download,
  Briefcase,
  GraduationCap,
  Award,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { CVService } from '../utils/cvService';
import { CertificateService } from '../utils/certificateService';
import { ImageWithFallback } from './figma/ImageWithFallback';
import CertificateModal from './CertificateModal';

interface TimelineItem {
  id: string;
  type: "experience" | "education" | "certification";
  title: string;
  company: string;
  location: string;
  period: string;
  description: string;
  skills: string[];
  hasDetail?: boolean;
}

// Parcours académique et professionnel (sans certifications)
const timelineData: TimelineItem[] = [
  {
    id: "edu1",
    type: "education",
    title: "BTS Administration Système Sécurité et Cloud",
    company: "ISEPAT",
    location: "Diamniadio, Sénégal",
    period: "2022 - 2024",
    description:
      "Formation technique complète en administration système, sécurité informatique et technologies cloud.",
    skills: [
      "Administration Système",
      "Sécurité",
      "Cloud Computing",
      "Virtualisation",
    ],
    hasDetail: false,
  },
  {
    id: "exp1",
    type: "experience",
    title: "Stagiaire - Administration Système",
    company:
      "Ministère des Infrastructures Terrestres et du Transport Aérien",
    location: "Diamniadio, Sénégal",
    period: "2024",
    description:
      "Stage pratique en administration système et maintenance des infrastructures IT du ministère.",
    skills: [
      "Windows Server",
      "Active Directory",
      "Maintenance IT",
      "Support Technique",
    ],
    hasDetail: false,
  },
  {
    id: "edu2",
    type: "education",
    title: "L3 Réseau et Système Informatique",
    company: "ISI Keur Massar",
    location: "Keur Massar, Sénégal",
    period: "En cours",
    description:
      "Formation spécialisée en réseaux informatiques et administration système avec focus sur les infrastructures IT.",
    skills: [
      "Réseaux",
      "Système",
      "Infrastructure IT",
      "Sécurité",
    ],
    hasDetail: false,
  },
];

// Certifications
const certificationsData: TimelineItem[] = [
  {
    id: "cert1",
    type: "certification",
    title: "CCNA 1 - Introduction to Networks",
    company: "Netacad Cisco",
    location: "En ligne",
    period: "2023",
    description:
      "Certification Cisco niveau 1 couvrant les fondamentaux des réseaux et modèles OSI.",
    skills: ["Cisco", "Réseaux", "OSI", "TCP/IP"],
    hasDetail: true,
  },
  {
    id: "cert2",
    type: "certification",
    title:
      "CCNA 2 - Switching, Routing, and Wireless Essentials",
    company: "Netacad Cisco",
    location: "En ligne",
    period: "2024",
    description:
      "Certification Cisco niveau 2 en configuration des équipements réseau et routage.",
    skills: ["Switching", "Routing", "Wireless", "VLANs"],
    hasDetail: true,
  },
  {
    id: "cert2b",
    type: "certification",
    title:
      "CCNA 3 - Enterprise Networking, Security, and Automation",
    company: "Netacad Cisco",
    location: "En ligne",
    period: "2024",
    description:
      "Certification Cisco niveau 3 couvrant les réseaux d'entreprise, sécurité et automatisation.",
    skills: [
      "Enterprise Networks",
      "Network Security",
      "Automation",
      "ACLs",
    ],
    hasDetail: true,
  },
  {
    id: "cert3",
    type: "certification",
    title: "Python Essential 1",
    company: "Skills for All",
    location: "En ligne",
    period: "2023",
    description:
      "Certification sur les fondamentaux de la programmation Python et syntaxe de base.",
    skills: ["Python", "Programmation", "Syntaxe", "Variables"],
    hasDetail: true,
  },
  {
    id: "cert4",
    type: "certification",
    title: "Python Essential 2",
    company: "Skills for All",
    location: "En ligne",
    period: "2023",
    description:
      "Certification avancée Python couvrant POO, modules et développement d'applications.",
    skills: [
      "Python OOP",
      "Modules",
      "Développement",
      "Applications",
    ],
    hasDetail: true,
  },
  {
    id: "cert5",
    type: "certification",
    title: "AWS Cloud Practitioner",
    company: "Amazon Web Services",
    location: "En ligne",
    period: "2025",
    description:
      "Certification AWS de base couvrant les services cloud et bonnes pratiques.",
    skills: ["AWS", "Cloud Computing", "EC2", "S3"],
    hasDetail: true,
  },
  {
    id: "cert6",
    type: "certification",
    title: "NDG Linux Essential",
    company: "Netacad Cisco",
    location: "En ligne",
    period: "2023",
    description:
      "Certification sur les fondamentaux de Linux et l'administration système Linux.",
    skills: ["Linux", "Administration Système", "Terminal"],
    hasDetail: true,
  },
  {
    id: "cert7",
    type: "certification",
    title: "Linux Server 1",
    company: "Netacad Cisco",
    location: "En ligne",
    period: "2024",
    description:
      "Certification en administration de serveurs Linux et services système.",
    skills: ["Linux Server", "Services", "Administration"],
    hasDetail: true,
  },
  {
    id: "cert8",
    type: "certification",
    title: "CyberOps",
    company: "Netacad Cisco",
    location: "En ligne",
    period: "2024",
    description:
      "Certification en cybersécurité et opérations de sécurité réseau.",
    skills: ["Cybersécurité", "Monitoring", "Sécurité Réseau"],
    hasDetail: true,
  },
  {
    id: "cert9",
    type: "certification",
    title: "ITE (IT Essentials)",
    company: "Netacad Cisco",
    location: "En ligne",
    period: "2023",
    description:
      "Certification sur les essentiels des technologies de l'information.",
    skills: ["Hardware", "Software", "Troubleshooting"],
    hasDetail: true,
  },
  {
    id: "cert10",
    type: "certification",
    title: "IoT Fundamentals",
    company: "Netacad Cisco",
    location: "En ligne",
    period: "2025",
    description:
      "Certification sur les fondamentaux de l'Internet des Objets et systèmes connectés.",
    skills: ["IoT", "Capteurs", "Connectivité", "Sécurité IoT"],
    hasDetail: true,
  },
  {
    id: "cert11",
    type: "certification",
    title: "ADDS (Active Directory Domain Services)",
    company: "Microsoft",
    location: "En ligne",
    period: "2024",
    description:
      "Certification sur l'installation, la configuration et la gestion d'Active Directory Domain Services pour les environnements d'entreprise.",
    skills: ["Active Directory", "ADDS", "Domaines", "Gestion Utilisateurs"],
    hasDetail: true,
  },
  {
    id: "cert12",
    type: "certification",
    title: "FSMO (Flexible Single Master Operations)",
    company: "Microsoft",
    location: "En ligne",
    period: "2024",
    description:
      "Certification sur la gestion des rôles FSMO dans Active Directory, incluant le transfert et la prise de contrôle des rôles.",
    skills: ["FSMO", "Active Directory", "Rôles Maîtres", "Administration"],
    hasDetail: true,
  },
  {
    id: "cert13",
    type: "certification",
    title: "Introduction à la Cybersécurité",
    company: "Netacad Cisco",
    location: "En ligne",
    period: "2023",
    description:
      "Certification d'introduction aux concepts fondamentaux de la cybersécurité, menaces et protection des données.",
    skills: ["Cybersécurité", "Menaces", "Protection", "Sécurité"],
    hasDetail: true,
  },
  {
    id: "cert14",
    type: "certification",
    title: "GPO (Group Policy Objects)",
    company: "Microsoft",
    location: "En ligne",
    period: "2024",
    description:
      "Certification sur la création, la gestion et le déploiement de stratégies de groupe pour contrôler l'environnement Active Directory.",
    skills: ["GPO", "Stratégies de Groupe", "Active Directory", "Administration"],
    hasDetail: true,
  },
  {
    id: "cert15",
    type: "certification",
    title: "DNS (Domain Name System)",
    company: "Microsoft",
    location: "En ligne",
    period: "2024",
    description:
      "Certification sur l'installation, la configuration et la gestion de serveurs DNS Windows, incluant les zones et la résolution de noms.",
    skills: ["DNS", "Résolution de Noms", "Zones DNS", "Windows Server"],
    hasDetail: true,
  },
  {
    id: "cert16",
    type: "certification",
    title: "Windows Operating System Fundamentals",
    company: "Netacad Cisco",
    location: "En ligne",
    period: "2023",
    description:
      "Certification sur les fondamentaux des systèmes d'exploitation Windows, administration et configuration de base.",
    skills: ["Windows", "OS", "Administration", "Configuration"],
    hasDetail: true,
  },
];

export default function CVSection() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<TimelineItem | null>(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case "experience":
        return <Briefcase className="h-6 w-6" />;
      case "education":
        return <GraduationCap className="h-6 w-6" />;
      case "certification":
        return <Award className="h-6 w-6" />;
      default:
        return <Briefcase className="h-6 w-6" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "experience":
        return "bg-blue-600";
      case "education":
        return "bg-green-600";
      case "certification":
        return "bg-purple-600";
      default:
        return "bg-blue-600";
    }
  };

  const handleDownloadCV = async () => {
    try {
      console.log('📄 handleDownloadCV: Tentative d\'accès au CV...');
      const mainCV = await CVService.getMainCV();

      if (mainCV) {
        console.log('✅ CV identifié:', mainCV.name, 'URL:', mainCV.url);
        const { SimpleFileService } = await import('../utils/simpleFileService');
        const event = new CustomEvent('openPDFViewer', {
          detail: { url: mainCV.url, fileName: mainCV.name }
        });
        window.dispatchEvent(event);
      } else {
        console.warn('⚠️ Aucun CV trouvé avec les critères requis ("cv" dans le nom)');
        alert('📄 Aucun CV personnalisé n\'a été trouvé dans vos documents.\n\n' +
              '💡 Note : Le système recherche un fichier PDF dont le nom contient "CV" (ex: "CV_Ndiaga.pdf").\n\n' +
              'Veuillez vérifier vos fichiers dans le panneau admin.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'accès au CV:', error);
      alert('Erreur lors de l\'accès au CV. Veuillez réessayer.');
    }
  };

  const handleViewDetail = (id: string) => {
    const item = [...timelineData, ...certificationsData].find(item => item.id === id);
    if (item && item.type === 'certification') {
      setSelectedCertificate(item);
      setIsCertificateModalOpen(true);
    } else {
      // Pour les autres types (formation/expérience)
      setSelectedItem(id);
      alert(
        `Voir les détails de: ${item?.title}`,
      );
    }
  };

  const renderTimelineSection = (
    data: TimelineItem[],
    title: string,
    description: string,
  ) => (
    <div className="mb-20">
      <div className="text-center mb-12">
        <h3 className="text-2xl sm:text-3xl mb-4">{title}</h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 to-purple-600"></div>

        <div className="space-y-12">
          {data.map((item, index) => (
            <div
              key={item.id}
              className="relative flex items-start"
            >
              {/* Timeline dot */}
              <div
                className={`absolute left-4 w-8 h-8 rounded-full ${getTypeColor(item.type)} flex items-center justify-center text-white z-10`}
              >
                {getIcon(item.type)}
              </div>

              {/* Content card */}
              <div className="ml-20 w-full">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                      <div>
                        <h4 className="text-xl mb-1">
                          {item.title}
                        </h4>
                        <p className="text-lg text-blue-600 mb-2">
                          {item.company}
                        </p>
                        <div className="flex flex-wrap items-center text-gray-600 gap-4 mb-3">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {item.period}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {item.location}
                          </div>
                        </div>
                      </div>
                      {item.hasDetail && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleViewDetail(item.id)
                          }
                          className="mt-4 lg:mt-0"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Voir détail
                        </Button>
                      )}
                    </div>

                    <p className="text-gray-700 mb-4">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {item.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="bg-blue-50 text-blue-700"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section id="cv" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl mb-4">
            Mon{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Parcours
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Découvrez mon expérience professionnelle, ma
            formation et mes certifications
          </p>
          <Button
            onClick={handleDownloadCV}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Consulter mon CV 
          </Button>
        </div>

        {/* Section Formations et Expériences */}
        {renderTimelineSection(
          timelineData,
          "Formation & Expérience",
          "Mon parcours académique et professionnel",
        )}

        {/* Section Certifications */}
        {renderTimelineSection(
          certificationsData,
          "Certifications",
          "Mes certifications professionnelles et techniques",
        )}

        {/* Modal pour les certificats */}
        <CertificateModal
          isOpen={isCertificateModalOpen}
          onClose={() => {
            setIsCertificateModalOpen(false);
            setSelectedCertificate(null);
          }}
          certificate={selectedCertificate}
        />
      </div>
    </section>
  );
}
