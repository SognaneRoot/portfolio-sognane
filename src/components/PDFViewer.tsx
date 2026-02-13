import React, { useEffect } from 'react';
import { X, ArrowLeft, ExternalLink, Download } from 'lucide-react';
import { Button } from './ui/button';

interface PDFViewerProps {
  url: string;
  fileName?: string;
  onClose: () => void;
}

export default function PDFViewer({ url, fileName, onClose }: PDFViewerProps) {
  const handleClose = () => {
    console.log('🔒 Fermeture du PDF viewer');
    onClose();
  };

  useEffect(() => {
    console.log('📄 Initialisation PDFViewer avec URL:', url);
    
    // Désactiver le scroll du body
    document.body.style.overflow = 'hidden';

    // Cleanup
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [url]);

  const handleOpenInNewTab = async () => {
    console.log('🔗 Ouverture dans un nouvel onglet sécurisé...');
    
    // Pour les URLs blob, elles ne fonctionnent pas hors contexte dans un nouvel onglet
    if (url.startsWith('blob:')) {
      console.warn('⚠️ URL blob détectée - ancien format de fichier');
      alert('⚠️ Ce fichier utilise un ancien format.\n\n' +
            'Veuillez le re-uploader via l\'interface admin (⚙️) pour activer la consultation sécurisée.');
      return;
    }

    // Préparer l'URL pour l'intégration
    let pdfUrl = url;

    // Créer une page HTML avec le PDF intégré - Version sécurisée sans bouton téléchargement
    // Cette méthode fonctionne pour les URLs data: et les URLs distantes (Supabase)
    const newWindow = window.open('', '_blank');
    if (!newWindow) {
      console.log('❌ Popup bloquée');
      alert('⚠️ Les popups sont bloquées.\nVeuillez autoriser les popups pour consulter le document.');
      return;
    }

    // Écrire la page HTML sans options de téléchargement ou d'impression
    newWindow.document.write(`
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${fileName || 'Document PDF'}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              -webkit-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: #0f172a;
              overflow: hidden;
            }
            .header {
              background: #1e293b;
              color: white;
              padding: 12px 24px;
              box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
              display: flex;
              justify-content: space-between;
              align-items: center;
              z-index: 50;
              position: relative;
              border-bottom: 1px solid #334155;
            }
            .header h1 {
              font-size: 15px;
              font-weight: 500;
              display: flex;
              align-items: center;
              gap: 10px;
              letter-spacing: 0.025em;
            }
            .protection-msg {
              font-size: 11px;
              color: #94a3b8;
              background: #334155;
              padding: 4px 12px;
              border-radius: 9999px;
              font-weight: 500;
              display: flex;
              align-items: center;
              gap: 6px;
            }
            .pdf-container {
              width: 100%;
              height: calc(100vh - 48px);
              background: #0f172a;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            object, embed, iframe {
              width: 100%;
              height: 100%;
              border: none;
            }
            .loading {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 20px;
              color: #94a3b8;
            }
            .spinner {
              width: 40px;
              height: 40px;
              border: 3px solid #1e293b;
              border-top: 3px solid #3b82f6;
              border-radius: 50%;
              animation: spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body oncontextmenu="return false;" onkeydown="return (event.keyCode != 80 && event.keyCode != 83 && !event.ctrlKey)">
          <div class="header">
            <h1>
              <span style="font-size: 18px">📄</span>
              <span>${(fileName || 'Projet Technique').replace(/'/g, "\\'")}</span>
            </h1>
            <div class="protection-msg">
              <span style="font-size: 14px">🔒</span>
              <span>CONSULTATION SÉCURISÉE</span>
            </div>
          </div>
          <div class="pdf-container" id="container">
            <div class="loading" id="loading">
              <div class="spinner"></div>
              <p>Chargement sécurisé du document...</p>
            </div>
          </div>
          <script>
            const pdfUrl = ${JSON.stringify(pdfUrl)};
            
            const container = document.getElementById('container');
            const loading = document.getElementById('loading');
            
            setTimeout(() => {
              try {
                // Ajouter des paramètres pour masquer les barres d'outils natives
                const finalUrl = pdfUrl + (pdfUrl.includes('#') ? '' : '#toolbar=0&navpanes=0&scrollbar=1&statusbar=0&messages=0&view=FitH');
                
                // Utiliser iframe pour une meilleure compatibilité cross-origin
                const frame = document.createElement('iframe');
                frame.src = finalUrl;
                frame.title = "Visualiseur PDF Sécurisé";
                
                loading.style.display = 'none';
                container.appendChild(frame);
              } catch (error) {
                console.error('Erreur affichage PDF:', error);
                loading.innerHTML = '<p style="color: #ef4444">Erreur lors du chargement du document.</p>';
              }
            }, 100);

            // Bloquer le raccourci Ctrl+P et Ctrl+S
            window.addEventListener('keydown', function(e) {
              if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's')) {
                e.preventDefault();
                return false;
              }
            });
          </script>
        </body>
      </html>
    `);
    newWindow.document.close();
    console.log('✅ Nouvel onglet sécurisé créé');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col">
      {/* Header avec contrôles */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <div className="h-6 w-px bg-gray-300" />
          <h2 className="text-lg font-medium">
            📄 {fileName || 'Document'}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          {!url.startsWith('blob:') && (
            <Button
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="sm"
              onClick={handleOpenInNewTab}
            >
              <ExternalLink className="h-4 w-4" />
              Ouvrir dans un nouvel onglet
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Contenu principal - Message d'instruction */}
      <div className="flex-1 bg-gray-100 flex items-center justify-center">
        <div className="max-w-md text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-xl font-medium mb-4">Document sécurisé</h3>
          
          {url.startsWith('blob:') ? (
            <>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <p className="text-orange-800 text-sm">
                  ⚠️ <strong>Ancien format de fichier</strong><br/>
                  Ce fichier ne peut pas s'ouvrir dans un nouvel onglet.<br/>
                  Veuillez le re-uploader via l'admin pour activer la consultation sécurisée.
                </p>
              </div>
              
              <div className="mt-6 text-sm text-gray-500">
                <p><strong>Fichier :</strong> {fileName || 'Document'}</p>
                <p className="mt-2 text-orange-600">
                  💡 Re-uploadez ce fichier via l'interface admin (⚙️)
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                Ce document est mis à disposition pour consultation uniquement. 
                Le téléchargement et la copie ne sont pas autorisés par l'auteur.
              </p>
              
              <div className="space-y-3">
                <Button 
                  onClick={handleOpenInNewTab}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  Consulter le document
                </Button>
              </div>
              
              <div className="mt-6 text-sm text-gray-500">
                <p><strong>Fichier :</strong> {fileName || 'Document'}</p>
                <p className="mt-2 text-blue-600">
                  💡 Le document s'ouvrira dans un nouvel onglet sécurisé sans options de téléchargement.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Message de protection */}
      <div className={`border-t px-4 py-2 ${
        url.startsWith('blob:') 
          ? 'bg-orange-50 border-orange-200' 
          : 'bg-blue-50 border-blue-200'
      }`}>
        <p className={`text-sm text-center font-medium ${
          url.startsWith('blob:') 
            ? 'text-orange-800' 
            : 'text-blue-800'
        }`}>
          {url.startsWith('blob:') 
            ? '⚠️ Format incompatible avec la protection - Re-uploadez via l\'admin'
            : '🔒 Ce document est protégé contre le téléchargement et la copie'}
        </p>
      </div>
    </div>
  );
}