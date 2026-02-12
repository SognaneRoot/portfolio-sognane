import { useState, useEffect } from 'react';

interface AdminState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface FileItem {
  id: string;
  name: string;
  type: 'image' | 'document' | 'other';
  size: number;
  uploadDate: string;
  url: string;
  description?: string;
  tags?: string[];
  category?: string;
  projectId?: string; // Lier le fichier à un projet spécifique
}

export const useAdmin = () => {
  const [adminState, setAdminState] = useState<AdminState>({
    isAuthenticated: false,
    isLoading: true,
  });
  
  const [files, setFiles] = useState<FileItem[]>(() => {
    // Initialiser avec les fichiers du localStorage
    const savedFiles = localStorage.getItem('admin_files');
    if (savedFiles) {
      try {
        const parsedFiles = JSON.parse(savedFiles);
        console.log('📂 Initialisation: chargement de', parsedFiles.length, 'fichier(s)');
        return parsedFiles;
      } catch (error) {
        console.error('❌ Erreur parsing fichiers à l\'initialisation:', error);
        return [];
      }
    }
    console.log('📂 Initialisation: aucun fichier sauvegardé');
    return [];
  });

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const isAuth = localStorage.getItem('admin_authenticated') === 'true';
    const authTime = localStorage.getItem('admin_auth_time');
    const now = Date.now();
    
    // Session expire après 2 heures
    if (isAuth && authTime && (now - parseInt(authTime)) < 2 * 60 * 60 * 1000) {
      setAdminState({ isAuthenticated: true, isLoading: false });
    } else {
      // Nettoyer l'authentification expirée
      localStorage.removeItem('admin_authenticated');
      localStorage.removeItem('admin_auth_time');
      setAdminState({ isAuthenticated: false, isLoading: false });
    }
  }, []);

  const loadFiles = () => {
    const savedFiles = localStorage.getItem('admin_files');
    if (savedFiles) {
      try {
        const parsedFiles = JSON.parse(savedFiles);
        console.log('📂 Rechargement des fichiers:', parsedFiles.length, 'fichier(s)');
        setFiles(parsedFiles);
      } catch (error) {
        console.error('❌ Erreur parsing fichiers:', error);
        setFiles([]);
      }
    } else {
      console.log('📂 Rechargement: aucun fichier sauvegardé');
      setFiles([]);
    }
  };

  const login = (password: string): boolean => {
    // Mot de passe simple (à remplacer par une solution sécurisée)
    const adminPassword = 'Sogn@ne2K2'; // À changer !
    
    if (password === adminPassword) {
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_auth_time', Date.now().toString());
      setAdminState({ isAuthenticated: true, isLoading: false });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_auth_time');
    setAdminState({ isAuthenticated: false, isLoading: false });
  };

  const addFile = (file: Omit<FileItem, 'id' | 'uploadDate'>) => {
    const newFile: FileItem = {
      ...file,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      uploadDate: new Date().toISOString(),
    };
    
    setFiles(prevFiles => {
      const updatedFiles = [...prevFiles, newFile];
      
      try {
        localStorage.setItem('admin_files', JSON.stringify(updatedFiles));
        console.log('✅ Fichier ajouté et sauvegardé:', newFile.name);
        return updatedFiles;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          console.error('❌ ERREUR: Espace de stockage local saturé !');
          
          // Compter les fichiers blob (anciens)
          const blobFiles = prevFiles.filter(f => f.url && f.url.startsWith('blob:'));
          
          if (blobFiles.length > 0) {
            const shouldClean = confirm(
              '⚠️ ESPACE DE STOCKAGE SATURÉ\n\n' +
              `Il y a ${blobFiles.length} fichier(s) en ancien format (blob) qui prennent de la place.\n\n` +
              'Voulez-vous les supprimer automatiquement pour libérer de l\'espace ?\n\n' +
              '(Ces fichiers ne fonctionnent plus correctement de toute façon)'
            );
            
            if (shouldClean) {
              // Supprimer les fichiers blob
              const cleanedFiles = prevFiles.filter(f => !f.url || !f.url.startsWith('blob:'));
              const cleanedWithNew = [...cleanedFiles, newFile];
              
              try {
                localStorage.setItem('admin_files', JSON.stringify(cleanedWithNew));
                console.log('✅ Fichiers blob supprimés et nouveau fichier ajouté');
                alert('✅ Espace libéré ! Le fichier a été ajouté avec succès.');
                return cleanedWithNew;
              } catch (retryError) {
                console.error('❌ Toujours saturé après nettoyage:', retryError);
                alert('⚠️ Toujours saturé. Essayez de supprimer plus de fichiers ou utilisez Supabase Admin.');
                return prevFiles;
              }
            }
          } else {
            alert('⚠️ ESPACE DE STOCKAGE SATURÉ\n\n' +
                  'Le localStorage est plein.\n\n' +
                  '💡 Solutions:\n' +
                  '1. Supprimez des fichiers pour libérer de l\'espace\n' +
                  '2. Utilisez Supabase Admin pour les gros fichiers\n\n' +
                  'Le fichier "' + newFile.name + '" n\'a pas pu être sauvegardé.');
          }
          
          return prevFiles;
        }
        throw error;
      }
    });
  };

  const updateFile = (fileId: string, updates: Partial<FileItem>) => {
    setFiles(prevFiles => {
      const updatedFiles = prevFiles.map(file => 
        file.id === fileId ? { ...file, ...updates } : file
      );
      
      try {
        localStorage.setItem('admin_files', JSON.stringify(updatedFiles));
        console.log('✅ Fichier mis à jour:', fileId);
        return updatedFiles;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          console.error('❌ ERREUR: Espace de stockage saturé lors de la mise à jour');
          alert('⚠️ Impossible de sauvegarder les modifications.\nL\'espace de stockage est saturé.');
          return prevFiles;
        }
        throw error;
      }
    });
  };

  const deleteFile = (fileId: string) => {
    setFiles(prevFiles => {
      const updatedFiles = prevFiles.filter(f => f.id !== fileId);
      localStorage.setItem('admin_files', JSON.stringify(updatedFiles));
      console.log('✅ Fichier supprimé:', fileId);
      return updatedFiles;
    });
  };

  const getFilesByType = (type: 'image' | 'document' | 'other') => {
    return files.filter(file => file.type === type);
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

  return {
    ...adminState,
    files,
    login,
    logout,
    addFile,
    updateFile,
    deleteFile,
    getFilesByType,
    searchFiles,
    getFilesByCategory,
    getAllCategories,
    getAllTags,
    loadFiles,
  };
};