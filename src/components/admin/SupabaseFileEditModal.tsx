import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { X, Plus, Tag, Folder, Link } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'image' | 'document' | 'other';
  size: number;
  public_url: string;
  created_at: string;
  file_path: string;
  description?: string;
  tags?: string[];
  category?: string;
  projectId?: string;
}

interface SupabaseFileEditModalProps {
  file: FileItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (fileId: string, updates: Partial<FileItem>) => Promise<{ success: boolean; error?: string }>;
  existingCategories: string[];
  existingTags: string[];
}

export default function SupabaseFileEditModal({ 
  file, 
  isOpen, 
  onClose, 
  onSave, 
  existingCategories,
  existingTags 
}: SupabaseFileEditModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    tags: [] as string[],
    projectId: ''
  });
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (file) {
      // Extraire le nom sans extension pour l'édition
      const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');
      setFormData({
        name: nameWithoutExtension,
        description: file.description || '',
        category: file.category || '',
        tags: file.tags || [],
        projectId: file.projectId || ''
      });
    }
  }, [file]);

  const handleSave = async () => {
    if (!file) return;
    
    setIsLoading(true);

    try {
      // Récupérer l'extension du fichier original
      const extension = file.name.match(/\.[^/.]+$/)?.[0] || '';
      const newName = formData.name + extension;

      const result = await onSave(file.id, {
        name: newName,
        description: formData.description,
        category: formData.category === 'none' ? undefined : formData.category,
        tags: formData.tags,
        projectId: formData.projectId || undefined
      });

      if (result.success) {
        onClose();
      } else {
        console.error('Erreur lors de la sauvegarde:', result.error);
        // Ici on pourrait afficher une notification d'erreur
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  if (!file) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Modifier le fichier
          </DialogTitle>
          <DialogDescription>
            Modifiez les informations du fichier "{file.name}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Nom du fichier */}
          <div className="space-y-2">
            <Label htmlFor="name">Nom du fichier</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nom du fichier (sans extension)"
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground">
              Extension actuelle: {file.name.match(/\.[^/.]+$/)?.[0] || 'Aucune'}
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description du fichier..."
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Catégorie */}
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie">
                  {formData.category && (
                    <div className="flex items-center gap-2">
                      <Folder className="h-4 w-4" />
                      {formData.category}
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucune catégorie</SelectItem>
                {existingCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    <div className="flex items-center gap-2">
                      <Folder className="h-4 w-4" />
                      {category}
                    </div>
                  </SelectItem>
                ))}
                {/* Option pour créer une nouvelle catégorie */}
                <SelectItem value="__NEW__">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Nouvelle catégorie
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            {formData.category === '__NEW__' && (
              <Input
                placeholder="Nom de la nouvelle catégorie"
                disabled={isLoading}
                onBlur={(e) => {
                  if (e.target.value.trim()) {
                    setFormData({ ...formData, category: e.target.value.trim() });
                  } else {
                    setFormData({ ...formData, category: '' });
                  }
                }}
              />
            )}
          </div>

          {/* Lier à un projet (pour les PDFs) */}
          {file.type === 'document' && file.name.toLowerCase().endsWith('.pdf') && (
            <div className="space-y-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Label htmlFor="projectId" className="flex items-center gap-2 text-blue-900">
                <Link className="h-4 w-4" />
                Lier au projet (optionnel)
              </Label>
              <Input
                id="projectId"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                placeholder="ID du projet (ex: proj1, proj2, cert1...)"
                className="bg-white"
                disabled={isLoading}
              />
              <p className="text-sm text-blue-700">
                💡 Liez ce PDF à un projet pour qu'il s'affiche quand on clique sur "Voir rapport"<br/>
                <span className="font-mono text-xs">IDs: proj1-proj17, cert1-cert6</span>
              </p>
            </div>
          )}

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ajouter un tag..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button onClick={addTag} size="sm" type="button" disabled={isLoading}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Tags existants suggérés */}
            {existingTags.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Tags suggérés:</p>
                <div className="flex flex-wrap gap-1">
                  {existingTags
                    .filter(tag => !formData.tags.includes(tag))
                    .slice(0, 5)
                    .map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="cursor-pointer text-xs"
                      onClick={() => !isLoading && setFormData({ 
                        ...formData, 
                        tags: [...formData.tags, tag] 
                      })}
                    >
                      + {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Tags actuels */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => !isLoading && removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
