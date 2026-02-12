import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Upload, 
  Image, 
  FileText, 
  File, 
  Trash2, 
  Download,
  Eye,
  AlertTriangle,
  Edit,
  Search,
  Filter,
  Tag,
  Folder,
  SortAsc,
  SortDesc,
  Grid,
  List
} from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';
import FileEditModal from './FileEditModal';

interface FileManagerProps {
  onFileSelect?: (fileUrl: string) => void;
}

type SortOption = 'name' | 'date' | 'size' | 'type';
type ViewMode = 'grid' | 'list';

export default function FileManager({ onFileSelect }: FileManagerProps) {
  const { 
    files, 
    addFile, 
    updateFile, 
    deleteFile, 
    getFilesByType, 
    searchFiles, 
    getFilesByCategory,
    getAllCategories,
    getAllTags
  } = useAdmin();
  
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState('');
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
    if (selectedCategory && selectedCategory !== 'all') {
      filteredFiles = filteredFiles.filter(file => file.category === selectedCategory);
    }

    // Filtrer par type
    if (selectedType && selectedType !== 'all') {
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
          aValue = new Date(a.uploadDate);
          bValue = new Date(b.uploadDate);
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

  const handleFileUpload = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    Array.from(selectedFiles).forEach(file => {
      // Vérifications de sécurité
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'text/plain', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (file.size > maxSize) {
        setUploadError(`Fichier trop volumineux: ${file.name} (max 10MB)`);
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        setUploadError(`Type de fichier non autorisé: ${file.name}`);
        return;
      }

      // Déterminer le type
      let fileType: 'image' | 'document' | 'other' = 'other';
      if (file.type.startsWith('image/')) {
        fileType = 'image';
      } else if (file.type.includes('pdf') || file.type.includes('document') || file.type.includes('text')) {
        fileType = 'document';
      }

      // Convertir le fichier en base64 pour stockage persistant
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileUrl = e.target?.result as string;
        
        console.log('📤 Upload fichier:', file.name, 'Type:', fileType, 'Taille:', file.size);
        
        addFile({
          name: file.name,
          type: fileType,
          size: file.size,
          url: fileUrl,
        });

        setUploadError('');
      };

      reader.onerror = (error) => {
        console.error('❌ Erreur lecture fichier:', file.name, error);
        setUploadError(`Erreur lors de la lecture du fichier: ${file.name}`);
      };

      // Lire le fichier en tant que Data URL (base64)
      console.log('🔄 Début lecture fichier:', file.name);
      reader.readAsDataURL(file);
    });
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

  return (
    <div className="space-y-6">
      {/* Zone de Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload de fichiers
          </CardTitle>
          <CardDescription>
            Glissez-déposez vos fichiers ou cliquez pour sélectionner (Max 10 MB par fichier)
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
            >
              Sélectionner des fichiers
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
          </div>

          {uploadError && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{uploadError}</AlertDescription>
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
          <CardTitle>
            Fichiers uploadés ({filteredFiles.length}{files.length !== filteredFiles.length && ` sur ${files.length}`})
          </CardTitle>
          <CardDescription>
            Gérez vos fichiers et images
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
                            <span>{new Date(file.uploadDate).toLocaleDateString()}</span>
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
                            onClick={() => window.open(file.url, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const a = document.createElement('a');
                            a.href = file.url;
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
                            onClick={() => onFileSelect(file.url)}
                          >
                            Utiliser
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteFile(file.id)}
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
                            onClick={() => deleteFile(file.id)}
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
                            onClick={() => window.open(file.url, '_blank')}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const a = document.createElement('a');
                            a.href = file.url;
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
                            onClick={() => onFileSelect(file.url)}
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Image className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Images</p>
                <p className="text-2xl font-bold">{getFilesByType('image').length}</p>
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
                <p className="text-2xl font-bold">{getFilesByType('document').length}</p>
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
      </div>

      {/* Modal d'édition */}
      <FileEditModal
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