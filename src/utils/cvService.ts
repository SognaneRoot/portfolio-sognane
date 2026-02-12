// Service pour gérer les CV importés
export interface CVFile {
  id: string;
  name: string;
  url: string;
  uploadDate: string;
  size: number;
}

// Interface pour les systèmes de stockage
interface StorageInterface {
  getCVFiles(): Promise<CVFile[]>;
}

// Implémentation pour localStorage
class LocalStorageService implements StorageInterface {
  async getCVFiles(): Promise<CVFile[]> {
    try {
      const files = JSON.parse(localStorage.getItem('admin_files') || '[]');
      return files
        .filter((file: any) => 
          file.type === 'document' && 
          (file.name.toLowerCase().includes('cv') || 
           file.name.toLowerCase().includes('resume') ||
           file.name.toLowerCase().endsWith('.pdf'))
        )
        .map((file: any) => ({
          id: file.id,
          name: file.name,
          url: file.url,
          uploadDate: file.uploadDate,
          size: file.size
        }));
    } catch (error) {
      console.error('Erreur récupération CV localStorage:', error);
      return [];
    }
  }
}

// Implémentation pour Supabase
class SupabaseStorageService implements StorageInterface {
  async getCVFiles(): Promise<CVFile[]> {
    try {
      // Import dynamique pour éviter les erreurs si Supabase n'est pas configuré
      const { FileService } = await import('../lib/supabase');
      
      const result = await FileService.getFilesByType('document');
      if (!result.success || !result.data) return [];

      return result.data
        .filter((file: any) => 
          file.name.toLowerCase().includes('cv') || 
          file.name.toLowerCase().includes('resume') ||
          file.name.toLowerCase().endsWith('.pdf')
        )
        .map((file: any) => ({
          id: file.id,
          name: file.name,
          url: file.public_url,
          uploadDate: file.created_at,
          size: file.size
        }));
    } catch (error) {
      console.error('Erreur récupération CV Supabase:', error);
      return [];
    }
  }
}

// Service principal
export class CVService {
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
      
      const supabaseUrl = getEnvVar('REACT_APP_SUPABASE_URL', 'YOUR_SUPABASE_URL');
      const hasSupabase = supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseUrl.length > 0;
      
      this.storageService = hasSupabase 
        ? new SupabaseStorageService() 
        : new LocalStorageService();
    }
    
    return this.storageService;
  }

  // Récupérer tous les CV importés
  static async getImportedCVs(): Promise<CVFile[]> {
    return await this.getStorageService().getCVFiles();
  }

  // Récupérer le CV principal (le plus récent)
  static async getMainCV(): Promise<CVFile | null> {
    try {
      const cvFiles = await this.getImportedCVs();
      if (cvFiles.length === 0) return null;

      // Retourner le plus récent
      return cvFiles.sort((a, b) => 
        new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      )[0];
    } catch (error) {
      console.error('Erreur récupération CV principal:', error);
      return null;
    }
  }

  // Télécharger un CV spécifique
  static async downloadCV(cvFile: CVFile): Promise<void> {
    try {
      // Pour les URLs blob (localStorage)
      if (cvFile.url.startsWith('blob:')) {
        const link = document.createElement('a');
        link.href = cvFile.url;
        link.download = cvFile.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      // Pour les URLs distantes (Supabase)
      const response = await fetch(cvFile.url);
      if (!response.ok) throw new Error('Erreur téléchargement CV');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = cvFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur téléchargement CV:', error);
      throw new Error('Impossible de télécharger le CV');
    }
  }

  // Télécharger le CV principal
  static async downloadMainCV(): Promise<boolean> {
    try {
      const mainCV = await this.getMainCV();
      if (!mainCV) {
        console.warn('Aucun CV importé trouvé');
        return false;
      }

      await this.downloadCV(mainCV);
      return true;
    } catch (error) {
      console.error('Erreur téléchargement CV principal:', error);
      return false;
    }
  }

  // Vérifier si un CV est disponible
  static async hasImportedCV(): Promise<boolean> {
    try {
      const cvFiles = await this.getImportedCVs();
      return cvFiles.length > 0;
    } catch (error) {
      console.error('Erreur vérification CV:', error);
      return false;
    }
  }

  // Obtenir les informations du CV principal
  static async getMainCVInfo(): Promise<{
    available: boolean;
    fileName?: string;
    uploadDate?: string;
    size?: number;
  }> {
    try {
      const mainCV = await this.getMainCV();
      if (!mainCV) {
        return { available: false };
      }

      return {
        available: true,
        fileName: mainCV.name,
        uploadDate: mainCV.uploadDate,
        size: mainCV.size
      };
    } catch (error) {
      console.error('Erreur info CV:', error);
      return { available: false };
    }
  }
}