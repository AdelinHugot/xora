import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useOrgId } from './useOrgId';

export function useArticles(pageSize = 20) {
  const { orgId, loading: orgLoading } = useOrgId();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(!orgId);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (orgId) {
      fetchArticles(1);
    }
  }, [pageSize, orgId]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const fetchArticles = async (page = 1) => {
    if (!orgId) return;

    try {
      setLoading(true);
      setError(null);
      setCurrentPage(page);

      // Get total count for pagination
      const { count } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('id_organisation', orgId);

      setTotalCount(count || 0);

      // Calculate offset for pagination
      const offset = (page - 1) * pageSize;

      // Fetch articles for this organisation
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select('id, titre, slug, contenu, categorie, tags, est_publie, nombre_vues, cree_le, modifie_le')
        .eq('id_organisation', orgId)
        .order('cree_le', { ascending: false })
        .range(offset, offset + pageSize - 1);

      if (articlesError) throw articlesError;

      console.log(`[useArticles] Fetched ${articlesData?.length || 0} articles (page ${page}/${Math.ceil(totalCount / pageSize)})`, articlesData);

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

  const nextPage = () => {
    if (currentPage < totalPages) {
      fetchArticles(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      fetchArticles(currentPage - 1);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchArticles(page);
    }
  };

  return {
    articles,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    nextPage,
    prevPage,
    goToPage,
    refetch: () => fetchArticles(currentPage)
  };
}
