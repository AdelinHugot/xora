import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Utilisateur non authentifié');

        // Get user's organisation
        const { data: authData, error: authError } = await supabase
          .from('utilisateurs_auth')
          .select('id_organisation')
          .eq('id_auth_user', user.id)
          .single();

        if (authError) throw authError;
        if (!authData) throw new Error('Organisation non trouvée');

        // Fetch articles for this organisation
        const { data: articlesData, error: articlesError } = await supabase
          .from('articles')
          .select('id, titre, slug, contenu, categorie, tags, est_publie, nombre_vues, cree_le, modifie_le')
          .eq('id_organisation', authData.id_organisation)
          .order('cree_le', { ascending: false });

        if (articlesError) throw articlesError;

        console.log(`[useArticles] Fetched ${articlesData?.length || 0} articles`, articlesData);

        // Format articles for display
        const formattedArticles = (articlesData || []).map((article, index) => {
          // Parse tags
          const tagsList = article.tags ? article.tags.split(',') : [];

          // Extract price range from contenu
          const priceMatch = article.contenu?.match(/(\d+)€ - (\d+)€/);
          const minPrice = priceMatch ? parseInt(priceMatch[1]) : 0;
          const maxPrice = priceMatch ? parseInt(priceMatch[2]) : 0;

          return {
            id: article.id,
            titre: article.titre,
            slug: article.slug,
            contenu: article.contenu,
            categorie: article.categorie || 'Sans catégorie',
            tags: article.tags,
            tagsList,
            est_publie: article.est_publie,
            nombre_vues: article.nombre_vues,
            cree_le: article.cree_le,
            modifie_le: article.modifie_le,
            // For backward compatibility with old table structure
            branche: 'Cuisine',
            famille: article.categorie || 'Sanitaire',
            gamme: tagsList.length > 1 ? tagsList.slice(1).join(' / ') : 'Générique',
            fournisseur: 'XORA',
            reference: `XORA-${article.id?.substring(0, 8).toUpperCase()}`,
            pp_ht: minPrice ? Math.round(minPrice / 1.2 * 100) / 100 : 0,
            pv_ttc: maxPrice || minPrice || 0
          };
        });

        setArticles(formattedArticles);
      } catch (err) {
        console.error('Erreur lors de la récupération des articles:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return {
    articles,
    loading,
    error
  };
}
