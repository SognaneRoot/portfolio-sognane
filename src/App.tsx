import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import CVSection from './components/CVSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ProjectDetail from './components/ProjectDetail';
import AdminPanel from './components/AdminPanel';
import SupabaseAdminPanel from './components/SupabaseAdminPanel';
import PDFViewer from './components/PDFViewer';

interface Project {
  id: string;
  title: string;
  description: string;
  year: string;
  category: 'certification' | 'project';
  image: string;
  technologies: string[];
  links?: {
    demo?: string;
    github?: string;
    certificate?: string;
  };
  featured?: boolean;
}

type ViewType = 'portfolio' | 'project-detail' | 'admin' | 'supabase-admin';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('portfolio');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [pdfViewerData, setPdfViewerData] = useState<{url: string, fileName: string} | null>(null);

  useEffect(() => {
    // Bloquer le clic droit sur tout le site
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    window.addEventListener('contextmenu', handleContextMenu);

    // Écouter les événements pour ouvrir le viewer PDF
    const handleOpenPDFViewer = (event: CustomEvent) => {
      console.log('📡 Événement openPDFViewer reçu:', event.detail);
      setPdfViewerData(event.detail);
    };

    window.addEventListener('openPDFViewer', handleOpenPDFViewer as EventListener);

    // Vérifier s'il y a des fichiers à migrer
    import('./utils/simpleFileService').then(({ SimpleFileService }) => {
      if (SimpleFileService.needsMigration()) {
        const filesToMigrate = SimpleFileService.getFilesToMigrate();
        console.warn('⚠️ MIGRATION NÉCESSAIRE:');
        console.warn('Les fichiers suivants utilisent un ancien format et doivent être re-uploadés:');
        filesToMigrate.forEach(name => console.warn('  - ' + name));
        console.warn('💡 Re-uploadez ces fichiers via l\'interface admin (⚙️) pour activer toutes les fonctionnalités.');
      }
    });

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('openPDFViewer', handleOpenPDFViewer as EventListener);
    };
  }, []);

  const handleViewProject = (project: Project) => {
    console.log('👁️ Affichage du projet:', project.title);
    setSelectedProject(project);
    setCurrentView('project-detail');
    setPdfViewerData(null); // S'assurer que le PDF viewer est fermé
  };

  const handleBackToPortfolio = () => {
    console.log('🔙 Retour au portfolio');
    setCurrentView('portfolio');
    setSelectedProject(null);
    setPdfViewerData(null); // S'assurer que le PDF viewer est fermé
  };

  const handleClosePDFViewer = () => {
    console.log('❌ Fermeture du PDF viewer');
    setPdfViewerData(null);
    // Ne pas changer currentView, juste fermer le viewer
  };

  const handleAdminAccess = () => {
    // Détecter si Supabase est configuré - Compatible navigateur
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
    
    console.log('🔐 Accès admin - Supabase configuré:', hasSupabase);
    console.log('🔗 Supabase URL:', supabaseUrl);
    
    if (hasSupabase) {
      setCurrentView('supabase-admin');
    } else {
      setCurrentView('admin');
    }
  };

  // Vérifier si l'URL contient /admin pour accès direct
  if (window.location.pathname === '/admin' || currentView === 'admin') {
    return <AdminPanel />;
  }

  // Interface Supabase si configuré
  if (currentView === 'supabase-admin') {
    return <SupabaseAdminPanel />;
  }

  // Le PDFViewer doit s'afficher par-dessus tout
  if (pdfViewerData) {
    return (
      <PDFViewer 
        url={pdfViewerData.url} 
        fileName={pdfViewerData.fileName}
        onClose={handleClosePDFViewer}
      />
    );
  }

  if (currentView === 'project-detail' && selectedProject) {
    return (
      <ProjectDetail 
        project={selectedProject} 
        onBack={handleBackToPortfolio}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation onAdminAccess={handleAdminAccess} />
      <main>
        <HeroSection />
        <CVSection />
        <ProjectsSection onViewProject={handleViewProject} />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}