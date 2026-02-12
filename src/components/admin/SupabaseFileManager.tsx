import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { 
  Upload, 
  Image, 
  FileText, 
  File, 
  Trash2, 
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Search,
  Filter,
  Tag,
  Folder,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Cloud,
  HardDrive
} from 'lucide-react';
import { useSupabaseAdmin } from '../../hooks/useSupabaseAdmin';
import SupabaseFileEditModal from './SupabaseFileEditModal';

interface SupabaseFileManagerProps {
  onFileSelect?: (fileUrl: string) => void;
}

type SortOption = 'name' | 'date' | 'size' | 'type';
type ViewMode = 'grid' | 'list';

export default function SupabaseFileManager({ onFileSelect }: SupabaseFileManagerProps) {
  const { 
    files, 
    uploadFile, 
    updateFile, 
    deleteFile, 
    uploadProgress, 
    isUploading,
    searchFiles,
    getFilesByCategory,
    getAllCategories,
    getAllTags,
    getFilesByType,
    getStats
  } = useSupabaseAdmin();
  
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortDesc, setSortDesc] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingFile, setEditingFile] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtrer et trier les fichiers
  const getFilteredAndSortedFiles = () => {
    let filteredFiles = files;

    // Recherche
    if (searchQuery) {
      filteredFiles = searchFiles(searchQuery);
    }

    // Filtrer par catégorie
    if (selectedCategory !== 'all') {
      filteredFiles = filteredFiles.filter(file => file.category === selectedCategory);
    }

    // Filtrer par type
    if (selectedType !== 'all') {
      filteredFiles = filteredFiles.filter(file => file.type === selectedType);
    }

    // Trier
    filteredFiles.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case 'size':
          aValue = a.size;
          bValue = b.size;
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDesc ? 1 : -1;
      if (aValue > bValue) return sortDesc ? -1 : 1;
      return 0;
    });

    return filteredFiles;
  };

  const handleFileUpload = async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    setUploadError('');
    setUploadSuccess('');

    for (const file of Array.from(selectedFiles)) {
      // Vérifications de sécurité
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'text/plain', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (file.size > maxSize) {
        setUploadError(`Fichier trop volumineux: ${file.name} (max 10MB)`);
        continue;
      }

      if (!allowedTypes.includes(file.type)) {
        setUploadError(`Type de fichier non autorisé: ${file.name}`);
        continue;
      }

      try {
        const result = await uploadFile(file);
        if (result.success) {
          setUploadSuccess(`Fichier ${file.name} uploadé avec succès !`);
          setTimeout(() => setUploadSuccess(''), 3000);
        } else {
          setUploadError(result.error || `Erreur lors de l'upload de ${file.name}`);
        }
      } catch (error) {
        setUploadError(`Erreur lors de l'upload de ${file.name}`);
      }
    }
  };

  const handleDeleteFile = async (fileId: string, fileName: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${fileName}" ?`)) {
      const result = await deleteFile(fileId);
      if (!result.success) {
        setUploadError(result.error || 'Erreur lors de la suppression');
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-5 w-5" />;
      case 'document': return <FileText className="h-5 w-5" />;
      default: return <File className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'bg-green-100 text-green-800';
      case 'document': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredFiles = getFilteredAndSortedFiles();
  const categories = getAllCategories();
  const allTags = getAllTags();
  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Info Supabase */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-blue-700">
            <Cloud className="h-5 w-5" />
            <div>
              <p className="font-medium">Stockage cloud Supabase</p>
              <p className="text-sm text-blue-600">
                Fichiers sécurisés et sauvegardés dans le cloud
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zone de Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload de fichiers vers Supabase
          </CardTitle>
          <CardDescription>
            Glissez-déposez vos fichiers ou cliquez pour sélectionner
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <div className="space-y-2">
              <p>Glissez vos fichiers ici ou cliquez pour sélectionner</p>
              <p className="text-sm text-muted-foreground">
                Images (JPG, PNG, GIF, WebP), Documents (PDF, DOC, TXT) - Max 10MB
              </p>
            </div>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="mt-4"
              variant="outline"
              disabled={isUploading}
            >
              {isUploading ? 'Upload en cours...' : 'Sélectionner des fichiers'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
              accept="image/*,.pdf,.doc,.docx,.txt"
              disabled={isUploading}
            />
          </div>

          {/* Barre de progression */}
          {isUploading && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Upload en cours...</span>
                <span className="text-sm">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Messages */}
          {uploadError && (
            <Alert variant="destructive" className="mt-4">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}

          {uploadSuccess && (
            <Alert className="mt-4 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">{uploadSuccess}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Barre de recherche et filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Recherche */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, description, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filtres */}
            <div className="flex gap-2">
              {/* Filtre par catégorie */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Catégorie">
                    {selectedCategory && (
                      <div className="flex items-center gap-1">
                        <Folder className="h-4 w-4" />
                        {selectedCategory}
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      <div className="flex items-center gap-2">
                        <Folder className="h-4 w-4" />
                        {category}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filtre par type */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                  <SelectItem value="other">Autres</SelectItem>
                </SelectContent>
              </Select>

              {/* Tri */}
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nom</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="size">Taille</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortDesc(!sortDesc)}
              >
                {sortDesc ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
              </Button>

              {/* Mode d'affichage */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-r-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-l-none border-l"
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des fichiers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Fichiers cloud ({filteredFiles.length}{files.length !== filteredFiles.length && ` sur ${files.length}`})
          </CardTitle>
          <CardDescription>
            Gérez vos fichiers stockés dans Supabase
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredFiles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{files.length === 0 ? 'Aucun fichier uploadé' : 'Aucun fichier correspondant aux filtres'}</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}>
              {filteredFiles.map((file) => (
                <div 
                  key={file.id} 
                  className={`${viewMode === 'grid' ? 'border rounded-lg p-4 hover:bg-muted/50' : 'flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50'}`}
                >
                  {viewMode === 'list' ? (
                    <>
                      <div className="flex items-center gap-3 flex-1">
                        {getFileIcon(file.type)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{file.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="secondary" className={getTypeColor(file.type)}>
                              {file.type}
                            </Badge>
                            {file.category && (
                              <Badge variant="outline" className="text-xs">
                                <Folder className="h-3 w-3 mr-1" />
                                {file.category}
                              </Badge>
                            )}
                            <span>{formatFileSize(file.size)}</span>
                            <span>{new Date(file.created_at).toLocaleDateString()}</span>
                          </div>
                          {file.description && (
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {file.description}
                            </p>
                          )}
                          {file.tags && file.tags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {file.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  <Tag className="h-2 w-2 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                              {file.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{file.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingFile(file)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {file.type === 'image' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(file.public_url, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const a = document.createElement('a');
                            a.href = file.public_url;
                            a.download = file.name;
                            a.click();
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {onFileSelect && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onFileSelect(file.public_url)}
                          >
                            Utiliser
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteFile(file.id, file.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    /* Vue grille */
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        {getFileIcon(file.type)}
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingFile(file)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteFile(file.id, file.name)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <p className="font-medium truncate text-sm">{file.name}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="secondary" className={`${getTypeColor(file.type)} text-xs`}>
                            {file.type}
                          </Badge>
                          {file.category && (
                            <Badge variant="outline" className="text-xs">
                              {file.category}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatFileSize(file.size)}
                        </p>
                        {file.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {file.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex gap-1 justify-between">
                        {file.type === 'image' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(file.public_url, '_blank')}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const a = document.createElement('a');
                            a.href = file.public_url;
                            a.download = file.name;
                            a.click();
                          }}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        {onFileSelect && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onFileSelect(file.public_url)}
                          >
                            Utiliser
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Image className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Images</p>
                <p className="text-2xl font-bold">{stats.imageCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Documents</p>
                <p className="text-2xl font-bold">{stats.documentCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Folder className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Catégories</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Tags</p>
                <p className="text-2xl font-bold">{allTags.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-indigo-600" />
              <div>
                <p className="text-sm text-muted-foreground">Stockage</p>
                <p className="text-2xl font-bold">{stats.totalSizeMB}MB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal d'édition */}
      <SupabaseFileEditModal
        file={editingFile}
        isOpen={!!editingFile}
        onClose={() => setEditingFile(null)}
        onSave={updateFile}
        existingCategories={categories}
        existingTags={allTags}
      />
    </div>
  );
}