import { useState, useEffect } from 'react';
import { ExternalLink, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { CertificateService } from '../utils/certificateService';

interface Certification {
  id: string;
  title: string;
  description: string;
  year: string;
  category: 'certification';
  image: string;
  technologies: string[];
  links?: {
    certificate?: string;
  };
  featured?: boolean;
}

interface CertificationModalProps {
  certification: Certification | null;
  isOpen: boolean;
  onClose: () => void;
}

// Fonction pour mapper les IDs de ProjectsSection vers les alias de recherche
function getCertificationSearchAliases(projectCertId: string): string[] {
  const mapping: Record<string, string[]> = {
    'cert1': ['python1', 'python2', 'python-1', 'python-2'], // Python Essential 1 & 2
    'cert2': ['ccna1', 'ccna2', 'ccna-1', 'ccna-2'], // CCNA 1 & 2
    'cert3': ['linux', 'ndg-linux', 'ndg'], // NDG Linux Essential
    'cert4': ['cyberops', 'cyber-ops'], // CyberOps
    'cert5': ['linuxserver', 'linux-server'], // Linux Server 1
    'cert6': ['ite', 'itessential', 'it-essential', 'itessentiel'], // ITE (IT Essentials)
  };
  
  return mapping[projectCertId] || [projectCertId];
}

export default function CertificationModal({ 
  certification, 
  isOpen, 
  onClose 
}: CertificationModalProps) {
  const [certificateImageUrl, setCertificateImageUrl] = useState<string>('');
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  useEffect(() => {
    if (!certification) return;

    const loadCertificateImage = async () => {
      setIsLoadingImage(true);
      console.log('🖼️ [ProjectsSection] Chargement image pour:', certification.id, '-', certification.title);
      
      try {
        const searchAliases = getCertificationSearchAliases(certification.id);
        console.log('🔍 [ProjectsSection] Alias de recherche:', searchAliases);
        
        const imageUrl = await CertificateService.getCertificateImageUrl(
          searchAliases,
          certification.image
        );
        
        console.log('🖼️ [ProjectsSection] URL finale:', imageUrl);
        console.log('📍 [ProjectsSection] Source:', imageUrl === certification.image ? 'Unsplash (défaut)' : 'Supabase (personnalisée)');
        
        setCertificateImageUrl(imageUrl);
      } catch (error) {
        console.error('❌ [ProjectsSection] Erreur chargement image:', error);
        setCertificateImageUrl(certification.image);
      } finally {
        setIsLoadingImage(false);
      }
    };

    loadCertificateImage();
  }, [certification]);

  if (!certification) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{certification.title}</DialogTitle>
          <DialogDescription>
            Détails de la certification {certification.title} obtenue en {certification.year}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image de la certification */}
          <div className="relative">
            {isLoadingImage ? (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-gray-500">Chargement...</div>
              </div>
            ) : (
              <ImageWithFallback
                src={certificateImageUrl || certification.image}
                alt={`Certification ${certification.title}`}
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
            )}
            <div className="absolute top-4 left-4">
              <Badge className="bg-purple-100 text-purple-700">
                Certification
              </Badge>
            </div>
            {certification.featured && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  ⭐ Mis en avant
                </Badge>
              </div>
            )}
          </div>

          {/* Informations de la certification */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Obtenue en {certification.year}</span>
            </div>

            <div>
              <h4 className="text-lg mb-2">Description</h4>
              <p className="text-gray-700">{certification.description}</p>
            </div>

            <div>
              <h4 className="text-lg mb-3">Compétences acquises</h4>
              <div className="flex flex-wrap gap-2">
                {certification.technologies.map((tech) => (
                  <Badge 
                    key={tech} 
                    variant="outline" 
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => window.open(certificateImageUrl || certification.image, '_blank')}
                className="w-full flex items-center justify-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Voir l'image en grand
              </Button>
            </div>
          </div>

          {/* Message d'information */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-700">
              💡 <strong>Note :</strong> Cette certification atteste de mes compétences 
              dans le domaine spécifié et contribue à mon expertise technique.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}