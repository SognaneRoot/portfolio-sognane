import { useState } from "react";
import {
  ExternalLink,
  Github,
  Calendar,
  ArrowRight,
  Wrench,
  Code,
  Database,
  Shield,
  Cloud,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import CertificationModal from "./CertificationModal";
import { SimpleFileService } from "../utils/simpleFileService";

interface Project {
  id: string;
  title: string;
  description: string;
  year: string;
  category: "certification" | "project";
  image: string;
  technologies: string[];
  links?: {
    demo?: string;
    github?: string;
    certificate?: string;
  };
  featured?: boolean;
}

interface Tool {
  id: string;
  name: string;
  category: string;
  icon: any;
  description: string;
  proficiency:
    | "Débutant"
    | "Intermédiaire"
    | "Avancé"
    | "Expert";
  color: string;
}

const projectsData: Project[] = [
  {
    id: "proj1",
    title: "Système de Sécurité Domestique IoT",
    description:
      "Développement d'un système IoT de sécurité domestique avec détection d'intrusion, capteurs et système d'alarme connecté.",
    year: "2024",
    category: "project",
    image:
      "https://images.unsplash.com/photo-1593720213681-e9a8778330a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGNvZGV8ZW58MXx8fHwxNzU3NzI5OTA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    technologies: [
      "IoT",
      "Capteurs",
      "Arduino",
      "Détection Intrusion",
    ],
    links: {
      demo: "#",
    },
    featured: true,
  },
  {
    id: "proj2",
    title: "Téléphonie IP - Asterisk & Issabel",
    description:
      "Déploiement et configuration d'une solution de téléphonie IP complète avec serveurs Asterisk et interface Issabel.",
    year: "2024",
    category: "project",
    image:
      "https://images.unsplash.com/photo-1667984390538-3dea7a3fe33d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZ3xlbnwxfHx8fDE3NTc3NjYxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    technologies: [
      "Asterisk",
      "Issabel",
      "VoIP",
      "Téléphonie IP",
    ],
    links: {
      demo: "#",
    },
    featured: true,
  },
  {
    id: "proj3",
    title: "Tests de Pénétration - Attaque Brute Force",
    description:
      "Réalisation de tests de sécurité par attaques brute force pour évaluer la robustesse des systèmes d'authentification.",
    year: "2024",
    category: "project",
    image:
      "https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBkZXNpZ258ZW58MXx8fHwxNzU3NzU1NjgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    technologies: [
      "Penetration Testing",
      "Brute Force",
      "Cybersécurité",
      "Tests Sécurité",
    ],
    links: {
      demo: "#",
    },
    featured: true,
  },
  {
    id: "proj4",
    title: "Application Java - Suivi Dépôt Candidature",
    description:
      "Développement d'une application Java pour le suivi et la gestion des dépôts de candidatures avec interface graphique.",
    year: "2024",
    category: "project",
    image:
      "https://images.unsplash.com/photo-1593720213681-e9a8778330a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGNvZGV8ZW58MXx8fHwxNzU3NzI5OTA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    technologies: [
      "Java",
      "Swing/JavaFX",
      "Base de données",
      "Interface utilisateur",
    ],
    links: {
      demo: "#",
    },
  },
  {
    id: "proj5",
    title: "Application Java - Gestion de Stock",
    description:
      "Système de gestion de stock développé en Java avec fonctionnalités d'inventaire, commandes et rapports.",
    year: "2024",
    category: "project",
    image:
      "https://images.unsplash.com/photo-1593720213681-e9a8778330a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGNvZGV8ZW58MXx8fHwxNzU3NzI5OTA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    technologies: ["Java", "MySQL", "JDBC", "Gestion Stock"],
    links: {
      demo: "#",
    },
  },
  {
    id: "proj6",
    title: "Application Java - Tools Tracker",
    description:
      "Outil de suivi et gestion d'outils développé en Java pour optimiser la traçabilité des équipements.",
    year: "2024",
    category: "project",
    image:
      "https://images.unsplash.com/photo-1593720213681-e9a8778330a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGNvZGV8ZW58MXx8fHwxNzU3NzI5OTA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    technologies: [
      "Java",
      "Tracking System",
      "Interface GUI",
      "Base de données",
    ],
    links: {
      demo: "#",
    },
  },
  {
    id: "proj7",
    title: "Cloud Privé OpenStack",
    description:
      "Déploiement et configuration d'un cloud privé OpenStack avec gestion des machines virtuelles et stockage.",
    year: "2025",
    category: "project",
    image:
      "https://images.unsplash.com/photo-1667984390538-3dea7a3fe33d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZ3xlbnwxfHx8fDE3NTc3NjYxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    technologies: [
      "OpenStack",
      "Cloud Privé",
      "Virtualisation",
      "Nova",
    ],
    links: {
      demo: "#",
    },
  },
  {
    id: "proj17",
    title: "Cloud AWS",
    description:
      "Mise en place d'une application web avec une base de données sur AWS.",
    year: "2025",
    category: "project",
    image:
      "https://images.unsplash.com/photo-1667984390538-3dea7a3fe33d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZ3xlbnwxfHx8fDE3NTc3NjYxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    technologies: [
      "AWS",
      "Cloud Public",
      "Virtualisation",
      "EC2, RDS, VPC",
    ],
    links: {
      demo: "#",
    },
  },
  {
    id: "proj8",
    title: "Découverte de Proxmox",
    description:
      "Mise en place d'une infrastructure de virtualisation Proxmox sur VMware.",
    year: "2025",
    category: "project",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBzTUMH4gWMyjb_De2wQXAM9oMAfYLkIkrtA&s",
    technologies: [
      "Proxmox VE",
      "Virtualisation",
      "Hyperviseur",
    ],
    links: {
      demo: "#",
    },
  },
  {
    id: "proj22",
    title: "Configuration Proxmox avancée",
    description:
      "Mise en place d'une infrastructure de virtualisation Proxmox avec Ceph, HA, système de sauvegarde automatisé Proxmox Backup.",
    year: "2025",
    category: "project",
    image:
      "data:image/jpeg;base64,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",
    technologies: [
      "Proxmox VE",
      "Proxmox Backup",
      "CEPH",
      "HA",
    ],
    links: {
      demo: "#",
    },
  },
  {
    id: "proj9",
    title: "Stack Web NGINX + PHP + FRMP",
    description:
      "Configuration et déploiement d'une stack web complète avec serveur NGINX, PHP et gestion FRMP pour applications web.",
    year: "2025",
    category: "project",
    image:
      "https://images.unsplash.com/photo-1593720213681-e9a8778330a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGNvZGV8ZW58MXx8fHwxNzU3NzI5OTA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    technologies: ["NGINX", "PHP", "FRMP", "Serveur Web"],
    links: {
      demo: "#",
    },
  },
  {
    id: "proj10",
    title: "Supervision Réseau - Ntopng",
    description:
      "Mise en place d'un système de supervision réseau avec Ntopng pour le monitoring du trafic et analyse des performances.",
    year: "2025",
    category: "project",
    image:
      "https://images.unsplash.com/photo-1667984390538-3dea7a3fe33d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZ3xlbnwxfHx8fDE3NTE3NjYxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    technologies: [
      "Ntopng",
      "Monitoring",
      "Analyse Trafic",
      "Supervision",
    ],
    links: {
      demo: "#",
    },
  },
  {
    id: "proj11",
    title: "Gestion de Version - Git & GitHub",
    description:
      "Mise en place et gestion de projets avec Git et GitHub, incluant workflows, branches et collaboration en équipe.",
    year: "2024-2025",
    category: "project",
    image:
      "https://images.unsplash.com/photo-1593720213681-e9a8778330a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGNvZGV8ZW58MXx8fHwxNzU3NzI5OTA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    technologies: [
      "Git",
      "GitHub",
      "Version Control",
      "Collaboration",
    ],
    links: {
      demo: "#",
    },
  },
  {
    id: "proj12",
    title: "VPN Site-to-Site",
    description:
      "Configuration et déploiement de tunnels VPN site-to-site pour interconnecter des sites distants de manière sécurisée.",
    year: "2025",
    category: "project",
    image:
      "https://images.unsplash.com/photo-1667984390538-3dea7a3fe33d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZ3xlbnwxfHx8fDE3NTc3NjYxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    technologies: [
      "VPN",
      "Site-to-Site",
      "IPSec",
      "Sécurité Réseau",
    ],
    links: {
      demo: "#",
    },
  },
  {
    id: "proj13",
    title: "Services Windows Server - ADDS & Plus",
    description:
      "Configuration complète des services Windows Server : ADDS, DNS, DHCP, IIS, NTP, SMB, et gestion des GPO.",
    year: "2024",
    category: "project",
    image:
      "https://images.unsplash.com/photo-1593720213681-e9a8778330a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGNvZGV8ZW58MXx8fHwxNzU3NzI5OTA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    technologies: [
      "ADDS",
      "DNS",
      "DHCP",
      "IIS",
      "NTP",
      "SMB",
      "GPO",
    ],
    links: {
      demo: "#",
    },
  },
  {
    id: "proj14",
    title: "Configuration Réseau Avancée",
    description:
      "Configuration avancée de réseaux avec VLANs, ACLs, OSPF, DHCP et EtherChannel pour optimiser les performances.",
    year: "2023-2024",
    category: "project",
    image:
      "https://images.unsplash.com/photo-1667984390538-3dea7a3fe33d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZ3xlbnwxfHx8fDE3NTc3NjYxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    technologies: [
      "VLAN",
      "ACL",
      "OSPF",
      "DHCP",
      "EtherChannel",
    ],
    links: {
      demo: "#",
    },
  },
  {
    id: "proj15",
    title: "Migration Active Directory",
    description:
      "Migration complète d'un domaine Active Directory de Windows Server 2012 vers 2019 puis 2022 avec mise à jour des services.",
    year: "2024",
    category: "project",
    image:
      "https://images.unsplash.com/photo-1593720213681-e9a8778330a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGNvZGV8ZW58MXx8fHwxNzU3NzI5OTA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    technologies: [
      "Active Directory",
      "Windows Server",
      "Migration",
      "Mise à niveau",
    ],
    links: {
      demo: "#",
    },
  },
  {
    id: "proj16",
    title: "Site Portfolio WordPress",
    description:
      "Création et développement d'un site portfolio professionnel avec WordPress.",
    year: "2024",
    category: "project",
    image:
      "https://images.unsplash.com/photo-1593720213681-e9a8778330a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGNvZGV8ZW58MXx8fHwxNzU3NzI5OTA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    technologies: ["WordPress", "PHP", "MySQL", "HTML/CSS"],
    links: {
      demo: "https://monportfolio.ct.ws",
    },
  },
  {
    id: "proj17",
    title: "Implémentation GLPI",
    description:
      "Installation et configuration d'une solution open-source de gestion des services informatiques (ITSM — IT Service Management)..",
    year: "2026",
    category: "project",
    image:
      "public/assets/GLPI.PNG",
    technologies: ["Apache", "PHP", "MariaDB"],
    links: {
      demo: "https://monportfolio.ct.ws",
    },
  },
  {
    id: "proj18",
    title: "Guide Utilisation GLPI",
    description:
      "Guide d'utilisa du solution open-source de gestion des services informatiques (ITSM — IT Service Management)..",
    year: "2026",
    category: "project",
    image:
      "public/assets/GLPI.PNG",
    technologies: ["Apache", "PHP", "MariaDB"],
    links: {
      demo: "https://monportfolio.ct.ws",
    },
  },
  {
    id: "proj19",
    title: "Ntop-ng",
    description:
      " ntopng est un logiciel de surveillance et d'analyse du trafic réseau.",
    year: "2026",
    category: "project",
    image:
      "public/assets/ntopng.PNG",
    technologies: ["Supervision", "Apache", "PHP", "MariaDB"],
    links: {
      demo: "https://monportfolio.ct.ws",
    },
  },
  {
    id: "proj20",
    title: "Roundcube avec Openldap",
    description:
      "Roundcube est un client de messagerie web puissant et open source qui vous permet d'accéder à vos e-mails professionnels et de les gérer depuis n'importe quel appareil doté d'un navigateur .",
    year: "2026",
    category: "project",
    image:
      "public/assets/ntopng.PNG",
    technologies: ["Supervision", "Webmail", "authentification", "messagerie"],
    links: {
      demo: "https://monportfolio.ct.ws",
    },
  },
  {
    id: "proj21",
    title: "Roundcube avec Openldap",
    description:
      "Roundcube est un client de messagerie web puissant et open source qui vous permet d'accéder à vos e-mails professionnels et de les gérer depuis n'importe quel appareil doté d'un navigateur .",
    year: "2026",
    category: "project",
    image:
      "public/assets/ntopng.PNG",
    technologies: ["Supervision", "Webmail", "authentification", "messagerie"],
    links: {
      demo: "https://monportfolio.ct.ws",
    },
  },

  // Certifications
  {
    id: "cert1",
    title: "Python Essential 1 & 2",
    description:
      "Certification Skills for All en programmation Python et développement d'applications.",
    year: "2023",
    category: "certification",
    image:
      "src\assets\Python2.PNG",
    technologies: ["Python", "Programmation", "Développement"],
    links: {
      certificate: "#",
    },
    featured: true,
  },
  {
    id: "cert2",
    title: "CCNA 1",
    description:
      "Certification Cisco Netacad en réseaux informatiques et configuration d'équipements.",
    year: "2023-2024",
    category: "certification",
    image:
      "src\assets\CCNA-ENSA.PNG",
    technologies: ["Cisco", "Réseaux", "Routing", "Switching"],
    links: {
      certificate: "#",
    },
    featured: true,
  },
  {
  id: "cert7",
  title: "CCNA  2",
  description:
    "Certification Cisco Netacad en réseaux informatiques et configuration d'équipements.",
  year: "2023-2024",
  category: "certification",
  image:
    "src\assets\CCNA-ENSA.PNG",
  technologies: ["Cisco", "Réseaux", "Routing", "Switching"],
  links: {
    certificate: "#",
  },
  featured: true,
  },
  {
  id: "cert8",
  title: "CCNA 3",
  description:
    "Certification Cisco Netacad en réseaux informatiques et configuration d'équipements.",
  year: "2023-2024",
  category: "certification",
  image:
    "/assets/CCNA-ENSA.PNG",
  technologies: ["Cisco", "Réseaux", "Routing", "Switching"],
  links: {
    certificate: "#",
  },
  featured: true,
  },
  {
    id: "cert3",
    title: "NDG Linux Essential",
    description:
      "Certification Cisco Netacad sur les fondamentaux Linux et administration système.",
    year: "2023",
    category: "certification",
    image:
      "/assets/NDG-Linux.PNG",
    technologies: [
      "Linux",
      "Administration Système",
      "Terminal",
    ],
    links: {
      certificate: "#",
    },
  },
  {
    id: "cert4",
    title: "CyberOps",
    description:
      "Certification Cisco Netacad en cybersécurité et opérations de sécurité réseau.",
    year: "2024",
    category: "certification",
    image:
      "https://images.unsplash.com/photo-1667984390538-3dea7a3fe33d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZ3xlbnwxfHx8fDE3NTc3NjYxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    technologies: [
      "Cybersécurité",
      "Monitoring",
      "Sécurité Réseau",
    ],
    links: {
      certificate: "#",
    },
  },
  {
    id: "cert5",
    title: "Linux Server 1",
    description:
      "Certification Cisco Netacad en administration de serveurs Linux.",
    year: "2023",
    category: "certification",
    image:
      "src\assets\NDG-Linux.PNG",
    technologies: [
      "Linux Server",
      "Administration",
      "Services",
    ],
    links: {
      certificate: "#",
    },
  },
  {
    id: "cert6",
    title: "ITE (IT Essentials)",
    description:
      "Certification Cisco Netacad sur les essentiels des technologies de l'information.",
    year: "2023",
    category: "certification",
    image:
      "src\assets\ITE.PNG",
    technologies: ["Hardware", "Software", "Troubleshooting"],
    links: {
      certificate: "#",
    },
  },
  {
    id: "cert9",
    title: "Operating System Basics",
    description:
      "Certification Cisco Netacad sur les bases des systèmes d'exploitations",
    year: "2024",
    category: "certification",
    image:
      "src\assets\Operating_Systems_Basics_certificate_sognanendiaga0-gmail-com_73b9fef2-7498-4d2c-9454-dc6b6e33085b-1.jpg",
    technologies: ["Hardware", "Software", "Administration", "Windows", "Linux"],
    links: {
      certificate: "#",
    },
  },
];

