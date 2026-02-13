// Fonction pour générer et télécharger le CV en PDF
export const generateAndDownloadCV = () => {
  // Données du CV
  const cvData = {
      personalInfo: {
      name: "Ndiaga Sognane",
      title: "Administrateur Système, Réseau & Cloud",
      email: "sognanendiaga221@gmail.com",
      phone: "+221 70 605 68 39",
      location: "Rufisque, Sénégal",
      website: "https://monportfolio.ct.ws",
      linkedin: "https://linkedin.com/in/ndiaga-sognane",
      github: "https://github.com/SognaneRoot"
    },

    profile: `Administrateur Systèmes, Réseaux et Cloud, titulaire d’une licence en réseaux informatiques,
    avec de solides compétences en administration des serveurs, sécurité et infrastructures IT.
    Motivé par l’innovation et la cybersécurité, je souhaite contribuer à des projets de transformation numérique.`,

    skills: {
      "Systèmes": ["Windows Server", "Linux"],
      "Réseaux": ["TCP/IP", "Subnetting", "VLAN", "Routage", "FHRP", "DHCP", "DNS", "NAT"],
      "Sécurité": ["Pare-feu (PfSense, DMZ)", "VPN", "ACL"],
      "Supervision": ["Ntopng", "Zabbix", "Prometheus", "Grafana"],
      "Virtualisation": ["VMware ESXi", "Proxmox", "Hyper-V"],
      "Cloud": ["AWS", "Azure", "OpenStack", "Nextcloud"],
      "Bases de données": ["MySQL", "Oracle", "XAMPP", "LAMP"],
      "Développement": ["Python", "Java", "PHP", "HTML/CSS"],
      "Serveurs Web": ["Apache2", "Nginx", "IIS"],
      "Administration IT": ["GLPI", "Snipe-IT"],
      "Gestion de projet": ["Agile", "Trello", "ClickUp"],
      "IoT": ["Systèmes connectés"]
    },

    education: [
      {
        degree: "Licence Systèmes et Réseaux Informatiques",
        school: "ISI Keur Massar",
        period: "2024 – 2025",
        location: "Sénégal"
      },
      {
        degree: "BTS Administration Système, Sécurité et Cloud",
        school: "ISEPAT – Diamniadio",
        period: "2022 – 2024",
        location: "Sénégal"
      }
    ],

    experience: [
      {
        title: "Stagiaire – Administration Système",
        company: "Ministère des Infrastructures Terrestres et du Transport Aérien",
        period: "Déc. 2024 – Jan. 2025",
        location: "Diamniadio, Sénégal",
        responsibilities: [
          "Support technique et maintenance des systèmes informatiques",
          "Gestion des réseaux locaux et assistance utilisateurs",
          "Résolution d’incidents et maintien de la continuité de service"
        ]
      }
    ],

    certifications: [
      "CCNA 1, 2, 3 – Cisco",
      "CyberOps – Cisco",
      "NDG Linux Essentials – Cisco",
      "Linux Server – Cisco",
      "Python Essentials 1 & 2 – Cisco",
      "IT Essentials – Cisco",
      "AWS Cloud Practitioner",
      "Introduction to Cybersecurity – Cisco"
    ],

    projects: [
      "Migration Active Directory (Windows Server 2012 → 2022)",
      "Déploiement Cloud : AWS, OpenStack, Nextcloud",
      "Virtualisation : VMware ESXi, Proxmox, Hyper-V",
      "Implémentation FHRP pour redondance réseau",
      "VPN site-à-site",
      "Supervision réseau : Zabbix, Ntopng, Prometheus, Grafana",
      "Déploiement GLPI pour gestion de parc IT",
      "Services Windows/Linux : ADDS, DNS, DHCP, IIS, GPO, NFS, SMB",
      "Téléphonie IP : Asterisk & Issabel",
      "Système sécurité IoT (Arduino)",
      "Site vitrine vitrine-cultur.netlify.app",
      "Portfolio WordPress & PHP"
    ],

    languages: [
      "Français — Courant",
      "Wolof — Langue maternelle",
      "Anglais — Notions"
    ],

    interests: [
      "Open-source",
      "Innovation IT",
      "Sport",
      "Lecture"
    ]
  };


  // Créer le contenu HTML du CV
  const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV - ${cvData.personalInfo.name}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
        }
        
        .header h1 {
            font-size: 2.5em;
            color: #1e40af;
            margin-bottom: 10px;
        }
        
        .header h2 {
            font-size: 1.3em;
            color: #7c3aed;
            margin-bottom: 20px;
        }
        
        .contact-info {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
            font-size: 0.9em;
        }
        
        .section {
            margin-bottom: 30px;
        }
        
        .section h3 {
            color: #1e40af;
            font-size: 1.4em;
            margin-bottom: 15px;
            border-left: 4px solid #7c3aed;
            padding-left: 15px;
        }
        
        .profile {
            font-style: italic;
            color: #555;
            text-align: justify;
            margin-bottom: 20px;
        }
        
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }
        
        .skill-category h4 {
            color: #7c3aed;
            margin-bottom: 8px;
            font-size: 1.1em;
        }
        
        .skill-list {
            list-style: none;
            font-size: 0.9em;
        }
        
        .skill-list li {
            margin-bottom: 4px;
            padding-left: 15px;
            position: relative;
        }
        
        .skill-list li:before {
            content: "•";
            color: #2563eb;
            position: absolute;
            left: 0;
        }
        
        .experience-item, .education-item {
            margin-bottom: 20px;
            padding: 15px;
            border-left: 3px solid #e5e7eb;
            background: #f9fafb;
        }
        
        .experience-item h4, .education-item h4 {
            color: #1e40af;
            margin-bottom: 5px;
        }
        
        .company, .school {
            font-weight: bold;
            color: #7c3aed;
        }
        
        .period, .location {
            font-size: 0.9em;
            color: #666;
        }
        
        .responsibilities {
            margin-top: 10px;
            list-style: none;
        }
        
        .responsibilities li {
            margin-bottom: 5px;
            padding-left: 15px;
            position: relative;
            font-size: 0.9em;
        }
        
        .responsibilities li:before {
            content: "→";
            color: #2563eb;
            position: absolute;
            left: 0;
        }
        
        .certifications-list, .projects-list {
            columns: 2;
            column-gap: 30px;
            list-style: none;
        }
        
        .certifications-list li, .projects-list li {
            margin-bottom: 8px;
            padding-left: 15px;
            position: relative;
            font-size: 0.9em;
            break-inside: avoid;
        }
        
        .certifications-list li:before {
            content: "🏆";
            position: absolute;
            left: 0;
        }
        
        .projects-list li:before {
            content: "🚀";
            position: absolute;
            left: 0;
        }
        
        @media print {
            body { font-size: 12px; }
            .container { padding: 20px; }
            .header h1 { font-size: 2em; }
            .section { margin-bottom: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${cvData.personalInfo.name}</h1>
            <h2>${cvData.personalInfo.title}</h2>
            <div class="contact-info">
                <span>📧 ${cvData.personalInfo.email}</span>
                <span>📱 ${cvData.personalInfo.phone}</span>
                <span>📍 ${cvData.personalInfo.location}</span>
                <span>🌐 ${cvData.personalInfo.website}</span>
            </div>
        </div>

        <div class="section">
            <h3>Profil Professionnel</h3>
            <p class="profile">${cvData.profile}</p>
        </div>

        <div class="section">
            <h3>Compétences Techniques</h3>
            <div class="skills-grid">
                ${Object.entries(cvData.skills).map(([category, skills]) => `
                    <div class="skill-category">
                        <h4>${category}</h4>
                        <ul class="skill-list">
                            ${skills.map(skill => `<li>${skill}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="section">
            <h3>Formation</h3>
            ${cvData.education.map(edu => `
                <div class="education-item">
                    <h4>${edu.degree}</h4>
                    <div class="school">${edu.school}</div>
                    <div class="period">${edu.period} • ${edu.location}</div>
                </div>
            `).join('')}
        </div>

        <div class="section">
            <h3>Expérience Professionnelle</h3>
            ${cvData.experience.map(exp => `
                <div class="experience-item">
                    <h4>${exp.title}</h4>
                    <div class="company">${exp.company}</div>
                    <div class="period">${exp.period} • ${exp.location}</div>
                    <ul class="responsibilities">
                        ${exp.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>

        <div class="section">
            <h3>Certifications</h3>
            <ul class="certifications-list">
                ${cvData.certifications.map(cert => `<li>${cert}</li>`).join('')}
            </ul>
        </div>

        <div class="section">
            <h3>Projets Techniques</h3>
            <ul class="projects-list">
                ${cvData.projects.map(project => `<li>${project}</li>`).join('')}
            </ul>
        </div>
    </div>
</body>
</html>
`;

  // Créer et télécharger le fichier HTML (qui peut être converti en PDF)
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `CV-${cvData.personalInfo.name.replace(/\s+/g, '_')}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // Afficher des instructions pour la conversion en PDF
  alert('CV téléchargé ! Pour convertir en PDF :\n1. Ouvrez le fichier HTML dans votre navigateur\n2. Utilisez Ctrl+P (Cmd+P sur Mac)\n3. Sélectionnez "Enregistrer au format PDF"');
};