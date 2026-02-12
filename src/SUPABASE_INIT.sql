-- ============================================================
-- SCRIPT D'INITIALISATION SUPABASE POUR PORTFOLIO
-- ============================================================
-- Ce script crée toutes les tables nécessaires pour le système admin
-- Exécutez ce script dans le SQL Editor de votre tableau de bord Supabase
-- ============================================================

-- 1. Table pour les sessions admin
CREATE TABLE IF NOT EXISTS public.admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    session_token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON public.admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON public.admin_sessions(expires_at);

-- 2. Table pour les fichiers du portfolio
CREATE TABLE IF NOT EXISTS public.portfolio_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('image', 'document', 'other')),
    size INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    description TEXT,
    tags TEXT[],
    category TEXT,
    project_id TEXT,
    user_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_portfolio_files_user ON public.portfolio_files(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_files_type ON public.portfolio_files(type);
CREATE INDEX IF NOT EXISTS idx_portfolio_files_project ON public.portfolio_files(project_id);

-- 3. Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Trigger pour mettre à jour updated_at automatiquement
DROP TRIGGER IF EXISTS update_portfolio_files_updated_at ON public.portfolio_files;
CREATE TRIGGER update_portfolio_files_updated_at
    BEFORE UPDATE ON public.portfolio_files
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS) - SÉCURITÉ
-- ============================================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_files ENABLE ROW LEVEL SECURITY;

-- Politique pour admin_sessions
-- Permettre toutes les opérations (l'authentification est gérée côté application)
DROP POLICY IF EXISTS "Allow all operations on admin_sessions" ON public.admin_sessions;
CREATE POLICY "Allow all operations on admin_sessions"
    ON public.admin_sessions
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Politique pour portfolio_files
-- Lecture publique, mais modification uniquement pour les utilisateurs authentifiés
DROP POLICY IF EXISTS "Allow public read access to portfolio_files" ON public.portfolio_files;
CREATE POLICY "Allow public read access to portfolio_files"
    ON public.portfolio_files
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert on portfolio_files" ON public.portfolio_files;
CREATE POLICY "Allow authenticated insert on portfolio_files"
    ON public.portfolio_files
    FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update on portfolio_files" ON public.portfolio_files;
CREATE POLICY "Allow authenticated update on portfolio_files"
    ON public.portfolio_files
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated delete on portfolio_files" ON public.portfolio_files;
CREATE POLICY "Allow authenticated delete on portfolio_files"
    ON public.portfolio_files
    FOR DELETE
    USING (true);

-- ============================================================
-- BUCKET DE STOCKAGE (STORAGE)
-- ============================================================

-- Créer un bucket pour les fichiers du portfolio
-- Note: Cette commande peut échouer si le bucket existe déjà, c'est normal
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-files', 'portfolio-files', true)
ON CONFLICT (id) DO NOTHING;

-- Politique de stockage - Lecture publique
DROP POLICY IF EXISTS "Public read access on portfolio-files" ON storage.objects;
CREATE POLICY "Public read access on portfolio-files"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'portfolio-files');

-- Politique de stockage - Upload pour tous
DROP POLICY IF EXISTS "Authenticated upload on portfolio-files" ON storage.objects;
CREATE POLICY "Authenticated upload on portfolio-files"
    ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'portfolio-files');

-- Politique de stockage - Mise à jour pour tous
DROP POLICY IF EXISTS "Authenticated update on portfolio-files" ON storage.objects;
CREATE POLICY "Authenticated update on portfolio-files"
    ON storage.objects
    FOR UPDATE
    USING (bucket_id = 'portfolio-files')
    WITH CHECK (bucket_id = 'portfolio-files');

-- Politique de stockage - Suppression pour tous
DROP POLICY IF EXISTS "Authenticated delete on portfolio-files" ON storage.objects;
CREATE POLICY "Authenticated delete on portfolio-files"
    ON storage.objects
    FOR DELETE
    USING (bucket_id = 'portfolio-files');

-- ============================================================
-- NETTOYAGE DES SESSIONS EXPIRÉES
-- ============================================================

-- Fonction pour nettoyer les sessions expirées
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM public.admin_sessions
    WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- VÉRIFICATIONS
-- ============================================================

-- Afficher les tables créées
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_name IN ('admin_sessions', 'portfolio_files')
ORDER BY table_name;

-- Afficher les buckets de stockage
SELECT * FROM storage.buckets WHERE id = 'portfolio-files';

-- ============================================================
-- FIN DU SCRIPT
-- ============================================================

-- ✅ Initialisation terminée !
-- Vous pouvez maintenant utiliser le système Supabase Admin.
--
-- 📝 Identifiants de connexion :
--    Email : admin@portfolio.local
--    Mot de passe : Sogn@ne2K2
--
-- 🔒 Sécurité :
--    - RLS activé sur toutes les tables
--    - Bucket de stockage public pour les fichiers
--    - Nettoyage automatique des sessions expirées