// Données des outils essentiels maîtrisés
const toolsData: Tool[] = [
  // Systèmes d'exploitation
  {
    id: "tool1",
    name: "Windows Server",
    category: "Systèmes d'exploitation",
    icon: Code,
    description:
      "Administration complète Windows Server 2012/2016/2019/2022/2025",
    proficiency: "Avancé",
    color: "blue",
  },
  {
    id: "tool2",
    name: "Linux",
    category: "Systèmes d'exploitation",
    icon: Code,
    description:
      "Administration système Linux, scripts Bash, service, gestion utilisateur",
    proficiency: "Avancé",
    color: "green",
  },

  // Virtualisation & Cloud
  {
    id: "tool3",
    name: "VMware vSphere",
    category: "Virtualisation",
    icon: Cloud,
    description:
      "Déploiement et gestion d'infrastructures virtuelles",
    proficiency: "Avancé",
    color: "purple",
  },
  {
    id: "tool4",
    name: "Proxmox VE",
    category: "Virtualisation",
    icon: Cloud,
    description: "Hyperviseur open-source, containers LXC",
    proficiency: "Avancé",
    color: "orange",
  },
  {
    id: "tool5",
    name: "OpenStack",
    category: "Cloud",
    icon: Cloud,
    description: "Déploiement et gestion de cloud privé",
    proficiency: "Avancé",
    color: "red",
  },
  {
    id: "tool6",
    name: "HyperV",
    category: "Virtualisation",
    icon: Cloud,
    description:
      "Déploiement et gestion d'infrastructures virtuelles",
    proficiency: "Avancé",
    color: "cyan",
  },

  // Réseaux
  {
    id: "tool7",
    name: "Cisco IOS",
    category: "Réseaux",
    icon: Wrench,
    description:
      "Configuration routeurs/switchs, VLAN, OSPF, ACL, STP",
    proficiency: "Avancé",
    color: "blue",
  },
  {
    id: "tool8",
    name: "pfSense",
    category: "Sécurité Réseau",
    icon: Shield,
    description: "Firewall, VPN, QoS, monitoring réseau",
    proficiency: "Avancé",
    color: "red",
  },

  // Base de données
  {
    id: "tool9",
    name: "MySQL/MariaDB",
    category: "Base de données",
    icon: Database,
    description: "Administration, optimisation, sauvegarde",
    proficiency: "Intermédiaire",
    color: "blue",
  },
  {
    id: "tool10",
    name: "Active Directory",
    category: "Annuaire",
    icon: Database,
    description: "ADDS, DNS, DHCP, GPO, migration domaines",
    proficiency: "Avancé",
    color: "green",
  },

  // Sécurité
  {
    id: "tool11",
    name: "Nmap",
    category: "Sécurité",
    icon: Shield,
    description: "Audit sécurité, tests de pénétration",
    proficiency: "Intermédiaire",
    color: "red",
  },
  {
    id: "tool12",
    name: "Wireshark",
    category: "Sécurité",
    icon: Shield,
    description: "Audit sécurité, tests de pénétration",
    proficiency: "Intermédiaire",
    color: "red",
  },
  {
    id: "tool13",
    name: "OpenVPN/IPSec",
    category: "VPN",
    icon: Shield,
    description: "Tunnels VPN site-to-site, accès distant",
    proficiency: "Avancé",
    color: "purple",
  },

  // Monitoring
  {
    id: "tool14",
    name: "Ntopng",
    category: "Monitoring",
    icon: Wrench,
    description: "Supervision réseau, analyse trafic",
    proficiency: "Intermédiaire",
    color: "orange",
  },
  {
    id: "tool15",
    name: "Zabbix",
    category: "Monitoring",
    icon: Wrench,
    description: "Supervision réseau, analyse trafic",
    proficiency: "Intermédiaire",
    color: "red",
  },
  {
    id: "tool16",
    name: "Prometheus & Grafna",
    category: "Monitoring",
    icon: Wrench,
    description: "Supervision réseau, analyse trafic",
    proficiency: "Intermédiaire",
    color: "purple",
  },

  // Développement
  {
    id: "tool17",
    name: "Python",
    category: "Programmation",
    icon: Code,
    description:
      "Scripts automation, développement applications",
    proficiency: "Intermédiaire",
    color: "yellow",
  },
  {
    id: "tool18",
    name: "Java",
    category: "Programmation",
    icon: Code,
    description: "Applications desktop, gestion de données",
    proficiency: "Intermédiaire",
    color: "red",
  },

  // Web & CMS
  {
    id: "tool19",
    name: "NGINX/Apache",
    category: "Serveurs Web",
    icon: Wrench,
    description: "Configuration serveurs web, load balancing",
    proficiency: "Avancé",
    color: "green",
  },
  {
    id: "tool20",
    name: "WordPress",
    category: "CMS",
    icon: Code,
    description: "Développement sites, personnalisation thèmes",
    proficiency: "Avancé",
    color: "blue",
  },
  {
    id: "tool21",
    name: "Devnet",
    category: "Réseau",
    icon: Code,
    description: "Automation",
    proficiency: "Intermédiaire",
    color: "green",
  },
];

