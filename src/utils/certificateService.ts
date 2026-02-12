// Service pour gérer les images de certificats importées
export interface CertificateImage {
  id: string;
  name: string;
  url: string;
  uploadDate: string;
  size: number;
  certificateId?: string;
}

// Interface pour les systèmes de stockage
interface StorageInterface {
  getCertificateImages(): Promise<CertificateImage[]>;
}

// Implémentation pour localStorage
class LocalStorageService implements StorageInterface {
  async getCertificateImages(): Promise<CertificateImage[]> {
    try {
      const files = JSON.parse(localStorage.getItem('admin_files') || '[]');
      return files
        .filter((file: any) => 
          file.type === 'image' && 
          (file.name.toLowerCase().includes('cert') || 
           file.name.toLowerCase().includes('certificat') ||
           file.name.toLowerCase().includes('diploma') ||
           file.name.toLowerCase().includes('diplome'))
        )
        .map((file: any) => ({
          id: file.id,
          name: file.name,
          url: file.url,
          uploadDate: file.uploadDate,
          size: file.size,
          certificateId: file.certificateId || null
        }));
    } catch (error) {
      console.error('Erreur récupération certificats localStorage:', error);
      return [];
    }
  }
}

// Implémentation pour Supabase
class SupabaseStorageService implements StorageInterface {
  async getCertificateImages(): Promise<CertificateImage[]> {
    try {
      console.log('🔄 Récupération des certificats depuis Supabase...');
      
      // Import dynamique pour éviter les erreurs si Supabase n'est pas configuré
      const { FileService } = await import('../lib/supabase');
      
      const result = await FileService.getFilesByType('image');
      
      if (!result.success) {
        console.error('❌ Erreur Supabase:', result.error);
        return [];
      }
      
      if (!result.data) {
        console.log('⚠️ Aucune donnée retournée par Supabase');
        return [];
      }

      console.log(`📦 ${result.data.length} fichier(s) image trouvé(s) dans Supabase`);
      console.log('📋 Tous les fichiers:', result.data.map((f: any) => ({ 
        name: f.name, 
        type: f.type,
        url: f.public_url 
      })));

      const certificates = result.data
        .filter((file: any) => {
          const name = file.name.toLowerCase();
          const match = name.includes('cert') || 
                 name.includes('certificat') ||
                 name.includes('diploma') ||
                 name.includes('diplome') ||
                 name.includes('ccna') ||
                 name.includes('python') ||
                 name.includes('microsoft') ||
                 name.includes('cisco') ||
                 name.includes('adds') ||
                 name.includes('fsmo') ||
                 name.includes('gpo') ||
                 name.includes('dns') ||
                 name.includes('windows') ||
                 name.includes('linux') ||
                 name.includes('aws') ||
                 name.includes('iot') ||
                 name.includes('cyber');
          
          if (match) {
            console.log(`✅ Fichier certificat trouvé: ${file.name}`);
          }
          
          return match;
        })
        .map((file: any) => {
          const cert = {
            id: file.id,
            name: file.name,
            url: file.public_url,
            uploadDate: file.created_at,
            size: file.size,
            certificateId: file.project_id || file.certificate_id || null
          };
          console.log(`🎓 Certificat mappé:`, cert);
          return cert;
        });

      console.log(`🎓 ${certificates.length} certificat(s) trouvé(s) au total`);

      return certificates;
    } catch (error) {
      console.error('❌ Erreur récupération certificats Supabase:', error);
      return [];
    }
  }
}

// Service principal pour les certificats
export class CertificateService {
  private static storageService: StorageInterface;

  private static getStorageService(): StorageInterface {
    if (!this.storageService) {
      // Détecter si Supabase est configuré
      const getEnvVar = (key: string, defaultValue: string = '') => {
        if (typeof process !== 'undefined' && process.env) {
          return process.env[key] || defaultValue;
        }
        return defaultValue;
      };
      
      const supabaseUrl = getEnvVar('REACT_APP_SUPABASE_URL', 'https://ajubxxipfclkgmlpyzvk.supabase.co');
      const hasSupabase = supabaseUrl !== 'YOUR_SUPABASE_URL' && 
                          supabaseUrl.length > 0 && 
                          supabaseUrl.includes('supabase.co');
      
      console.log('🔍 CertificateService - Supabase détecté:', hasSupabase);
      
      this.storageService = hasSupabase 
        ? new SupabaseStorageService() 
        : new LocalStorageService();
    }
    
    return this.storageService;
  }

  // Récupérer toutes les images de certificats importées
  static async getImportedCertificates(): Promise<CertificateImage[]> {
    return await this.getStorageService().getCertificateImages();
  }

