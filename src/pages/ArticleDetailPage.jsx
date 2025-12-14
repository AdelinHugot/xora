import React, { useState, useEffect } from "react";
import { ArrowLeft, Edit, Trash2, Share2, Copy, ExternalLink } from "lucide-react";
import { supabase } from "../lib/supabase";
import Sidebar from "../components/Sidebar";
import UserTopBar from "../components/UserTopBar";

export default function ArticleDetailPage({
  onNavigate,
  sidebarCollapsed,
  onToggleSidebar,
  articleId
}) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Utilisateur non authentifié");

        // Get user's organisation
        const { data: authData, error: authError } = await supabase
          .from("utilisateurs_auth")
          .select("id_organisation")
          .eq("id_auth_user", user.id)
          .single();

        if (authError) throw authError;
        if (!authData) throw new Error("Organisation non trouvée");

        // Fetch the specific article
        const { data: articleData, error: articleError } = await supabase
          .from("articles")
          .select("*")
          .eq("id", articleId)
          .eq("id_organisation", authData.id_organisation)
          .single();

        if (articleError) throw articleError;
        if (!articleData) throw new Error("Article non trouvé");

        setArticle(articleData);
      } catch (err) {
        console.error("Erreur lors de la récupération de l'article:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  const handleGoBack = () => {
    onNavigate("articles");
  };

  const handleEdit = () => {
    console.log("Éditer l'article:", article.id);
  };

  const handleDelete = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", articleId);

      if (error) throw error;

      alert("Article supprimé avec succès");
      onNavigate("articles");
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      alert("Erreur lors de la suppression: " + err.message);
    }
  };

  const handleCopyArticle = () => {
    if (!article) return;

    const text = `${article.titre}
${article.categorie}
${article.contenu}
${article.tags || ""}`;

    navigator.clipboard.writeText(text);
    alert("Article copié dans le presse-papiers!");
  };

  const sidebarWidth = sidebarCollapsed ? 72 : 256;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Sidebar
          currentPage="articles"
          onNavigate={onNavigate}
          initialCollapsed={sidebarCollapsed}
          onToggleCollapse={onToggleSidebar}
        />
        <main style={{ marginLeft: `${sidebarWidth}px` }}>
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-600">Chargement de l'article...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Sidebar
          currentPage="articles"
          onNavigate={onNavigate}
          initialCollapsed={sidebarCollapsed}
          onToggleCollapse={onToggleSidebar}
        />
        <main style={{ marginLeft: `${sidebarWidth}px` }}>
          <div className="p-6">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <p className="text-red-600">Erreur: {error}</p>
              <button
                onClick={handleGoBack}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                <ArrowLeft className="size-4" />
                Retour aux articles
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Sidebar
          currentPage="articles"
          onNavigate={onNavigate}
          initialCollapsed={sidebarCollapsed}
          onToggleCollapse={onToggleSidebar}
        />
        <main style={{ marginLeft: `${sidebarWidth}px` }}>
          <div className="p-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <p className="text-gray-600">Article non trouvé</p>
              <button
                onClick={handleGoBack}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                <ArrowLeft className="size-4" />
                Retour aux articles
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Parse tags
  const tagsList = article.tags ? article.tags.split(",").map(t => t.trim()) : [];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Sidebar
        currentPage="articles"
        onNavigate={onNavigate}
        initialCollapsed={sidebarCollapsed}
        onToggleCollapse={onToggleSidebar}
      />
      <main style={{ marginLeft: `${sidebarWidth}px` }}>
        {/* Header */}
        <header className="h-16 border-b bg-white border-neutral-200 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={handleGoBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Retour"
            >
              <ArrowLeft className="size-5 text-gray-600" />
            </button>
            <h1 className="font-bold text-xl lg:text-2xl text-neutral-900 truncate">
              {article.titre}
            </h1>
          </div>
          <UserTopBar onSettingsClick={() => onNavigate("settings-connection")} />
        </header>

        {/* Content */}
        <div className="p-6 lg:p-8">
          <div className="max-w-4xl">
            {/* Main Card */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              {/* Header Section */}
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {article.titre}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                        {article.categorie}
                      </span>
                      {article.est_publie ? (
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                          Publié
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                          Brouillon
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyArticle}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Copier"
                    >
                      <Copy className="size-5 text-gray-600" />
                    </button>
                    <button
                      onClick={handleEdit}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Éditer"
                    >
                      <Edit className="size-5 text-gray-600" />
                    </button>
                    <button
                      onClick={handleDelete}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="size-5 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 space-y-8">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                    Description
                  </h3>
                  <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                    {article.contenu || "Pas de description"}
                  </p>
                </div>

                {/* Slug */}
                {article.slug && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                      Slug
                    </h3>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-900 font-mono text-sm">
                        {article.slug}
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(article.slug);
                          alert("Slug copié!");
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Copier le slug"
                      >
                        <Copy className="size-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Tags */}
                {tagsList.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {tagsList.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
                    Informations
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Vues
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {article.nombre_vues || 0}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Catégorie
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {article.categorie}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Créé le
                      </p>
                      <p className="text-gray-900">
                        {article.cree_le
                          ? new Date(article.cree_le).toLocaleDateString("fr-FR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })
                          : "Pas de date"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Modifié le
                      </p>
                      <p className="text-gray-900">
                        {article.modifie_le
                          ? new Date(article.modifie_le).toLocaleDateString("fr-FR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })
                          : "Pas de date"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 bg-gray-50 p-6 flex justify-end gap-3">
                <button
                  onClick={handleGoBack}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-900 font-medium hover:bg-gray-50 transition-colors"
                >
                  Fermer
                </button>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <Edit className="size-4" />
                  Éditer
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
