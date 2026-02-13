import { createClient } from "@supabase/supabase-js";

// Configuration Supabase - Compatible navigateur et Vite
const getEnvVar = (key: string, defaultValue: string = "") => {
  // 1. Vérifier import.meta.env (Vite)
  if (typeof import.meta !== "undefined" && import.meta.env) {
    const viteKey = key.startsWith("VITE_") ? key : `VITE_${key}`;
    const reactKey = key.startsWith("REACT_APP_") ? key : `REACT_APP_${key}`;
    return import.meta.env[viteKey] || import.meta.env[reactKey] || import.meta.env[key] || defaultValue;
  }
  
  // 2. Vérifier process.env (Node.js / Environnements classiques)
  if (typeof process !== "undefined" && process.env) {
    return process.env[key] || defaultValue;
  }
  
  return defaultValue;
};

// Récupération des variables avec support des préfixes courants
const supabaseUrl = getEnvVar("SUPABASE_URL", "https://ajubxxipfclkgmlpyzvk.supabase.co");
const supabaseAnonKey = getEnvVar("SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqdWJ4eGlwZmNsa2dtbHB5enZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTk0MjYsImV4cCI6MjA3MzUzNTQyNn0.5y5d9yQJmD9H_vZgXQ6p0jPoW4JvnJ3tgerMbEtOWl4");

if (supabaseUrl.includes("ajubxxipfclkgmlpyzvk")) {
  console.warn("⚠️ Attention : Vous utilisez l'URL Supabase par défaut. Assurez-vous d'avoir configuré votre propre projet Supabase via le bouton 'Connect Supabase' ou les variables d'environnement.");
}

// Types pour TypeScript
export interface Database {
  public: {
    Tables: {
      portfolio_files: {
        Row: {
          id: string;
          name: string;
          type: "image" | "document" | "other";
          size: number;
          file_path: string;
          public_url: string;
          description?: string;
          tags?: string[];
          category?: string;
          project_id?: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: "image" | "document" | "other";
          size: number;
          file_path: string;
          public_url: string;
          description?: string;
          tags?: string[];
          category?: string;
          project_id?: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: "image" | "document" | "other";
          size?: number;
          file_path?: string;
          public_url?: string;
          description?: string;
          tags?: string[];
          category?: string;
          project_id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      admin_sessions: {
        Row: {
          id: string;
          user_id: string;
          session_token: string;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_token: string;
          expires_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_token?: string;
          expires_at?: string;
          created_at?: string;
        };
      };
    };
  };
}

// Créer le client Supabase avec validation
const validateUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

if (!validateUrl(supabaseUrl)) {
  console.error("❌ URL Supabase invalide:", supabaseUrl);
}

export const supabase = createClient<Database>(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder",
);

console.log("🔧 Configuration Supabase initialisée");

// Service d'authentification admin
export class AdminAuthService {
  private static readonly ADMIN_EMAIL = "admin@portfolio.local";
  private static readonly ADMIN_PASSWORD = getEnvVar(
    "REACT_APP_ADMIN_PASSWORD",
    "Sogn@ne2K2",
  );

  static async signIn(email: string, password: string) {
    try {
      // Vérifier les identifiants admin
      if (
        email !== this.ADMIN_EMAIL ||
        password !== this.ADMIN_PASSWORD
      ) {
        throw new Error("Identifiants incorrects");
      }

      // Créer une session personnalisée
      const sessionToken = this.generateSessionToken();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 2); // 2 heures

      // Stocker la session
      const { data, error } = await supabase
        .from("admin_sessions")
        .insert({
          user_id: "admin",
          session_token: sessionToken,
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Stocker le token localement
      localStorage.setItem("admin_session_token", sessionToken);
      localStorage.setItem(
        "admin_session_expires",
        expiresAt.toISOString(),
      );

      return { success: true, token: sessionToken };
    } catch (error) {
      console.error("Erreur connexion admin détaillée:", error);
      
      let message = "Erreur de connexion au serveur";
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          message = "Impossible de contacter Supabase. Vérifiez votre connexion internet ou la configuration du projet.";
        } else {
          message = error.message;
        }
      }
      
      return {
        success: false,
        error: message,
      };
    }
  }

  static async verifySession(): Promise<boolean> {
    try {
      const token = localStorage.getItem("admin_session_token");
      const expires = localStorage.getItem(
        "admin_session_expires",
      );

      if (!token || !expires) return false;

      // Vérifier l'expiration
      if (new Date() > new Date(expires)) {
        this.signOut();
        return false;
      }

      // Vérifier en base
      const { data, error } = await supabase
        .from("admin_sessions")
        .select("*")
        .eq("session_token", token)
        .eq("user_id", "admin")
        .gt("expires_at", new Date().toISOString())
        .single();

      return !error && !!data;
    } catch {
      return false;
    }
  }

  static async signOut() {
    try {
      const token = localStorage.getItem("admin_session_token");

      if (token) {
        // Supprimer la session de la base
        await supabase
          .from("admin_sessions")
          .delete()
          .eq("session_token", token);
      }

      // Nettoyer le localStorage
      localStorage.removeItem("admin_session_token");
      localStorage.removeItem("admin_session_expires");

      return { success: true };
    } catch (error) {
      console.error("Erreur déconnexion:", error);
      return { success: false };
    }
  }

  private static generateSessionToken(): string {
    return Array.from(
      crypto.getRandomValues(new Uint8Array(32)),
    )
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  static async cleanExpiredSessions() {
    try {
      await supabase
        .from("admin_sessions")
        .delete()
        .lt("expires_at", new Date().toISOString());
    } catch (error) {
      console.error("Erreur nettoyage sessions:", error);
    }
  }
}

// Service de gestion des fichiers
export class FileService {
  private static readonly BUCKET_NAME = "portfolio-files";

  static async uploadFile(
    file: File,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // Vérifications de sécurité
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (file.size > maxSize) {
        throw new Error("Fichier trop volumineux (max 10MB)");
      }

      if (!allowedTypes.includes(file.type)) {
        throw new Error("Type de fichier non autorisé");
      }

      // Générer un nom unique
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Upload vers Supabase Storage
      const { data: uploadData, error: uploadError } =
        await supabase.storage
          .from(this.BUCKET_NAME)
          .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obtenir l'URL publique
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath);

      // Déterminer le type
      let fileType: "image" | "document" | "other" = "other";
      if (file.type.startsWith("image/")) {
        fileType = "image";
      } else if (
        file.type.includes("pdf") ||
        file.type.includes("document") ||
        file.type.includes("text")
      ) {
        fileType = "document";
      }

      // Enregistrer les métadonnées
      const { data: dbData, error: dbError } = await supabase
        .from("portfolio_files")
        .insert({
          name: file.name,
          type: fileType,
          size: file.size,
          file_path: filePath,
          public_url: urlData.publicUrl,
          user_id: "admin",
        })
        .select()
        .single();

      if (dbError) throw dbError;

      return { success: true, data: dbData };
    } catch (error) {
      console.error("Erreur upload:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erreur d'upload",
      };
    }
  }