interface ProjectsSectionProps {
  onViewProject: (project: Project) => void;
}

export default function ProjectsSection({
  onViewProject,
}: ProjectsSectionProps) {
  const [filter, setFilter] = useState<
    "all" | "projects" | "certifications" | "tools"
  >("all");
  const [hoveredCard, setHoveredCard] = useState<string | null>(
    null,
  );
  const [selectedCertification, setSelectedCertification] =
    useState<Project | null>(null);
  const [
    isCertificationModalOpen,
    setIsCertificationModalOpen,
  ] = useState(false);

  const filteredProjects = projectsData.filter((project) => {
    if (filter === "all") return true;
    if (filter === "projects")
      return project.category === "project";
    if (filter === "certifications")
      return project.category === "certification";
    return true;
  });

  const handleViewDetail = async (project: Project) => {
    if (project.category === "certification") {
      setSelectedCertification(project);
      setIsCertificationModalOpen(true);
    } else {
      // Pour les projets, vérifier si un rapport PDF est disponible
      const hasReport = await SimpleFileService.hasReportForProject(project.id);

      if (hasReport) {
        console.log('📄 Rapport trouvé pour le projet, ouverture directe...');
        SimpleFileService.openProjectReport(project.id);
      } else {
        // Sinon ouvrir le détail normal
        onViewProject(project);
      }
    }
  };

  const handleCloseCertificationModal = () => {
    setIsCertificationModalOpen(false);
    setSelectedCertification(null);
  };

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case "Expert":
        return "bg-green-100 text-green-800 border-green-200";
      case "Avancé":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Intermédiaire":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Débutant":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <>
      <section id="projets" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl mb-4">
              Mes{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Réalisations
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Découvrez mes projets récents, certifications
              professionnelles et outils maîtrisés
            </p>

            {/* Filter buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button
                variant={
                  filter === "all" ? "default" : "outline"
                }
                onClick={() => setFilter("all")}
                className={
                  filter === "all"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600"
                    : ""
                }
              >
                Tous
              </Button>
              <Button
                variant={
                  filter === "projects" ? "default" : "outline"
                }
                onClick={() => setFilter("projects")}
                className={
                  filter === "projects"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600"
                    : ""
                }
              >
                Projets
              </Button>
              <Button
                variant={
                  filter === "certifications"
                    ? "default"
                    : "outline"
                }
                onClick={() => setFilter("certifications")}
                className={
                  filter === "certifications"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600"
                    : ""
                }
              >
                Certifications
              </Button>
              <Button
                variant={
                  filter === "tools" ? "default" : "outline"
                }
                onClick={() => setFilter("tools")}
                className={
                  filter === "tools"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600"
                    : ""
                }
              >
                <Wrench className="h-4 w-4 mr-2" />
                Outils
              </Button>
            </div>
          </div>

          {/* Contenu conditionnel selon le filtre */}
          {filter === "tools" ? (
            /* Grille des outils */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {toolsData.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <Card
                    key={tool.id}
                    className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105"
                    onMouseEnter={() => setHoveredCard(tool.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className={`p-3 rounded-lg ${
                            tool.color === "blue"
                              ? "bg-blue-100"
                              : tool.color === "green"
                                ? "bg-green-100"
                                : tool.color === "purple"
                                  ? "bg-purple-100"
                                  : tool.color === "orange"
                                    ? "bg-orange-100"
                                    : tool.color === "red"
                                      ? "bg-red-100"
                                      : tool.color === "yellow"
                                        ? "bg-yellow-100"
                                        : tool.color === "cyan"
                                          ? "bg-cyan-100"
                                          : "bg-gray-100"
                          }`}
                        >
                          <IconComponent
                            className={`h-6 w-6 ${
                              tool.color === "blue"
                                ? "text-blue-600"
                                : tool.color === "green"
                                  ? "text-green-600"
                                  : tool.color === "purple"
                                    ? "text-purple-600"
                                    : tool.color === "orange"
                                      ? "text-orange-600"
                                      : tool.color === "red"
                                        ? "text-red-600"
                                        : tool.color ===
                                            "yellow"
                                          ? "text-yellow-600"
                                          : tool.color ===
                                              "cyan"
                                            ? "text-cyan-600"
                                            : "text-gray-600"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg mb-1 group-hover:text-blue-600 transition-colors">
                            {tool.name}
                          </h3>
                          <Badge
                            className={`${getProficiencyColor(tool.proficiency)} text-xs`}
                          >
                            {tool.proficiency}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {tool.description}
                      </p>

                      <div className="pt-3 border-t border-gray-100">
                        <Badge
                          variant="outline"
                          className="text-xs bg-gray-50"
                        >
                          {tool.category}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            /* Grille des projets et certifications */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                    project.featured
                      ? "ring-2 ring-blue-200"
                      : ""
                  }`}
                  onMouseEnter={() =>
                    setHoveredCard(project.id)
                  }
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <ImageWithFallback
                        src={project.image}
                        alt={project.title}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge
                          variant="secondary"
                          className={`${
                            project.category === "certification"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {project.category === "certification"
                            ? "Certification"
                            : "Projet"}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <div className="flex items-center text-white bg-black/50 px-2 py-1 rounded">
                          <Calendar className="h-3 w-3 mr-1" />
                          {project.year}
                        </div>
                      </div>
                      {project.featured && (
                        <div className="absolute bottom-4 left-4">
                          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                            ⭐ Mis en avant
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <h3 className="text-xl mb-2 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies
                        .slice(0, 3)
                        .map((tech) => (
                          <Badge
                            key={tech}
                            variant="outline"
                            className="text-xs"
                          >
                            {tech}
                          </Badge>
                        ))}
                      {project.technologies.length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-xs"
                        >
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {project.links?.demo && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="p-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (project.links?.demo !== "#") {
                                window.open(project.links.demo, '_blank');
                              } else {
                                SimpleFileService.handleDemoClick(project.id);
                              }
                            }}
                            title="Voir la démo"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                        {project.links?.github && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="p-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (project.links?.github !== "#") {
                                window.open(project.links.github, '_blank');
                              }
                            }}
                            title="Voir le code source"
                          >
                            <Github className="h-4 w-4" />
                          </Button>
                        )}
                        {project.links?.certificate && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="p-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (project.links?.certificate !== "#") {
                                window.open(project.links.certificate, '_blank');
                              } else {
                                SimpleFileService.handleDemoClick(project.id);
                              }
                            }}
                            title="Voir le certificat"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <Button
                        size="sm"
                        onClick={() =>
                          handleViewDetail(project)
                        }
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-medium"
                      >
                        {project.category === "certification"
                          ? "Voir certificat"
                          : "Consulter projet"}
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal pour les certifications */}
      <CertificationModal
        certification={selectedCertification}
        isOpen={isCertificationModalOpen}
        onClose={handleCloseCertificationModal}
      />
    </>
  );
}
