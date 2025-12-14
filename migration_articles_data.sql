-- Migration to add articles_data column to projets table
-- This column will store the JSON array of selected articles for each project

ALTER TABLE public.projets
ADD COLUMN IF NOT EXISTS articles_data jsonb DEFAULT '[]'::jsonb;

-- Add comment explaining the column
COMMENT ON COLUMN public.projets.articles_data IS 'JSON array storing selected articles (electro and sanitaire) for the project';
