-- 1. Standardiser les valeurs de la colonne 'statut' vers snake_case
UPDATE public.taches SET statut = 'non_commence' WHERE statut = 'Non commencé' OR statut IS NULL;
UPDATE public.taches SET statut = 'en_cours' WHERE statut = 'En cours';
UPDATE public.taches SET statut = 'termine' WHERE statut = 'Terminé';

-- 2. Supprimer la colonne 'etape_tache' si elle existe (pour éviter la confusion)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'taches' AND column_name = 'etape_tache') THEN
        ALTER TABLE public.taches DROP COLUMN etape_tache;
    END IF;
END $$;
