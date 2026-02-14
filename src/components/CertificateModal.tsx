import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Calendar,
  MapPin,
  ExternalLink,
  X,
} from "lucide-react";
import { CertificateService } from "../utils/certificateService";

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

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: TimelineItem | null;
}

export default function CertificateModal({
  isOpen,
  onClose,
  certificate,
}: CertificateModalProps) {
  const [certificateImageUrl, setCertificateImageUrl] =
    useState<string>("");
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  // Images par défaut pour les certificats (génériques)
  const getDefaultCertificateImage = (certId: string): string => {
    const defaultImages: Record<string, string> = {

      cert1: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80",
      cert2: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80",
      cert2b: "/assets/CCNAENSA.PNG",
      cert3: "/assets/Python2.PNG",
      cert4: "/assets/Python2.PNG",
      cert5: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=600&q=80",
      cert6: "/assets/NDGLinux.PNG",
      cert7: "https://images.unsplash.com/photo-1518373714866-3f1478910cc0?w=600&q=80",
      cert8: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80",
      cert9: "/assets/ITE.PNG",
      cert10: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
      cert11: "/assets/ADDS.jpg",
      cert12: "/assets/FSMO.jpg",
      cert13: "/assets/Cybersec.PNG",
      cert14: "/assets/GPO.jpg",
      cert15: "/assets/DNS.jpg",
      cert16: "/assets/Operating_Systems_Basics_certificate_sognanendiaga0-gmail-com_73b9fef2-7498-4d2c-9454-dc6b6e33085b-1.jpg",
    };

    return (
      defaultImages[certId] ||
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"
    );
  };

  useEffect(() => {
    if (!certificate) return;

    const loadCertificateImage = async () => {
      setIsLoadingImage(true);
      console.log('🖼️ Chargement image pour certificat:', certificate.id, '-', certificate.title);

      try {
        const defaultImageUrl = getDefaultCertificateImage(
          certificate.id,
        );
        console.log('🔗 URL par défaut:', defaultImageUrl);

        const imageUrl =
          await CertificateService.getCertificateImageByTimelineId(
            certificate.id,
            defaultImageUrl,
          );

        console.log('🖼️ URL finale utilisée:', imageUrl);
        console.log('📍 Source:', imageUrl === defaultImageUrl ? 'Unsplash (défaut)' : 'Supabase (personnalisée)');

        setCertificateImageUrl(imageUrl);
      } catch (error) {
        console.error(
          "❌ Erreur chargement image certificat:",
          error,
        );
        setCertificateImageUrl(
          getDefaultCertificateImage(certificate.id),
        );
      } finally {
        setIsLoadingImage(false);
      }
    };

    loadCertificateImage();
  }, [certificate]);

  if (!certificate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">
                {certificate.title}
              </DialogTitle>
              <DialogDescription className="text-lg text-blue-600 mb-4">
                {certificate.company}
              </DialogDescription>
              <div className="flex flex-wrap items-center text-gray-600 gap-4 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {certificate.period}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {certificate.location}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image du certificat */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-lg border bg-gray-50 min-h-[300px] flex items-center justify-center">
              {isLoadingImage ? (
                <div className="animate-pulse bg-gray-200 w-full h-[300px] rounded"></div>
              ) : (
                <ImageWithFallback
                  src={certificateImageUrl}
                  alt={`Certificat ${certificate.title}`}
                  className="w-full h-auto max-h-[500px] object-contain rounded-lg"
                />
              )}
            </div>
            <div className="absolute top-2 right-2">
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-700"
              >
                Certification
              </Badge>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-medium mb-3">
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {certificate.description}
            </p>
          </div>

          {/* Compétences */}
          <div>
            <h3 className="text-lg font-medium mb-3">
              Compétences développées
            </h3>
            <div className="flex flex-wrap gap-2">
              {certificate.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-purple-200"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Détails supplémentaires selon le certificat */}
          <div>
            <h3 className="text-lg font-medium mb-3">
              Détails techniques
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
              {getCertificateDetails(certificate.id)}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() =>
              window.open(certificateImageUrl, "_blank")
            }
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Voir en grand
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              console.log('🧪 Test de récupération des certificats...');
              const certs = await CertificateService.getImportedCertificates();
              console.log('📋 Certificats disponibles:', certs);
              alert(`${certs.length} certificat(s) trouvé(s)\n\nVoir la console (F12) pour les détails`);
            }}
            className="flex items-center gap-2"
          >
            🧪 Test Connexion
          </Button>
          <Button onClick={onClose}>Fermer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Fonction pour obtenir les détails techniques de chaque certificat
function getCertificateDetails(certId: string): string {
  const details: Record<string, string> = {
    cert1:
      "Introduction aux concepts fondamentaux des réseaux, modèle OSI, protocoles TCP/IP, adressage IPv4/IPv6, configuration des équipements réseau de base.",
    cert2:
      "Configuration avancée des commutateurs et routeurs Cisco, VLANs, routage inter-VLAN, protocoles de routage dynamique, réseaux sans fil.",
    cert2b:
      "Réseaux d'entreprise, technologies WAN, sécurité réseau avancée, ACL, automatisation réseau, SDN et programmabilité.",
    cert3:
      "Syntaxe Python, types de données, structures de contrôle, fonctions, gestion des erreurs, modules standard.",
    cert4:
      "Programmation orientée objet en Python, modules et packages, manipulation de fichiers, bases de données, développement d'applications.",
    cert5:
      "Services fondamentaux AWS (EC2, S3, VPC, RDS), modèles de tarification, sécurité cloud, bonnes pratiques AWS.",
    cert6:
      "Administration système Linux, ligne de commande, gestion des fichiers, processus, utilisateurs, permissions.",
    cert7:
      "Administration de serveurs Linux, services système, Apache/Nginx, bases de données, monitoring, sécurité serveur.",
    cert8:
      "Opérations de cybersécurité, détection d'incidents, analyse de logs, outils SIEM, réponse aux incidents.",
    cert9:
      "Installation et configuration de matériel informatique, dépannage hardware/software, maintenance préventive.",
    cert10:
      "Architecture IoT, protocoles de communication, capteurs et actionneurs, sécurité IoT, plateformes cloud IoT.",
    cert11:
      "Installation et configuration d'Active Directory Domain Services, gestion des domaines, forêts et sites, gestion des utilisateurs et groupes, stratégies d'organisation.",
    cert12:
      "Gestion des rôles FSMO (Schema Master, Domain Naming Master, RID Master, PDC Emulator, Infrastructure Master), transfert et prise de rôles, dépannage des rôles maîtres.",
    cert13:
      "Concepts fondamentaux de cybersécurité, types de menaces et attaques, protection des données personnelles et entreprise, bonnes pratiques de sécurité.",
    cert14:
      "Création et gestion des stratégies de groupe (GPO), déploiement de paramètres de sécurité, configuration centralisée des postes de travail, dépannage GPO.",
    cert15:
      "Installation et configuration de serveurs DNS Windows, gestion des zones DNS (primaire, secondaire), enregistrements DNS (A, AAAA, CNAME, MX), résolution de noms et dépannage.",
    cert16:
      "Fondamentaux des systèmes d'exploitation Windows, installation et configuration de Windows, gestion des utilisateurs et permissions, outils d'administration système.",
  };

  return (
    details[certId] ||
    "Certification professionnelle validée avec succès."
  );
}
