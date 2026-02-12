import { useState, useEffect } from 'react';
import { AdminAuthService, FileService } from '../lib/supabase';

interface AdminState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface FileItem {
  id: string;
  name: string;
  type: 'image' | 'document' | 'other';
  size: number;
  public_url: string;
  created_at: string;
  file_path: string;
  description?: string;
  tags?: string[];
  category?: string;
  projectId?: string;
}

export const useSupabaseAdmin = () => {
  const [adminState, setAdminState] = useState<AdminState>({
    isAuthenticated: false,
    isLoading: true,
  });
  
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    setAdminState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const isAuth = await AdminAuthService.verifySession();
      setAdminState({
        isAuthenticated: isAuth,
        isLoading: false,
      });

      if (isAuth) {
        await loadFiles();
      }
    } catch (error) {
      console.error('Erreur vérification auth:', error);
      setAdminState({
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const loadFiles = async () => {
    try {
      const result = await FileService.getFiles();
      if (result.success && result.data) {
        // Charger les métadonnées stockées localement
        const savedMetadata = localStorage.getItem('supabase_file_metadata');
        const metadata = savedMetadata ? JSON.parse(savedMetadata) : [];
        
        // Fusionner les données Supabase avec les métadonnées locales
        const enrichedFiles = result.data.map(file => {
          const meta = metadata.find((m: any) => m.id === file.id);
          return meta ? { ...file, ...meta } : file;
        });
        
        setFiles(enrichedFiles);
      }
    } catch (error) {
      console.error('Erreur chargement fichiers:', error);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setAdminState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const result = await AdminAuthService.signIn(email, password);
      
      if (result.success) {
        setAdminState({
          isAuthenticated: true,
          isLoading: false,
        });
        await loadFiles();
        return { success: true };
      } else {
        setAdminState({
          isAuthenticated: false,
          isLoading: false,
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      setAdminState({
        isAuthenticated: false,
        isLoading: false,
      });
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur de connexion' 
      };
    }
  };

  const logout = async () => {
    try {
      await AdminAuthService.signOut();
      setAdminState({
        isAuthenticated: false,
        isLoading: false,
      });
      setFiles([]);
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  const uploadFile = async (file: File): Promise<{ success: boolean; error?: string }> => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simuler le progrès d'upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 20;
        });
      }, 200);

      const result = await FileService.uploadFile(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        await loadFiles(); // Recharger la liste
        setTimeout(() => {
          setUploadProgress(0);
          setIsUploading(false);
        }, 500);
        return { success: true };
      } else {
        setUploadProgress(0);
        setIsUploading(false);
        return { success: false, error: result.error };
      }
    } catch (error) {
      setUploadProgress(0);
      setIsUploading(false);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur d\'upload' 
      };
    }
  };

  const updateFile = async (fileId: string, updates: Partial<FileItem>): Promise<{ success: boolean; error?: string }> => {
    try {
      // Pour l'instant, on stocke les métadonnées localement
      // En production, il faudrait une table metadata dans Supabase
      const updatedFiles = files.map(file => 
        file.id === fileId ? { ...file, ...updates } : file
      );
      setFiles(updatedFiles);
      
      // Sauvegarder dans localStorage comme backup
      localStorage.setItem('supabase_file_metadata', JSON.stringify(updatedFiles));
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur de mise à jour' 
      };
    }
  };

  const deleteFile = async (fileId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await FileService.deleteFile(fileId);
      
      if (result.success) {
        await loadFiles(); // Recharger la liste
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur de suppression' 
      };
    }
  };

  const searchFiles = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return files.filter(file => 
      file.name.toLowerCase().includes(lowercaseQuery) ||
      file.description?.toLowerCase().includes(lowercaseQuery) ||
      file.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      file.category?.toLowerCase().includes(lowercaseQuery)
    );
  };

  const getFilesByCategory = (category: string) => {
    return files.filter(file => file.category === category);
  };

  const getAllCategories = () => {
    const categories = files
      .map(file => file.category)
      .filter(Boolean)
      .filter((category, index, self) => self.indexOf(category) === index);
    return categories as string[];
  };

  const getAllTags = () => {
    const allTags = files
      .flatMap(file => file.tags || [])
      .filter((tag, index, self) => self.indexOf(tag) === index);
    return allTags;
  };

  const getFilesByType = (type: 'image' | 'document' | 'other') => {
    return files.filter(file => file.type === type);
  };

  const getStats = () => {
    const totalFiles = files.length;
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const imageCount = getFilesByType('image').length;
    const documentCount = getFilesByType('document').length;
    const otherCount = getFilesByType('other').length;

    return {
      totalFiles,
      totalSize,
      imageCount,
      documentCount,
      otherCount,
      totalSizeMB: Math.round(totalSize / (1024 * 1024) * 100) / 100,
    };
  };

  return {
    ...adminState,
    files,
    uploadProgress,
    isUploading,
    login,
    logout,
    uploadFile,
    updateFile,
    deleteFile,
    searchFiles,
    getFilesByCategory,
    getAllCategories,
    getAllTags,
    getFilesByType,
    getStats,
    loadFiles,
    checkAuthentication,
  };
};