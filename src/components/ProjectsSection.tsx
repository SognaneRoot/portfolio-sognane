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
    title: "Infrastructure Proxmox & Backup",
    description:
      "Mise en place d'une infrastructure de virtualisation Proxmox avec système de sauvegarde automatisé Proxmox Backup.",
    year: "2025",
    category: "project",
    image:
      "https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBkZXNpZ258ZW58MXx8fHwxNzU3NzU1NjgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    technologies: [
      "Proxmox VE",
      "Proxmox Backup",
      "Virtualisation",
      "Hyperviseur",
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

  // Certifications
  {
    id: "cert1",
    title: "Python Essential 1 & 2",
    description:
      "Certification Skills for All en programmation Python et développement d'applications.",
    year: "2023",
    category: "certification",
    image:
      "https://images.unsplash.com/photo-1667984390538-3dea7a3fe33d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZ3xlbnwxfHx8fDE3NTc3NjYxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    technologies: ["Python", "Programmation", "Développement"],
    links: {
      certificate: "#",
    },
    featured: true,
  },
  {
    id: "cert2",
    title: "CCNA 1 & 2",
    description:
      "Certification Cisco Netacad en réseaux informatiques et configuration d'équipements.",
    year: "2023-2024",
    category: "certification",
    image:
      "https://images.unsplash.com/photo-1667984390538-3dea7a3fe33d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZ3xlbnwxfHx8fDE3NTc3NjYxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
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
      "https://images.unsplash.com/photo-1667984390538-3dea7a3fe33d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZ3xlbnwxfHx8fDE3NTc3NjYxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
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
      "https://images.unsplash.com/photo-1667984390538-3dea7a3fe33d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZ3xlbnwxfHx8fDE3NTc3NjYxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
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
      "https://images.unsplash.com/photo-1667984390538-3dea7a3fe33d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZ3xlbnwxfHx8fDE3NTc3NjYxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    technologies: ["Hardware", "Software", "Troubleshooting"],
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
      "Administration complète Windows Server 2012/2016/2019/2022",
    proficiency: "Avancé",
    color: "blue",
  },
  {
    id: "tool2",
    name: "Linux",
    category: "Systèmes d'exploitation",
    icon: Code,
    description:
      "Administration système Linux, scripts Bash, service, Pentesting",
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
      "Configuration routeurs/switchs, VLAN, OSPF, ACL",
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
    name: "Nmap/Nessus",
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
    name: "Ntopng/Cacti",
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

  const handleViewDetail = (project: Project) => {
    if (project.category === "certification") {
      setSelectedCertification(project);
      setIsCertificationModalOpen(true);
    } else {
      onViewProject(project);
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
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {project.category === "certification"
                          ? "Voir certificat"
                          : "Voir détail"}
                        <ArrowRight className="ml-1 h-3 w-3" />
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