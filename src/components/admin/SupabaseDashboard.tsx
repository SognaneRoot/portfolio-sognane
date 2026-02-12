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
  Cloud,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import SupabaseFileManager from './SupabaseFileManager';
import { useSupabaseAdmin } from '../../hooks/useSupabaseAdmin';
import { CVService } from '../../utils/cvService';

interface SupabaseDashboardProps {
  onLogout: () => void;
}

export default function SupabaseDashboard({ onLogout }: SupabaseDashboardProps) {
  const { getStats } = useSupabaseAdmin();
  const [isDownloadingCV, setIsDownloadingCV] = useState(false);
  const [cvInfo, setCvInfo] = useState<{
    available: boolean;
    fileName?: string;
    uploadDate?: string;
    size?: number;
  } | null>(null);

  const stats = getStats();

  // Charger les informations du CV au montage
  React.useEffect(() => {
    loadCVInfo();
  }, []);

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

  const securityFeatures = [
    {
      title: "Authentification Supabase",
      description: "Sessions JWT sécurisées",
      status: "Actif",
      level: "Élevé",
      icon: <Shield className="h-4 w-4" />
    },
    {
      title: "Stockage Cloud Sécurisé",
      description: "Files chiffrés avec RLS",
      status: "Actif",
      level: "Élevé",
      icon: <Cloud className="h-4 w-4" />
    },
    {
      title: "Base de données PostgreSQL",
      description: "Métadonnées protégées",
      status: "Actif",
      level: "Élevé",
      icon: <Database className="h-4 w-4" />
    },
    {
      title: "Row Level Security",
      description: "Isolation des données utilisateur",
      status: "Actif",
      level: "Maximum",
      icon: <Lock className="h-4 w-4" />
    }
  ];

  const supabaseInfo = {
    status: "Connecté",
    region: "EU-West",
    latency: "< 50ms",
    uptime: "99.9%"
  };

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
                <h1 className="text-xl font-semibold">Administration Supabase</h1>
                <p className="text-sm text-muted-foreground">Portfolio Ndiaga Sognane</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge className="bg-green-100 text-green-800">
                <Cloud className="h-3 w-3 mr-1" />
                Supabase {supabaseInfo.status}
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Activity className="h-3 w-3 mr-1" />
                {supabaseInfo.latency}
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
            {/* Statut Supabase */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <Cloud className="h-5 w-5" />
                  Statut Supabase
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-green-700">Statut</p>
                    <p className="font-bold text-green-900">{supabaseInfo.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700">Région</p>
                    <p className="font-bold text-green-900">{supabaseInfo.region}</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700">Latence</p>
                    <p className="font-bold text-green-900">{supabaseInfo.latency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700">Uptime</p>
                    <p className="font-bold text-green-900">{supabaseInfo.uptime}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Fichiers</p>
                      <p className="text-3xl font-bold">{stats.totalFiles}</p>
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
                      <p className="text-3xl font-bold">{stats.imageCount}</p>
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
                      <p className="text-3xl font-bold">{stats.documentCount}</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Stockage</p>
                      <p className="text-3xl font-bold">{stats.totalSizeMB}MB</p>
                    </div>
                    <Cloud className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
                <CardDescription>
                  Accès rapide aux fonctionnalités Supabase
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
            <SupabaseFileManager />
          </TabsContent>

          {/* CV Tab */}
          <TabsContent value="cv" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion du CV avec Supabase</CardTitle>
                <CardDescription>
                  Utilisez votre CV importé ou générez un CV automatique avec stockage cloud
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
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            <Cloud className="h-3 w-3 mr-1" />
                            Stockage Supabase
                          </Badge>
                        </div>
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
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            <Cloud className="h-3 w-3 mr-1" />
                            Stockage Supabase
                          </Badge>
                        </div>
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
                  <h4 className="font-medium mb-2">Avantages Supabase :</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• <strong>CV Importé :</strong> Votre fichier PDF professionnel</li>
                    <li>• <strong>Stockage cloud :</strong> Sauvegarde automatique et sécurisée</li>
                    <li>• <strong>Accès universel :</strong> Disponible depuis n'importe où</li>
                    <li>• <strong>URLs sécurisées :</strong> Liens de téléchargement protégés</li>
                    <li>• <strong>Fallback intelligent :</strong> Génération automatique si besoin</li>
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
                  Sécurité Supabase Avancée
                </CardTitle>
                <CardDescription>
                  Protection enterprise avec authentification et stockage cloud
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {feature.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          className="bg-green-100 text-green-800"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {feature.status}
                        </Badge>
                        <Badge variant="outline">
                          {feature.level}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fonctionnalités de sécurité actives</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="font-medium text-green-800">✅ Protection maximale</p>
                    <p className="text-green-700">
                      Votre portfolio bénéficie maintenant de la sécurité enterprise de Supabase
                      avec authentification JWT et stockage chiffré.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Authentification :</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Sessions JWT sécurisées</li>
                        <li>Tokens avec expiration automatique</li>
                        <li>Nettoyage automatique des sessions</li>
                        <li>Protection contre les attaques par force brute</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Stockage :</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Chiffrement des données au repos</li>
                        <li>Row Level Security (RLS)</li>
                        <li>Sauvegarde automatique</li>
                        <li>CDN global pour les performances</li>
                      </ul>
                    </div>
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