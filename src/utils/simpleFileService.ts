// Service simple et fiable pour récupérer les URLs des fichiers uploadés
export class SimpleFileService {
  
  // Récupérer l'URL d'un fichier uploadé par son nom
  static getFileUrl(fileName: string): string | null {
    try {
      const files = JSON.parse(localStorage.getItem('admin_files') || '[]');
      const file = files.find((f: any) => 
        f.name.toLowerCase().includes(fileName.toLowerCase()) ||
        fileName.toLowerCase().includes(f.name.toLowerCase().replace(/\.[^/.]+$/, ""))
      );
      
      return file ? file.url : null;
    } catch (error) {
      console.error('Erreur récupération fichier:', error);
      return null;
    }
  }

  // Récupérer l'URL d'un PDF lié à un projet spécifique
  static getPdfForProject(projectId: string): { url: string; name: string } | null {
    try {
      console.log('🔍 Recherche PDF pour projet:', projectId);
      
      // Essayer d'abord avec les fichiers Supabase
      const supabaseMetadata = JSON.parse(localStorage.getItem('supabase_file_metadata') || '[]');
      if (supabaseMetadata.length > 0) {
        console.log('📁 Fichiers Supabase disponibles:', supabaseMetadata.length);
        
        // Chercher par projectId exact
        let pdfFile = supabaseMetadata.find((f: any) => {
          const match = f.type === 'document' && 
                       f.name.toLowerCase().endsWith('.pdf') &&
                       f.projectId === projectId;
          if (match) {
            console.log('  ✓ Correspondance exacte projectId:', f.name, 'projectId:', f.projectId);
          }
          return match;
        });
        
        // Sinon chercher par nom de fichier
        if (!pdfFile) {
          pdfFile = supabaseMetadata.find((f: any) => {
            const match = f.type === 'document' && 
                         f.name.toLowerCase().endsWith('.pdf') &&
                         f.name.toLowerCase().includes(projectId.toLowerCase());
            if (match) {
              console.log('  ✓ Correspondance par nom:', f.name);
            }
            return match;
          });
        }
        
        if (pdfFile) {
          console.log('✅ PDF Supabase trouvé:', pdfFile.name, '(projectId:', pdfFile.projectId || 'non défini', ')');
          return { url: pdfFile.public_url, name: pdfFile.name };
        }
      }

      // Sinon essayer avec les fichiers LocalStorage
      const files = JSON.parse(localStorage.getItem('admin_files') || '[]');
      console.log('📁 Fichiers LocalStorage disponibles:', files.length);
      
      // Lister tous les PDFs disponibles avec leurs projectIds
      const allPdfs = files.filter((f: any) => f.type === 'document' && f.name.toLowerCase().endsWith('.pdf'));
      console.log('📄 PDFs disponibles:', allPdfs.map((f: any) => `${f.name} (projectId: ${f.projectId || 'non défini'})`));
      
      // Chercher par projectId exact
      let pdfFile = files.find((f: any) => {
        const match = f.type === 'document' && 
                     f.name.toLowerCase().endsWith('.pdf') &&
                     f.projectId === projectId;
        if (match) {
          console.log('  ✓ Correspondance exacte projectId:', f.name, 'projectId:', f.projectId);
        }
        return match;
      });
      
      // Sinon chercher par nom de fichier
      if (!pdfFile) {
        pdfFile = files.find((f: any) => {
          const match = f.type === 'document' && 
                       f.name.toLowerCase().endsWith('.pdf') &&
                       f.name.toLowerCase().includes(projectId.toLowerCase());
          if (match) {
            console.log('  ✓ Correspondance par nom:', f.name);
          }
          return match;
        });
      }
      
      if (pdfFile) {
        console.log('✅ PDF LocalStorage trouvé:', pdfFile.name, '(projectId:', pdfFile.projectId || 'non défini', ')');
        return { url: pdfFile.url, name: pdfFile.name };
      }
      
      console.log('⚠️ Aucun PDF lié au projet', projectId);
      return null;
    } catch (error) {
      console.error('Erreur récupération PDF pour projet:', error);
      return null;
    }
  }

