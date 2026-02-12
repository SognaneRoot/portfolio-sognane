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
    console.log('🔗 Ouverture dans un nouvel onglet...');
    
    // Pour les URLs normales (Supabase, HTTP), ouvrir directement
    if (!url.startsWith('blob:') && !url.startsWith('data:')) {
      console.log('✅ Ouverture URL normale:', url);
      window.open(url, '_blank');
      return;
    }

    // Pour les URLs blob, elles ne fonctionnent pas hors contexte
    if (url.startsWith('blob:')) {
      console.warn('⚠️ URL blob détectée - ancien format de fichier');
      alert('⚠️ Ce fichier utilise un ancien format.\n\n' +
            'Pour l\'ouvrir dans un nouvel onglet :\n' +
            '1. Téléchargez-le avec le bouton "Télécharger"\n' +
            '2. Ou re-uploadez-le via l\'interface admin (⚙️)\n\n' +
            'Le fichier sera alors converti au nouveau format compatible.');
      return;
    }

    // Pour les URLs data, on peut les utiliser directement
    let dataUrl = url;

    // Créer une page HTML avec le PDF intégré
    const newWindow = window.open('', '_blank');
    if (!newWindow) {
      console.log('❌ Popup bloquée');
      alert('⚠️ Les popups sont bloquées.\nVeuillez autoriser les popups pour ce site ou utiliser le bouton "Télécharger".');
      return;
    }

    // Écrire la page HTML
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
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: #2d3748;
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 12px 20px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              justify-content: space-between;
              align-items: center;
              z-index: 10;
              position: relative;
            }
            .header h1 {
              font-size: 18px;
              font-weight: 500;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .controls {
              display: flex;
              gap: 8px;
            }
            .btn {
              background: rgba(255,255,255,0.2);
              border: 1px solid rgba(255,255,255,0.3);
              color: white;
              padding: 8px 16px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
              transition: all 0.2s;
              display: flex;
              align-items: center;
              gap: 6px;
              font-weight: 500;
            }
            .btn:hover {
              background: rgba(255,255,255,0.3);
              transform: translateY(-1px);
              box-shadow: 0 4px 6px rgba(0,0,0,0.2);
            }
            .pdf-container {
              width: 100%;
              height: calc(100vh - 48px);
              background: #2d3748;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            object, embed {
              width: 100%;
              height: 100%;
              border: none;
            }
            .loading {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 16px;
              color: white;
            }
            .spinner {
              width: 48px;
              height: 48px;
              border: 4px solid rgba(255,255,255,0.2);
              border-top: 4px solid #667eea;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .error-msg {
              text-align: center;
              color: white;
              padding: 40px;
            }
            .error-msg h2 {
              font-size: 24px;
              margin-bottom: 16px;
            }
            .error-msg p {
              font-size: 16px;
              margin-bottom: 24px;
              opacity: 0.8;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>
              <span>📄</span>
              <span>${(fileName || 'Document PDF').replace(/'/g, "\\'")} </span>
            </h1>
            <div class="controls">
              <button class="btn" onclick="window.print()" title="Imprimer le document">
                <span>🖨️</span>
                <span>Imprimer</span>
              </button>
              <button class="btn" onclick="downloadPDF()" title="Télécharger le document">
                <span>💾</span>
                <span>Télécharger</span>
              </button>
            </div>
          </div>
          <div class="pdf-container" id="container">
            <div class="loading" id="loading">
              <div class="spinner"></div>
              <p>Chargement du document PDF...</p>
            </div>
          </div>
          <script>
            const pdfData = ${JSON.stringify(dataUrl)};
            const fileName = ${JSON.stringify(fileName || 'document.pdf')};
            
            function downloadPDF() {
              console.log('📥 Téléchargement du PDF...');
              const link = document.createElement('a');
              link.href = pdfData;
              link.download = fileName;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              console.log('✅ Téléchargement lancé');
            }
            
            // Afficher le PDF
            const container = document.getElementById('container');
            const loading = document.getElementById('loading');
            
            setTimeout(() => {
              try {
                // Créer un object tag pour afficher le PDF
                const obj = document.createElement('object');
                obj.data = pdfData;
                obj.type = 'application/pdf';
                obj.style.width = '100%';
                obj.style.height = '100%';
                
                // Fallback si object ne fonctionne pas
                const fallbackDiv = document.createElement('div');
                fallbackDiv.className = 'error-msg';
                fallbackDiv.innerHTML = \`
                  <h2>📄 Document PDF prêt</h2>
                  <p>Votre navigateur ne peut pas afficher ce PDF directement.</p>
                  <button class="btn" onclick="downloadPDF()" style="margin: 0 auto;">
                    <span>💾</span>
                    <span>Télécharger le document</span>
                  </button>
                \`;
                obj.appendChild(fallbackDiv);
                
                loading.style.display = 'none';
                container.appendChild(obj);
                
                console.log('✅ PDF affiché');
              } catch (error) {
                console.error('❌ Erreur affichage PDF:', error);
                loading.innerHTML = \`
                  <div class="error-msg">
                    <h2>⚠️ Erreur d'affichage</h2>
                    <p>Impossible d'afficher le PDF dans le navigateur.</p>
                    <button class="btn" onclick="downloadPDF()">
                      <span>💾</span>
                      <span>Télécharger le document</span>
                    </button>
                  </div>
                \`;
              }
            }, 100);
          </script>
        </body>
      </html>
    `);
    newWindow.document.close();
    console.log('✅ Nouvel onglet créé');
  };

  const handleDownload = () => {
    console.log('💾 Téléchargement du fichier:', fileName);
    console.log('🔗 Type d\'URL:', url.substring(0, 10) + '...');
    
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log('✅ Téléchargement lancé');
    } catch (error) {
      console.error('❌ Erreur téléchargement:', error);
      alert('⚠️ Erreur lors du téléchargement.\nVeuillez réessayer ou contacter le support.');
    }
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
              variant="outline"
              size="sm"
              onClick={handleOpenInNewTab}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Ouvrir dans un nouvel onglet
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Télécharger
          </Button>
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
          <h3 className="text-xl font-medium mb-4">Document PDF disponible</h3>
          
          {url.startsWith('blob:') ? (
            <>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <p className="text-orange-800 text-sm">
                  ⚠️ <strong>Ancien format de fichier</strong><br/>
                  Ce fichier ne peut pas s'ouvrir dans un nouvel onglet.<br/>
                  Veuillez le télécharger ou le re-uploader via l'admin.
                </p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={handleDownload}
                  className="w-full flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Download className="h-4 w-4" />
                  Télécharger le document
                </Button>
              </div>
              
              <div className="mt-6 text-sm text-gray-500">
                <p><strong>Fichier :</strong> {fileName || 'Document'}</p>
                <p className="mt-2 text-orange-600">
                  💡 Pour activer l'ouverture dans un nouvel onglet, re-uploadez ce fichier via l'interface admin (⚙️)
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                Choisissez comment consulter le document :
              </p>
              
              <div className="space-y-3">
                <Button 
                  onClick={handleOpenInNewTab}
                  className="w-full flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  Ouvrir dans un nouvel onglet
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={handleDownload}
                  className="w-full flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Télécharger le document
                </Button>
              </div>
              
              <div className="mt-6 text-sm text-gray-500">
                <p><strong>Fichier :</strong> {fileName || 'Document'}</p>
                <p className="mt-2 text-blue-600">
                  💡 Le document s'ouvrira dans un nouvel onglet avec contrôles d'impression et téléchargement
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
        <p className={`text-sm text-center ${
          url.startsWith('blob:') 
            ? 'text-orange-800' 
            : 'text-blue-800'
        }`}>
          {url.startsWith('blob:') 
            ? '⚠️ Fichier ancien format - Téléchargez ou re-uploadez via l\'admin pour améliorer la compatibilité'
            : '💡 Le document s\'ouvrira dans un nouvel onglet avec tous les contrôles nécessaires'}
        </p>
      </div>
    </div>
  );
}