  // Récupérer l'image pour un certificat spécifique
  static async getCertificateImage(certificateId: string | string[]): Promise<CertificateImage | null> {
    try {
      const certificates = await this.getImportedCertificates();
      
      // Si certificateId est un tableau, utiliser tous les alias
      const searchIds = Array.isArray(certificateId) ? certificateId : [certificateId];
      
      console.log(`🔍 Recherche de "${searchIds.join(' ou ')}" parmi ${certificates.length} certificat(s)`);
      
      // Chercher d'abord un certificat avec l'ID exact dans certificateId
      let certificate = certificates.find(c => 
        c.certificateId && searchIds.some(id => 
          c.certificateId?.toLowerCase() === id.toLowerCase()
        )
      );
      
      // Si pas trouvé, chercher par nom de fichier avec tous les alias
      if (!certificate) {
        for (const id of searchIds) {
          const searchTerms = [
            id.toLowerCase(),
            id.replace(/[^a-z0-9]/gi, '').toLowerCase(),
            id.replace(/-/g, '').toLowerCase(),
            id.replace(/-/g, ' ').toLowerCase(),
            id.replace(/_/g, '').toLowerCase(),
            id.replace(/_/g, '-').toLowerCase()
          ];
          
          certificate = certificates.find(c => {
            const fileName = c.name.toLowerCase();
            return searchTerms.some(term => {
              // Recherche exacte du terme dans le nom
              return fileName.includes(term);
            });
          });
          
          if (certificate) {
            console.log(`✅ Certificat trouvé par alias "${id}": ${certificate.name}`);
            break;
          }
        }
      } else {
        console.log(`✅ Certificat trouvé par ID dans metadata: ${certificate.name}`);
      }
      
      if (!certificate) {
        console.log(`❌ Aucun certificat trouvé pour: ${searchIds.join(', ')}`);
        console.log(`📋 Certificats disponibles:`, certificates.map(c => c.name));
      }
      
      return certificate || null;
    } catch (error) {
      console.error('Erreur récupération certificat:', error);
      return null;
    }
  }

  // Récupérer l'URL d'image pour un certificat (avec fallback)
  static async getCertificateImageUrl(certificateId: string | string[], fallbackUrl: string): Promise<string> {
    try {
      const certificate = await this.getCertificateImage(certificateId);
      return certificate ? certificate.url : fallbackUrl;
    } catch (error) {
      console.error('Erreur récupération URL certificat:', error);
      return fallbackUrl;
    }
  }

  // Vérifier si une image est disponible pour un certificat
  static async hasCertificateImage(certificateId: string | string[]): Promise<boolean> {
    try {
      const certificate = await this.getCertificateImage(certificateId);
      return certificate !== null;
    } catch (error) {
      console.error('Erreur vérification certificat:', error);
      return false;
    }
  }

  // Obtenir les informations d'un certificat
  static async getCertificateInfo(certificateId: string | string[]): Promise<{
    available: boolean;
    fileName?: string;
    uploadDate?: string;
    size?: number;
    url?: string;
  }> {
    try {
      const certificate = await this.getCertificateImage(certificateId);
      if (!certificate) {
        return { available: false };
      }

      return {
        available: true,
        fileName: certificate.name,
        uploadDate: certificate.uploadDate,
        size: certificate.size,
        url: certificate.url
      };
    } catch (error) {
      console.error('Erreur info certificat:', error);
      return { available: false };
    }
  }

  // Mapping des certificats avec leurs IDs et alias
  static getCertificateMapping(): Record<string, string[]> {
    return {
      'cert1': ['ccna1', 'ccna-1'],
      'cert2': ['ccna2', 'ccna-2', 'srwe'], 
      'cert2b': ['ccna3', 'ccna-3', 'ensa'],
      'cert3': ['python1', 'python-1', 'python-essential-1'],
      'cert4': ['python2', 'python-2', 'python-essential-2'],
      'cert5': ['aws', 'cloud-practitioner'],
      'cert6': ['linux', 'ndg-linux', 'ndg', 'linux-essential'],
      'cert7': ['linuxserver', 'linux-server'],
      'cert8': ['cyberops', 'cyber-ops'],
      'cert9': ['ite', 'itessential', 'it-essential', 'itessentiel'],
      'cert10': ['iot', 'internet-of-things'],
      'cert11': ['adds', 'adds-microsoft', 'active-directory'],
      'cert12': ['fsmo', 'fsmo-microsoft', 'adds-fsmo'],
      'cert13': ['cybersec', 'intro-cybersecurity', 'cybersecurity', 'introduction-cybersecurity'],
      'cert14': ['gpo', 'gpo-microsoft', 'group-policy'],
      'cert15': ['dns', 'dns-microsoft'],
      'cert16': ['windows', 'windows-os', 'windows-operating-system']
    };
  }

  // Obtenir l'URL d'image pour un certificat par son ID de timeline
  static async getCertificateImageByTimelineId(timelineId: string, fallbackUrl: string): Promise<string> {
    try {
      const mapping = this.getCertificateMapping();
      const certificateIds = mapping[timelineId] || [timelineId];
      
      console.log(`🎓 Recherche certificat: ${timelineId} → [${certificateIds.join(', ')}]`);
      
      const imageUrl = await this.getCertificateImageUrl(certificateIds, fallbackUrl);
      
      if (imageUrl !== fallbackUrl) {
        console.log(`✅ Image trouvée pour ${timelineId}:`, imageUrl);
      } else {
        console.log(`⚠️ Image par défaut utilisée pour ${timelineId}`);
      }
      
      return imageUrl;
    } catch (error) {
      console.error('Erreur récupération certificat par timeline ID:', error);
      return fallbackUrl;
    }
  }
}