  // Récupérer l'URL du premier fichier PDF uploadé (pour démo simple)
  static getFirstPdfUrl(): string | null {
    try {
      // Essayer d'abord avec Supabase
      const supabaseMetadata = JSON.parse(localStorage.getItem('supabase_file_metadata') || '[]');
      const supabasePdfs = supabaseMetadata.filter((f: any) => 
        f.type === 'document' && f.name.toLowerCase().endsWith('.pdf')
      );
      
      if (supabasePdfs.length > 0) {
        const selectedPdf = supabasePdfs[0];
        console.log('✅ PDF Supabase sélectionné:', selectedPdf.name);
        return selectedPdf.public_url;
      }

      // Sinon essayer LocalStorage
      const files = JSON.parse(localStorage.getItem('admin_files') || '[]');
      const pdfFiles = files.filter((f: any) => 
        f.type === 'document' && f.name.toLowerCase().endsWith('.pdf')
      );
      
      console.log('🔍 Recherche PDF dans les fichiers:', files.length, 'total');
      console.log('📄 PDFs trouvés:', pdfFiles.length);
      
      if (pdfFiles.length > 0) {
        const selectedPdf = pdfFiles[0]; // Prendre le premier
        console.log('✅ PDF LocalStorage sélectionné:', selectedPdf.name);
        return selectedPdf.url;
      }
      
      console.log('❌ Aucun PDF trouvé');
      return null;
    } catch (error) {
      console.error('Erreur récupération PDF:', error);
      return null;
    }
  }

  // Récupérer le nom du fichier PDF
  static getFirstPdfName(): string | null {
    try {
      // Essayer d'abord avec Supabase
      const supabaseMetadata = JSON.parse(localStorage.getItem('supabase_file_metadata') || '[]');
      const supabasePdfs = supabaseMetadata.filter((f: any) => 
        f.type === 'document' && f.name.toLowerCase().endsWith('.pdf')
      );
      
      if (supabasePdfs.length > 0) {
        return supabasePdfs[0].name;
      }

      // Sinon LocalStorage
      const files = JSON.parse(localStorage.getItem('admin_files') || '[]');
      const pdfFiles = files.filter((f: any) => 
        f.type === 'document' && f.name.toLowerCase().endsWith('.pdf')
      );
      
      return pdfFiles.length > 0 ? pdfFiles[0].name : null;
    } catch (error) {
      console.error('Erreur récupération nom PDF:', error);
      return null;
    }
  }

  // Ouvrir un rapport de projet avec le viewer sécurisé
  static async openProjectReport(projectId: string): Promise<boolean> {
    console.log('🚀 openProjectReport appelé pour:', projectId);
    
    // Chercher d'abord un PDF lié au projet spécifique
    const projectPdf = this.getPdfForProject(projectId);
    
    let url: string | null = null;
    let fileName: string | null = null;
    
    if (projectPdf) {
      // PDF trouvé pour ce projet spécifique
      url = projectPdf.url;
      fileName = projectPdf.name;
      console.log('📄 PDF lié au projet trouvé:', fileName);
    } else {
      // Fallback: utiliser le premier PDF disponible
      url = this.getFirstPdfUrl();
      fileName = this.getFirstPdfName();
      console.log('📄 Utilisation du premier PDF disponible:', fileName);
    }
    
    console.log('📄 URL PDF:', url);
    console.log('📝 Nom fichier:', fileName);
    
    if (url && fileName) {
      // Déclencher un événement personnalisé pour le viewer PDF
      const event = new CustomEvent('openPDFViewer', {
        detail: { url, fileName }
      });
      console.log('📡 Déclenchement événement openPDFViewer:', event.detail);
      window.dispatchEvent(event);
      return true;
    } else {
      console.log('❌ Aucun PDF trouvé');
      this.showNoPdfAlert();
      return false;
    }
  }

