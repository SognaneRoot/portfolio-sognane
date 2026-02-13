import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { Shield, Lock, Mail, CheckCircle, AlertTriangle } from 'lucide-react';

interface SupabaseAuthProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

export default function SupabaseAuth({ onLogin, isLoading }: SupabaseAuthProps) {
  const [email, setEmail] = useState('admin@portfolio.local');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const result = await onLogin(email, password);
      
      if (!result.success) {
        let errorMessage = result.error || 'Erreur de connexion';
        
        // Aide spécifique pour "Failed to fetch"
        if (errorMessage.includes("Failed to fetch") || errorMessage.includes("Impossible de contacter Supabase")) {
          errorMessage = "Impossible de contacter le serveur Supabase. Vérifiez votre connexion internet, assurez-vous que votre projet Supabase n'est pas en pause, et que l'URL est correcte.";
        }
        
        setError(errorMessage);
        setPassword('');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setIsSubmitting(false);
    }
  };

  const securityFeatures = [
    {
      icon: <Shield className="h-4 w-4 text-green-600" />,
      title: "Authentification sécurisée",
      description: "Sessions chiffrées avec Supabase"
    },
    {
      icon: <Lock className="h-4 w-4 text-blue-600" />,
      title: "Stockage cloud",
      description: "Fichiers sécurisés dans le cloud"
    },
    {
      icon: <CheckCircle className="h-4 w-4 text-purple-600" />,
      title: "RLS activé",
      description: "Sécurité au niveau des données"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h3 className="text-lg font-medium">Vérification de la session...</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Connexion sécurisée à Supabase
              </p>
            </div>
            <Progress value={75} className="w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Administration Sécurisée</CardTitle>
          <CardDescription>
            Connexion protégée par Supabase Auth
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email administrateur
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@portfolio.local"
                required
                disabled={isSubmitting}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
                required
                disabled={isSubmitting}
                className="bg-background"
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting || !email.trim() || !password.trim()}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Connexion...
                </div>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>

          {/* Fonctionnalités de sécurité */}
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-3 text-center">Sécurité avancée</h4>
            <div className="space-y-3">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  {feature.icon}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{feature.title}</p>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>Session sécurisée limitée à 2 heures</p>
            <p>Déconnexion automatique en cas d'inactivité</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}