  static async getFiles() {
    try {
      const { data, error } = await supabase
        .from("portfolio_files")
        .select("*")
        .eq("user_id", "admin")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Erreur récupération fichiers:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erreur",
      };
    }
  }

  static async deleteFile(fileId: string) {
    try {
      // Récupérer les infos du fichier
      const { data: file, error: fetchError } = await supabase
        .from("portfolio_files")
        .select("file_path")
        .eq("id", fileId)
        .eq("user_id", "admin")
        .single();

      if (fetchError) throw fetchError;

      // Supprimer le fichier du storage
      const { error: storageError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([file.file_path]);

      if (storageError) throw storageError;

      // Supprimer l'entrée de la base
      const { error: dbError } = await supabase
        .from("portfolio_files")
        .delete()
        .eq("id", fileId)
        .eq("user_id", "admin");

      if (dbError) throw dbError;

      return { success: true };
    } catch (error) {
      console.error("Erreur suppression:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erreur de suppression",
      };
    }
  }

  static async getFilesByType(
    type: "image" | "document" | "other",
  ) {
    try {
      const { data, error } = await supabase
        .from("portfolio_files")
        .select("*")
        .eq("user_id", "admin")
        .eq("type", type)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erreur",
      };
    }
  }
}

// Initialisation et nettoyage automatique
if (typeof window !== "undefined") {
  // Nettoyer les sessions expirées au chargement
  AdminAuthService.cleanExpiredSessions();

  // Nettoyer périodiquement (toutes les 30 minutes)
  setInterval(
    () => {
      AdminAuthService.cleanExpiredSessions();
    },
    30 * 60 * 1000,
  );
}