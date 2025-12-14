import React, { useState, useEffect } from "react";
import { Plus, Trash2, Search } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useArticles } from "../hooks/useArticles";

export default function ProjectArticlesTab({ project }) {
  const { articles, loading: articlesLoading } = useArticles();
  const [projectArticles, setProjectArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch project articles
  useEffect(() => {
    const fetchProjectArticles = async () => {
      try {
        setLoading(true);
        const projectArticlesData = project.articles_data || [];
        setProjectArticles(projectArticlesData);
      } catch (err) {
        console.error("Erreur lors du chargement des articles du projet:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectArticles();
  }, [project]);

  const handleAddArticle = async (article) => {
    try {
      // Add article to project articles list
      const updatedArticles = [...projectArticles, article];
      setProjectArticles(updatedArticles);

      // Save to database
      const { error } = await supabase
        .from("projets")
        .update({ articles_data: updatedArticles })
        .eq("id", project.id);

      if (error) throw error;

      setShowAddModal(false);
    } catch (err) {
      console.error("Erreur lors de l'ajout de l'article:", err);
      alert("Erreur: " + err.message);
    }
  };

  const handleRemoveArticle = async (articleToRemove) => {
    try {
      const updatedArticles = projectArticles.filter(
        a => a.id !== articleToRemove.id
      );
      setProjectArticles(updatedArticles);

      // Save to database
      const { error } = await supabase
        .from("projets")
        .update({ articles_data: updatedArticles })
        .eq("id", project.id);

      if (error) throw error;
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      alert("Erreur: " + err.message);
    }
  };

  const filteredArticles = articles.filter(
    article =>
      !projectArticles.some(pa => pa.id === article.id) &&
      (article.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.categorie.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              Articles du projet
            </h3>
            <p className="text-sm text-neutral-500 mt-1">
              Gérez les articles électroménagers et sanitaires du projet
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium"
          >
            <Plus className="size-4" />
            Ajouter un article
          </button>
        </div>

        {/* Articles List */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          {projectArticles.length > 0 ? (
            <div className="divide-y divide-neutral-200">
              {projectArticles.map((article) => (
                <div
                  key={article.id}
                  className="p-4 flex items-start justify-between gap-4 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-neutral-900">
                      {article.titre}
                    </h4>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                        {article.categorie}
                      </span>
                      {article.tags && (
                        <div className="flex gap-1 flex-wrap">
                          {article.tags.split(",").slice(0, 2).map((tag, i) => (
                            <span
                              key={i}
                              className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {article.contenu && (
                      <p className="text-sm text-neutral-600 mt-2">
                        {article.contenu}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveArticle(article)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600 flex-shrink-0"
                    title="Supprimer"
                  >
                    <Trash2 className="size-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-neutral-500">
              <p>Aucun article ajouté pour le moment</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors font-medium"
              >
                <Plus className="size-4" />
                Ajouter le premier article
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Article Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="border-b border-neutral-200 p-6">
              <h2 className="text-xl font-bold text-neutral-900">
                Ajouter un article au projet
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                Sélectionnez un article parmi la liste disponible
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                <input
                  type="search"
                  placeholder="Rechercher un article..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                />
              </div>

              {/* Articles List */}
              <div className="border border-neutral-200 rounded-lg divide-y divide-neutral-200 max-h-96 overflow-y-auto">
                {articlesLoading ? (
                  <div className="p-6 text-center text-neutral-500">
                    Chargement des articles...
                  </div>
                ) : filteredArticles.length > 0 ? (
                  filteredArticles.map((article) => (
                    <button
                      key={article.id}
                      onClick={() => handleAddArticle(article)}
                      className="w-full text-left p-4 hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-neutral-900">
                            {article.titre}
                          </h4>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                              {article.categorie}
                            </span>
                          </div>
                          {article.contenu && (
                            <p className="text-sm text-neutral-600 mt-2">
                              {article.contenu}
                            </p>
                          )}
                        </div>
                        <Plus className="size-5 text-neutral-400 flex-shrink-0 mt-1" />
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-6 text-center text-neutral-500">
                    Aucun article disponible
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-neutral-200 bg-neutral-50 p-6 flex justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-900 font-medium hover:bg-neutral-100 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
