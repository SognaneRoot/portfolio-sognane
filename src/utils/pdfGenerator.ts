// Alternative avec jsPDF pour générer un vrai PDF
export const generatePDFCV = async () => {
  try {
    // Importer jsPDF dynamiquement
    const { jsPDF } = await import('jspdf');
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = 30;

    // Configuration des couleurs
    const primaryColor = [37, 99, 235]; // Bleu
    const secondaryColor = [124, 58, 237]; // Violet
    const textColor = [51, 51, 51]; // Gris foncé

    // Helper function pour ajouter du texte
    const addText = (text: string, fontSize: number, color: number[] = textColor, isBold: boolean = false) => {
      doc.setFontSize(fontSize);
      doc.setTextColor(...color);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.text(text, margin, yPosition);
      yPosition += fontSize * 0.5 + 5;
    };

    const addSection = (title: string) => {
      yPosition += 10;
      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.setFont('helvetica', 'bold');
      doc.text(title, margin, yPosition);
      
      // Ligne sous le titre
      doc.setDrawColor(...secondaryColor);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
      
      yPosition += 15;
    };

    const checkPageBreak = (neededSpace: number = 20) => {
      if (yPosition + neededSpace > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPosition = 30;
      }
    };

    // En-tête
    doc.setFontSize(24);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('NDIAGA SOGNANE', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    doc.setFontSize(16);
    doc.setTextColor(...secondaryColor);
    doc.setFont('helvetica', 'normal');
    doc.text('Technicien en Administration Système, Sécurité et Cloud', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Informations de contact
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    const contactInfo = [
      '📧 sognanendiaga221@gmail.com',
      '📱 +221 70 605 68 39',
      '📍 Rufisque, Mbour, Sénégal',
      '🌐 https://monportfolio.ct.ws'
    ];
    
    contactInfo.forEach((info, index) => {
      const xPos = margin + (index % 2) * (pageWidth - 2 * margin) / 2;
      const yPos = yPosition + Math.floor(index / 2) * 12;
      doc.text(info, xPos, yPos);
    });
    yPosition += 35;

    // Profil professionnel
    addSection('PROFIL PROFESSIONNEL');
    const profile = "Technicien passionné par l'administration système, la sécurité informatique et les technologies cloud. Fort d'une expérience pratique et de multiples certifications professionnelles, je maîtrise les infrastructures IT modernes et les meilleures pratiques de sécurité.";
    
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'normal');
    const splitProfile = doc.splitTextToSize(profile, pageWidth - 2 * margin);
    doc.text(splitProfile, margin, yPosition);
    yPosition += splitProfile.length * 5 + 10;

    checkPageBreak();

    // Compétences techniques
    addSection('COMPÉTENCES TECHNIQUES');
    
    const skills = {
      'Systèmes & Réseaux': ['Linux (Ubuntu, Debian, CentOS)', 'Windows Server', 'Cisco (CCNA)', 'Active Directory'],
      'Cloud & Virtualisation': ['VMware', 'OpenStack', 'AWS', 'Azure', 'Proxmox'],
      'Cybersécurité': ['VPN', 'IPSec', 'TLS/SSL', 'Penetration Testing'],
      'Développement': ['Python', 'Java', 'PHP', 'WordPress', 'Git']
    };

    Object.entries(skills).forEach(([category, skillList]) => {
      checkPageBreak(30);
      doc.setFontSize(11);
      doc.setTextColor(...secondaryColor);
      doc.setFont('helvetica', 'bold');
      doc.text(`• ${category}`, margin, yPosition);
      yPosition += 8;
      
      doc.setFontSize(9);
      doc.setTextColor(...textColor);
      doc.setFont('helvetica', 'normal');
      const skillText = skillList.join(', ');
      const splitSkills = doc.splitTextToSize(skillText, pageWidth - 2 * margin - 10);
      doc.text(splitSkills, margin + 10, yPosition);
      yPosition += splitSkills.length * 4 + 8;
    });

    checkPageBreak();

    // Formation
    addSection('FORMATION');
    
    const education = [
      {
        degree: 'L3 Réseau et Système Informatique',
        school: 'ISI Keur Massar',
        period: 'En cours',
        location: 'Keur Massar, Sénégal'
      },
      {
        degree: 'BTS Administration Système Sécurité et Cloud',
        school: 'ISEPAT',
        period: '2022 - 2024',
        location: 'Diamniadio, Sénégal'
      }
    ];

    education.forEach(edu => {
      checkPageBreak(25);
      doc.setFontSize(11);
      doc.setTextColor(...primaryColor);
      doc.setFont('helvetica', 'bold');
      doc.text(edu.degree, margin, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.setTextColor(...secondaryColor);
      doc.setFont('helvetica', 'bold');
      doc.text(edu.school, margin, yPosition);
      yPosition += 6;
      
      doc.setFontSize(9);
      doc.setTextColor(...textColor);
      doc.setFont('helvetica', 'normal');
      doc.text(`${edu.period} • ${edu.location}`, margin, yPosition);
      yPosition += 15;
    });

    checkPageBreak();

    // Certifications principales
    addSection('CERTIFICATIONS PRINCIPALES');
    
    const certifications = [
      'CCNA 1, 2 & 3 - Cisco Netacad (2023-2024)',
      'Python Essential 1 & 2 - Skills for All (2023)',
      'AWS Cloud Practitioner - Amazon Web Services (2025)',
      'CyberOps - Cisco Netacad (2024)',
      'Linux Server & NDG Linux Essential - Cisco Netacad'
    ];

    certifications.forEach(cert => {
      checkPageBreak(10);
      doc.setFontSize(10);
      doc.setTextColor(...textColor);
      doc.setFont('helvetica', 'normal');
      doc.text(`🏆 ${cert}`, margin, yPosition);
      yPosition += 8;
    });

    checkPageBreak();

    // Projets techniques principaux
    addSection('PROJETS TECHNIQUES PRINCIPAUX');
    
    const projects = [
      'Système de Sécurité Domestique IoT',
      'Téléphonie IP - Asterisk & Issabel',
      'Tests de Pénétration - Attaque Brute Force',
      'Cloud Privé OpenStack',
      'Infrastructure Proxmox & Backup',
      'Migration Active Directory'
    ];

    projects.forEach(project => {
      checkPageBreak(10);
      doc.setFontSize(10);
      doc.setTextColor(...textColor);
      doc.setFont('helvetica', 'normal');
      doc.text(`🚀 ${project}`, margin, yPosition);
      yPosition += 8;
    });

    // Footer
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `CV - Ndiaga Sognane | Page ${i}/${totalPages}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    // Télécharger le PDF
    doc.save('CV-Ndiaga-Sognane.pdf');
    
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    
    // Fallback vers la version HTML
    const { generateAndDownloadCV } = await import('./cvGenerator');
    generateAndDownloadCV();
  }
};

// Export par défaut pour compatibilité
export const generatePDF = generatePDFCV;