  // Vérifier si un rapport est disponible pour un projet
  static async hasReportForProject(projectId: string): Promise<boolean> {
    // Vérifier d'abord si un PDF est lié à ce projet
    const projectPdf = this.getPdfForProject(projectId);
    if (projectPdf) return true;
    
    // Sinon vérifier s'il y a des PDFs disponibles en général
    const url = this.getFirstPdfUrl();
    return url !== null;
  }

  // Déclencher l'événement pour ouvrir le viewer PDF (utilisé par les boutons démo)
  static handleDemoClick(projectId: string): void {
    console.log('🎯 handleDemoClick appelé pour:', projectId);
    this.openProjectReport(projectId);
  }

  // Afficher une alerte informative quand aucun PDF n'est trouvé
  static showNoPdfAlert(): void {
    alert(`📄 Aucun document PDF trouvé
    
Pour ajouter des rapports :
1. Cliquez sur l'icône ⚙️ en haut à droite
2. Connectez-vous à l'admin
3. Uploadez vos documents PDF dans "Fichiers"

Les documents apparaîtront ensuite dans les boutons "Voir le rapport".`);
  }

  // Obtenir la liste de tous les PDFs disponibles
  static getAllPdfs(): Array<{name: string, url: string, uploadDate: string}> {
    try {
      const files = JSON.parse(localStorage.getItem('admin_files') || '[]');
      return files
        .filter((f: any) => f.type === 'document' && f.name.toLowerCase().endsWith('.pdf'))
        .map((f: any) => ({
          name: f.name,
          url: f.url,
          uploadDate: f.uploadDate
        }));
    } catch (error) {
      console.error('Erreur récupération PDFs:', error);
      return [];
    }
  }

  // Déboguer les rapports disponibles
  static debugReports(): void {
    try {
      const files = JSON.parse(localStorage.getItem('admin_files') || '[]');
      const pdfs = this.getAllPdfs();
      
      console.log('=== DEBUG RAPPORTS SIMPLE ===');
      console.log('📁 Fichiers totaux:', files.length);
      console.log('📄 PDFs trouvés:', pdfs.length);
      
      const blobFiles: string[] = [];
      const dataFiles: string[] = [];
      
      pdfs.forEach((pdf, index) => {
        const type = pdf.url.startsWith('blob:') ? '⚠️ BLOB (ancien)' : 
                     pdf.url.startsWith('data:') ? '✅ DATA (nouveau)' : '🌐 URL';
        
        console.log(`${index + 1}. ${pdf.name}`);
        console.log(`   📅 Date: ${pdf.uploadDate}`);
        console.log(`   ${type}`);
        console.log(`   🔗 URL: ${pdf.url.substring(0, 50)}...`);
        
        if (pdf.url.startsWith('blob:')) {
          blobFiles.push(pdf.name);
        } else if (pdf.url.startsWith('data:')) {
          dataFiles.push(pdf.name);
        }
      });
      
      if (blobFiles.length > 0) {
        console.log('\n⚠️ ATTENTION: ' + blobFiles.length + ' fichier(s) en ancien format (blob):');
        blobFiles.forEach(name => console.log('   - ' + name));
        console.log('💡 Re-uploadez ces fichiers via l\'admin pour les convertir au nouveau format.');
      }
      
      if (pdfs.length === 0) {
        console.log('❌ Aucun PDF trouvé. Uploadez des documents via l\'admin.');
      }
      
      console.log('=============================');
    } catch (error) {
      console.error('Erreur debug rapports:', error);
    }
  }

  // Vérifier si des fichiers doivent être migrés
  static needsMigration(): boolean {
    try {
      const files = JSON.parse(localStorage.getItem('admin_files') || '[]');
      return files.some((f: any) => f.url && f.url.startsWith('blob:'));
    } catch {
      return false;
    }
  }

  // Obtenir la liste des fichiers à migrer
  static getFilesToMigrate(): string[] {
    try {
      const files = JSON.parse(localStorage.getItem('admin_files') || '[]');
      return files
        .filter((f: any) => f.url && f.url.startsWith('blob:'))
        .map((f: any) => f.name);
    } catch {
      return [];
    }
  }
}