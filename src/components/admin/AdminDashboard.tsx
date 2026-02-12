import { useState } from 'react';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { 
  Settings, 
  FileText, 
  Image, 
  Download, 
  LogOut,
  Shield,
  Database,
  Activity,
  Users,
  Lock,
  Upload,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import FileManager from './FileManager';
import { useAdmin } from '../../hooks/useAdmin';
import { CVService } from '../../utils/cvService';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { files } = useAdmin();
  const [isDownloadingCV, setIsDownloadingCV] = useState(false);
  const [cvInfo, setCvInfo] = useState<{
    available: boolean;
    fileName?: string;
    uploadDate?: string;
    size?: number;
  } | null>(null);

  // Charger les informations du CV au montage
  React.useEffect(() => {
    loadCVInfo();
  }, [files]);

  const loadCVInfo = async () => {
    try {
      const info = await CVService.getMainCVInfo();
      setCvInfo(info);
    } catch (error) {
      console.error('Erreur chargement info CV:', error);
      setCvInfo({ available: false });
    }
  };

  const handleDownloadCV = async () => {
    setIsDownloadingCV(true);
    try {
      const success = await CVService.downloadMainCV();
      if (!success) {
        // Fallback vers la génération automatique si pas de CV importé
        const { generatePDF } = await import('../../utils/pdfGenerator');
        await generatePDF();
      }
    } catch (error) {
      console.error('Erreur téléchargement CV:', error);
    } finally {
      setIsDownloadingCV(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const securityMeasures = [
    {
      title: "Authentification sécurisée",
      description: "Mot de passe avec session limitée",
      status: "Actif",
      level: "Élevé"
    },
    {
      title: "Validation des fichiers",
      description: "Types et tailles contrôlés",
      status: "Actif",
      level: "Élevé"
    },
    {
      title: "Stockage local",
      description: "Fichiers stockés localement (temporaire)",
      status: "Attention",
      level: "Moyen"
    },
    {
      title: "Sessions temporaires",
      description: "Déconnexion automatique après 2h",
      status: "Actif",
      level: "Élevé"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Administration</h1>
                <p className="text-sm text-muted-foreground">Portfolio Ndiaga Sognane</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Activity className="h-3 w-3 mr-1" />
                En ligne
              </Badge>
              <Button 
                variant="outline" 
                onClick={onLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="files">Fichiers</TabsTrigger>
            <TabsTrigger value="cv">CV</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Fichiers</p>
                      <p className="text-3xl font-bold">{files.length}</p>
                    </div>
                    <Database className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Images</p>
                      <p className="text-3xl font-bold">{files.filter(f => f.type === 'image').length}</p>
                    </div>
                    <Image className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Documents</p>
                      <p className="text-3xl font-bold">{files.filter(f => f.type === 'document').length}</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Sécurité</p>
                      <p className="text-3xl font-bold text-green-600">OK</p>
                    </div>
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
                <CardDescription>
                  Accès rapide aux fonctionnalités principales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    className="h-auto p-4 flex-col gap-2"
                    onClick={handleDownloadCV}
                    disabled={isDownloadingCV}
                  >
                    <Download className="h-6 w-6" />
                    <span>{isDownloadingCV ? 'Téléchargement...' : 'Télécharger CV'}</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="h-auto p-4 flex-col gap-2"
                    onClick={() => document.querySelector('[data-value="files"]')?.click()}
                  >
                    <FileText className="h-6 w-6" />
                    <span>Gérer les fichiers</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="h-auto p-4 flex-col gap-2"
                    onClick={() => window.open('/', '_blank')}
                  >
                    <Users className="h-6 w-6" />
                    <span>Voir le site</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files">
            <FileManager />
          </TabsContent>

          {/* CV Tab */}
          <TabsContent value="cv" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion du CV</CardTitle>
                <CardDescription>
                  Utilisez votre CV importé ou générez un CV automatique
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cvInfo?.available ? (
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-green-900">CV Importé Disponible</h3>
                        <p className="text-sm text-green-700">{cvInfo.fileName}</p>
                        {cvInfo.uploadDate && (
                          <p className="text-xs text-green-600">
                            Importé le {new Date(cvInfo.uploadDate).toLocaleDateString('fr-FR')}
                            {cvInfo.size && ` • ${formatFileSize(cvInfo.size)}`}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button 
                      onClick={handleDownloadCV}
                      disabled={isDownloadingCV}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      {isDownloadingCV ? 'Téléchargement...' : 'Télécharger CV'}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-full">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-yellow-900">Aucun CV Importé</h3>
                        <p className="text-sm text-yellow-700">
                          Importez votre CV via l'onglet Fichiers ou utilisez la génération automatique
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={handleDownloadCV}
                      disabled={isDownloadingCV}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      {isDownloadingCV ? 'Génération...' : 'Générer CV Auto'}
                    </Button>
                  </div>
                )}

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Instructions :</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• <strong>CV Importé :</strong> Utilisez votre propre fichier PDF uploadé</li>
                    <li>• <strong>CV Automatique :</strong> Génération basée sur vos informations</li>
                    <li>• <strong>Format accepté :</strong> PDF uniquement</li>
                    <li>• <strong>Recommendation :</strong> Importez votre CV professionnel pour une meilleure présentation</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Mesures de sécurité
                </CardTitle>
                <CardDescription>
                  État des mesures de sécurité appliquées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityMeasures.map((measure, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{measure.title}</h4>
                        <p className="text-sm text-muted-foreground">{measure.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={measure.status === 'Actif' ? 'default' : 'secondary'}
                          className={
                            measure.status === 'Actif' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {measure.status}
                        </Badge>
                        <Badge variant="outline">
                          {measure.level}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommandations de sécurité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="font-medium text-yellow-800">⚠️ Important</p>
                    <p className="text-yellow-700">
                      Pour une sécurité optimale en production, considérez l'utilisation de Supabase 
                      pour l'authentification sécurisée et le stockage des fichiers.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Améliorations recommandées :</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Authentification OAuth ou JWT</li>
                      <li>Stockage sécurisé des fichiers (cloud)</li>
                      <li>Logs d'audit des actions admin</li>
                      <li>Limitation des tentatives de connexion</li>
                      <li>HTTPS obligatoire</li>
                      <li>Chiffrement des données sensibles</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}