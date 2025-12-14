-- ============================================================================
-- SCRIPT D'IMPORT DES ARTICLES GÉNÉRIQUES POUR XORA
-- ============================================================================
-- Organisation ID: c8ee7873-1cd2-41bd-acfb-1538d791d621

-- 1. Ajouter la colonne id_organisation à la table articles (si elle n'existe pas)
-- ============================================================================
ALTER TABLE public.articles
ADD COLUMN IF NOT EXISTS id_organisation uuid;

ALTER TABLE public.articles
ADD CONSTRAINT articles_id_organisation_fkey
FOREIGN KEY (id_organisation)
REFERENCES public.organisations(id)
ON DELETE CASCADE;

-- 2. Insérer les articles
-- ============================================================================
-- Les articles sont extraits du fichier Excel "Articles génériques EM pour XORA"
-- Catégorie: Cuisine / Electromenager / Four
INSERT INTO public.articles (titre, slug, contenu, categorie, tags, est_publie, nombre_vues, id_organisation, cree_le, modifie_le)
VALUES
('A/ Four basique', 'four-basique', 'Prix TTC: 400€ - 600€', 'Electromenager', 'Cuisine,Four,Basique', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('B/ Four moyen de gamme', 'four-moyen-gamme', 'Prix TTC: 600€ - 1000€', 'Electromenager', 'Cuisine,Four,Moyen', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('C/ Four avec forte accessoirisation', 'four-accessoirisation', 'Prix TTC: 1000€ - 3500€', 'Electromenager', 'Cuisine,Four,Accessorisé', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('D/ Four avec apport de vapeur', 'four-vapeur', 'Prix TTC: 1200€ - 2500€', 'Electromenager', 'Cuisine,Four,Vapeur', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('E/ Four avec apport vapeur haut de gamme', 'four-vapeur-premium', 'Prix TTC: 2500€ - 5000€', 'Electromenager', 'Cuisine,Four,Vapeur,Premium', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('F/ Four exceptionnel', 'four-exceptionnel', 'Prix TTC: 5000€ - 7000€', 'Electromenager', 'Cuisine,Four,Exceptionnel', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),

-- Catégorie: Cuisine / Electromenager / Micro-ondes
('A/ Micro-ondes posable', 'micro-ondes-posable', 'Prix TTC: 300€ - 700€', 'Electromenager', 'Cuisine,Micro-ondes,Posable', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('B/ Micro-ondes encastré ht 380 mm', 'micro-ondes-encastre-380', 'Prix TTC: 300€ - 900€', 'Electromenager', 'Cuisine,Micro-ondes,Encastré', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('C/ Micro-ondes encastré ht 450 mm', 'micro-ondes-encastre-450', 'Prix TTC: 1200€ - 1800€', 'Electromenager', 'Cuisine,Micro-ondes,Encastré', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),

-- Catégorie: Cuisine / Electromenager / Tiroir chauffe-plat
('A/ Tiroir chauffant petite hauteur pour assiette', 'tiroir-chauffe-assiette', 'Prix TTC: 800€ - 1200€', 'Electromenager', 'Cuisine,Chauffe-plat,Petit', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('B/ Tiroir chauffant grande hauteur pour plat/casserolle', 'tiroir-chauffe-plat', 'Prix TTC: 1200€ - 2000€', 'Electromenager', 'Cuisine,Chauffe-plat,Grand', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),

-- Catégorie: Cuisine / Electromenager / Cafetière encastrée
('A/ Cafetière encastrée basique', 'cafetiere-basique', 'Prix TTC: 1500€ - 2500€', 'Electromenager', 'Cuisine,Cafetière,Basique', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('B/ Cafetière encastrée haut de gamme', 'cafetiere-haut-gamme', 'Prix TTC: 3000€ - 4000€', 'Electromenager', 'Cuisine,Cafetière,Premium', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('C/ Cafetière encastrée premium', 'cafetiere-premium', 'Prix TTC: 4000€ - 5000€', 'Electromenager', 'Cuisine,Cafetière,Premium', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),

-- Catégorie: Cuisine / Electromenager / Plaque de cuisson
('A/ Plaque de cuisson gaz', 'plaque-gaz', 'Prix TTC: 300€ - 700€', 'Electromenager', 'Cuisine,Plaque,Gaz', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('B/ Plaque de cuisson halogène/radiant', 'plaque-halogene-radiant', 'Prix TTC: 300€ - 1000€', 'Electromenager', 'Cuisine,Plaque,Halogène', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('C/ Plaque de cuisson induction 3 ou 4 zones basique', 'plaque-induction-basique', 'Prix TTC: 300€ - 600€', 'Electromenager', 'Cuisine,Plaque,Induction', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('D/ Plaque de cuisson induction 3 ou 4 zones moyen de gamme', 'plaque-induction-moyen', 'Prix TTC: 500€ - 800€', 'Electromenager', 'Cuisine,Plaque,Induction', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('E/ Plaque de cuisson induction grande largeur', 'plaque-induction-grande', 'Prix TTC: 800€ - 1200€', 'Electromenager', 'Cuisine,Plaque,Induction', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),

-- Catégorie: Cuisine / Electromenager / Table de cuisson aspirante
('A/ Plaque de cuisson avec hotte intégrée basique', 'table-cuisson-hotte-basique', 'Prix TTC: 1300€ - 2000€', 'Electromenager', 'Cuisine,Table,Hotte', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('B/ Plaque de cuisson avec hotte intégrée haut de gamme', 'table-cuisson-hotte-premium', 'Prix TTC: 2200€ - 3500€', 'Electromenager', 'Cuisine,Table,Hotte', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('C/ Plaque de cuisson avec hotte intégrée premium', 'table-cuisson-hotte-premium-2', 'Prix TTC: 3500€ - 4500€', 'Electromenager', 'Cuisine,Table,Hotte', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('D/ Plaque de cuisson avec hotte intégrée exceptionnelle', 'table-cuisson-hotte-exception', 'Prix TTC: 5000€ - 10000€', 'Electromenager', 'Cuisine,Table,Hotte', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),

-- Catégorie: Cuisine / Electromenager / Hotte
('A/ Hotte box murale basique', 'hotte-box-murale-basique', 'Prix TTC: 300€ - 500€', 'Electromenager', 'Cuisine,Hotte,Box', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('B/ Hotte box murale moyen/haut de gamme', 'hotte-box-murale-premium', 'Prix TTC: 500€ - 1500€', 'Electromenager', 'Cuisine,Hotte,Box', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('C/ Hotte box ilot basique', 'hotte-box-ilot-basique', 'Prix TTC: 700€ - 1000€', 'Electromenager', 'Cuisine,Hotte,Box,Îlot', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('D/ Hotte box ilot moyen/haut de gamme', 'hotte-box-ilot-premium', 'Prix TTC: 1000€ - 2000€', 'Electromenager', 'Cuisine,Hotte,Box,Îlot', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('E/ Hotte inclinée basique', 'hotte-inclinee-basique', 'Prix TTC: 500€ - 700€', 'Electromenager', 'Cuisine,Hotte,Inclinée', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('F/ Hotte inclinée moyen/haut de gamme', 'hotte-inclinee-premium', 'Prix TTC: 700€ - 1500€', 'Electromenager', 'Cuisine,Hotte,Inclinée', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('G/ Groupe de meuble basique', 'groupe-meuble-basique', 'Prix TTC: 300€ - 400€', 'Electromenager', 'Cuisine,Hotte,Meuble', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('H/ Groupe de meuble moyen/haut de gamme', 'groupe-meuble-premium', 'Prix TTC: 500€ - 1500€', 'Electromenager', 'Cuisine,Hotte,Meuble', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('I/ Plafonnier basique', 'plafonnier-basique', 'Prix TTC: 1200€ - 1600€', 'Electromenager', 'Cuisine,Hotte,Plafonnier', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('J/ Plafonnier moyen / haut de gamme', 'plafonnier-premium', 'Prix TTC: 1500€ - 2500€', 'Electromenager', 'Cuisine,Hotte,Plafonnier', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),

-- Catégorie: Cuisine / Electromenager / Réfrigérateur
('A/ Réfrigérateur intégrable ht 1220 mm basique', 'refrigerateur-1220-basique', 'Prix TTC: 500€ - 800€', 'Electromenager', 'Cuisine,Réfrigérateur,Intégrable', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('B/ Réfrigérateur intégrable ht 1220 mm moyen/haut de gamme', 'refrigerateur-1220-premium', 'Prix TTC: 800€ - 1500€', 'Electromenager', 'Cuisine,Réfrigérateur,Intégrable', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('C/ Réfrigérateur intégrable ht 1780 mm basique', 'refrigerateur-1780-basique', 'Prix TTC: 700€ - 1000€', 'Electromenager', 'Cuisine,Réfrigérateur,Intégrable', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('D/ Réfrigérateur intégrable ht 1780 mm moyen/haut de gamme', 'refrigerateur-1780-premium', 'Prix TTC: 1200€ - 2000€', 'Electromenager', 'Cuisine,Réfrigérateur,Intégrable', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('E/ Réfrigérateur intégrable ht 1780 mm Premium', 'refrigerateur-1780-premium-2', 'Prix TTC: 2000€ - 3000€', 'Electromenager', 'Cuisine,Réfrigérateur,Intégrable', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('F/ Combiné ref+cong intégrable ht 1780 mm basique', 'combine-ref-cong-basique', 'Prix TTC: 800€ - 1000€', 'Electromenager', 'Cuisine,Réfrigérateur,Combiné', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('G/ Combiné ref+cong intégrable ht 1780 mm moyen/haut de gamme', 'combine-ref-cong-premium', 'Prix TTC: 1200€ - 2000€', 'Electromenager', 'Cuisine,Réfrigérateur,Combiné', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('H/ Combiné ref+cong intégrable ht 1780 mm premium', 'combine-ref-cong-premium-2', 'Prix TTC: 2000€ - 3000€', 'Electromenager', 'Cuisine,Réfrigérateur,Combiné', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('I/ Posable basique', 'refrigerateur-posable-basique', 'Prix TTC: 700€ - 1000€', 'Electromenager', 'Cuisine,Réfrigérateur,Posable', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('J/ Posable moyen/haut de gamme', 'refrigerateur-posable-premium', 'Prix TTC: 1000€ - 1500€', 'Electromenager', 'Cuisine,Réfrigérateur,Posable', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('K/ Réfrigérateur "French door" basique', 'refrigerateur-french-door-basique', 'Prix TTC: 1000€ - 1500€', 'Electromenager', 'Cuisine,Réfrigérateur,French-door', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('L/ Réfrigérateur "French door" moyen/haut de gamme', 'refrigerateur-french-door-premium', 'Prix TTC: 1800€ - 3000€', 'Electromenager', 'Cuisine,Réfrigérateur,French-door', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('M/ Réfrigérateur américain basique', 'refrigerateur-americain-basique', 'Prix TTC: 1000€ - 1500€', 'Electromenager', 'Cuisine,Réfrigérateur,Américain', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('N/ Réfrigérateur américain moyen/haut de gamme', 'refrigerateur-americain-premium', 'Prix TTC: 1800€ - 3000€', 'Electromenager', 'Cuisine,Réfrigérateur,Américain', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),

-- Catégorie: Cuisine / Electromenager / Congélateur
('Congélateur intégrable', 'congelateur-integrable', 'Prix TTC: 1000€ - 1500€', 'Electromenager', 'Cuisine,Congélateur', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),

-- Catégorie: Cuisine / Electromenager / Cave à vins
('A/ Cave à vins posable sous plan basique', 'cave-vins-posable-basique', 'Prix TTC: 500€ - 1000€', 'Electromenager', 'Cuisine,Cave-à-vins,Posable', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('B/ Cave à vins posable sous plan moyen/haut de gamme', 'cave-vins-posable-premium', 'Prix TTC: 1000€ - 3000€', 'Electromenager', 'Cuisine,Cave-à-vins,Posable', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('C/ Cave à vins intégrable', 'cave-vins-integrable', 'Prix TTC: 1000€ - 2000€', 'Electromenager', 'Cuisine,Cave-à-vins,Intégrable', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('D/ Cave à vins intégrable moyen/haut de gamme', 'cave-vins-integrable-premium', 'Prix TTC: 2000€ - 3000€', 'Electromenager', 'Cuisine,Cave-à-vins,Intégrable', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),

-- Catégorie: Cuisine / Electromenager / Lave-vaisselle
('A/ Lave-vaisselle intégrable basique', 'lave-vaisselle-basique', 'Prix TTC: 500€ - 700€', 'Electromenager', 'Cuisine,Lave-vaisselle', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('B/ Lave-vaisselle intégrable moyen/haut de gamme', 'lave-vaisselle-premium', 'Prix TTC: 700€ - 1200€', 'Electromenager', 'Cuisine,Lave-vaisselle', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('C/ Lave-vaisselle intégrable premium', 'lave-vaisselle-premium-2', 'Prix TTC: 1200€ - 2000€', 'Electromenager', 'Cuisine,Lave-vaisselle', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),

-- Catégorie: Cuisine / Electromenager / Lave-linge
('A/ Lave-linge intégrable', 'lave-linge-integrable', 'Prix TTC: 1200€ - 1700€', 'Electromenager', 'Cuisine,Lave-linge', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('B/ Lave-linge posable', 'lave-linge-posable', 'Prix TTC: 700€ - 1200€', 'Electromenager', 'Cuisine,Lave-linge', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),

-- Catégorie: Cuisine / Sanitaire / Evier
('A/ Evier à encastrer avec egouttoir basique', 'evier-encastrer-basique', 'Prix TTC: 200€ - 350€', 'Sanitaire', 'Cuisine,Évier', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('B/ Evier à encastrer avec egouttoir moyen/haut de gamme', 'evier-encastrer-premium', 'Prix TTC: 300€ - 600€', 'Sanitaire', 'Cuisine,Évier', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('C/ Cuve sous plan', 'evier-sous-plan', 'Prix TTC: 400€ - 700€', 'Sanitaire', 'Cuisine,Évier,Sous-plan', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('D/ Evier à poser type "timbre d''office"', 'evier-timbre-office', 'Prix TTC: 600€ - 1000€', 'Sanitaire', 'Cuisine,Évier,Office', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),

-- Catégorie: Cuisine / Sanitaire / Mitigeur
('A/ Mitigeur basique', 'mitigeur-basique', 'Prix TTC: 100€ - 200€', 'Sanitaire', 'Cuisine,Mitigeur', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('B/ Mitigeur moyen/haut de gamme', 'mitigeur-premium', 'Prix TTC: 300€ - 500€', 'Sanitaire', 'Cuisine,Mitigeur', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('C/ Mitigeur premium', 'mitigeur-premium-2', 'Prix TTC: 500€ - 1000€', 'Sanitaire', 'Cuisine,Mitigeur', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('D/ Mitigeur filtre "eau pure"', 'mitigeur-filtre-eau-pure', 'Prix TTC: 800€ - 2500€', 'Sanitaire', 'Cuisine,Mitigeur,Filtre', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('E/ Mitigeur multifonctions (eau gazeuse / fraiche / chaude)', 'mitigeur-multifonctions', 'Prix TTC: 2000€ - 4500€', 'Sanitaire', 'Cuisine,Mitigeur,Multifonctions', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),

-- Catégorie: Cuisine / Sanitaire / accessoires sanitaire
('Distributeur savon', 'distributeur-savon', 'Prix TTC: 100€ - 200€', 'Sanitaire', 'Cuisine,Accessoires', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('Egouttoir pliable ou enroulable', 'egouttoir-pliable', 'Prix TTC: 100€ - 200€', 'Sanitaire', 'Cuisine,Accessoires', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('Vidage automatique', 'vidage-automatique', 'Prix TTC: 50€ - 100€', 'Sanitaire', 'Cuisine,Accessoires', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('Panier egouttoir', 'panier-egouttoir', 'Prix TTC: 100€ - 200€', 'Sanitaire', 'Cuisine,Accessoires', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('Planche à découper / égouttoir', 'planche-decouper-egouttoir', 'Prix TTC: 100€ - 150€', 'Sanitaire', 'Cuisine,Accessoires', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('Bonde + trop plein de couleur', 'bonde-trop-plein', 'Prix TTC: 50€ - 100€', 'Sanitaire', 'Cuisine,Accessoires', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now()),
('Cache-bonde de couleur', 'cache-bonde', 'Prix TTC: 20€ - 40€', 'Sanitaire', 'Cuisine,Accessoires', true, 0, 'c8ee7873-1cd2-41bd-acfb-1538d791d621'::uuid, now(), now());

-- 3. Supprimer les anciennes politiques RLS (si elles existent)
-- ============================================================================
DROP POLICY IF EXISTS "Articles - Lire les articles de son organisation" ON public.articles;
DROP POLICY IF EXISTS "Articles - Créer des articles" ON public.articles;
DROP POLICY IF EXISTS "Articles - Modifier les articles de son organisation" ON public.articles;
DROP POLICY IF EXISTS "Articles - Supprimer les articles de son organisation" ON public.articles;

-- 4. Activer RLS sur la table articles
-- ============================================================================
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- 5. Créer les politiques RLS
-- ============================================================================

-- Politique de lecture : Les utilisateurs peuvent lire les articles de leur organisation
CREATE POLICY "Articles - Lire les articles de son organisation"
ON public.articles
FOR SELECT
TO authenticated
USING (
  id_organisation = (
    SELECT id_organisation
    FROM public.utilisateurs_auth
    WHERE id_auth_user = auth.uid()
    LIMIT 1
  )
);

-- Politique de création : Les utilisateurs peuvent créer des articles pour leur organisation
CREATE POLICY "Articles - Créer des articles"
ON public.articles
FOR INSERT
TO authenticated
WITH CHECK (
  id_organisation = (
    SELECT id_organisation
    FROM public.utilisateurs_auth
    WHERE id_auth_user = auth.uid()
    LIMIT 1
  )
);

-- Politique de modification : Les utilisateurs peuvent modifier les articles de leur organisation
-- (optionnel : peuvent aussi vérifier le rôle de l'utilisateur s'il y a un système de permissions)
CREATE POLICY "Articles - Modifier les articles de son organisation"
ON public.articles
FOR UPDATE
TO authenticated
USING (
  id_organisation = (
    SELECT id_organisation
    FROM public.utilisateurs_auth
    WHERE id_auth_user = auth.uid()
    LIMIT 1
  )
)
WITH CHECK (
  id_organisation = (
    SELECT id_organisation
    FROM public.utilisateurs_auth
    WHERE id_auth_user = auth.uid()
    LIMIT 1
  )
);

-- Politique de suppression : Les utilisateurs ne peuvent pas supprimer les articles (articles génériques)
-- Comment: Ce commentaire explique pourquoi il n'y a pas de politique DELETE
-- Les articles génériques doivent être conservés et gérées par un administrateur système uniquement

-- ============================================================================
-- FIN DU SCRIPT D'IMPORT
-- ============================================================================
-- Nombre total d'articles importés: 76
-- Organisation: XORA (c8ee7873-1cd2-41bd-acfb-1538d791d621)
-- Date: 2025-12-14
-- ============================================================================
