import React, { useState, useEffect, useRef } from "react";

// SVG Icons
const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M15 5L5 15M5 5l10 10" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckSquareIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M16.667 5L7.5 14.167 3.333 10" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="2.5" y="2.5" width="15" height="15" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M10 3L4.5 8.5 2 6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M10 12L6 8l4-4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 12l4-4-4-4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Mock data for selects
const FOURNISSEURS = ["APPROSINE", "HYDROPLUS", "SANIFIX"];
const UNITES = ["Pièce", "Lot", "m²", "ml"];
const BRANCHES = ["Salle de bain", "Douche", "Baignoire", "Toilettes", "Robinetterie", "Accessoires", "Meuble sdb"];
const FAMILLES = ["Sanitaire vasque sdb", "Sanitaire douche dou", "Sanitaire baignoire bai", "Sanitaire WC", "Robinetterie mitigeur"];
const GAMMES = ["Sanitaire Approsine SDB", "Sanitaire Approsine Douche", "Sanitaire Premium Bain", "Robinetterie Design"];
const STATUTS = ["Actif", "Inactif", "Brouillon"];
const BOX_OPTIONS = ["Oui", "Non"];

const CreateArticleModal = ({ open, onClose, onBack, onNext }) => {
  const [formData, setFormData] = useState({
    nomArticle: "",
    descriptifLong: "",
    nomFournisseur: "",
    uniteMesure: "",
    branche: "",
    famille: "",
    gamme: "",
    prixPublicHT: undefined,
    prixVenteTTC: undefined,
    referenceFournisseur: "",
    referenceInterne: "",
    gererEnStock: undefined,
    statutArticle: "",
    quantiteStock: undefined,
    ecoParticipationHT: undefined,
    boxPresentation: "",
    numeroContratElectromenager: "",
    typeFlux: "Achat"
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);
  const lastFocusedElement = useRef(null);

  // Save last focused element when modal opens
  useEffect(() => {
    if (open) {
      lastFocusedElement.current = document.activeElement;
    } else if (lastFocusedElement.current) {
      lastFocusedElement.current.focus();
    }
  }, [open]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  // Focus on first input when modal opens
  useEffect(() => {
    if (open && firstInputRef.current) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [open]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFormData({
        nomArticle: "",
        descriptifLong: "",
        nomFournisseur: "",
        uniteMesure: "",
        branche: "",
        famille: "",
        gamme: "",
        prixPublicHT: undefined,
        prixVenteTTC: undefined,
        referenceFournisseur: "",
        referenceInterne: "",
        gererEnStock: undefined,
        statutArticle: "",
        quantiteStock: undefined,
        ecoParticipationHT: undefined,
        boxPresentation: "",
        numeroContratElectromenager: "",
        typeFlux: "Achat"
      });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [open]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleNumberChange = (field, value) => {
    if (value === "" || value === null) {
      setFormData(prev => ({ ...prev, [field]: undefined }));
    } else {
      const num = parseFloat(value);
      if (!isNaN(num) && num >= 0) {
        setFormData(prev => ({ ...prev, [field]: num }));
      }
    }
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // Required fields
    if (!formData.nomArticle.trim()) {
      newErrors.nomArticle = "Le nom de l'article est requis";
    }

    if (!formData.nomFournisseur) {
      newErrors.nomFournisseur = "Le nom du fournisseur est requis";
    }

    if (!formData.famille) {
      newErrors.famille = "La famille est requise";
    }

    if (formData.prixPublicHT === undefined || formData.prixPublicHT === null || formData.prixPublicHT < 0) {
      newErrors.prixPublicHT = "Le prix public HT est requis et doit être >= 0";
    }

    // Number validations
    if (formData.prixVenteTTC !== undefined && formData.prixVenteTTC < 0) {
      newErrors.prixVenteTTC = "Le prix doit être >= 0";
    }

    if (formData.quantiteStock !== undefined && formData.quantiteStock < 0) {
      newErrors.quantiteStock = "La quantité doit être >= 0";
    }

    if (formData.ecoParticipationHT !== undefined && formData.ecoParticipationHT < 0) {
      newErrors.ecoParticipationHT = "L'éco-participation doit être >= 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // Trim text fields
    const payload = {
      ...formData,
      nomArticle: formData.nomArticle.trim(),
      descriptifLong: formData.descriptifLong?.trim(),
      referenceFournisseur: formData.referenceFournisseur?.trim(),
      referenceInterne: formData.referenceInterne?.trim(),
      numeroContratElectromenager: formData.numeroContratElectromenager?.trim()
    };

    try {
      if (onNext) {
        await onNext(payload);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      {/* Backdrop with blur */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal Panel */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="article-create-title"
        className="relative w-full max-w-6xl rounded-2xl bg-white shadow-xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 id="article-create-title" className="flex items-center gap-2 text-lg font-semibold">
              <CheckSquareIcon /> Ajouter un article
            </h2>
            <button
              aria-label="Fermer"
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <XIcon />
            </button>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-gray-900">
              <CheckIcon />
            </span>
            <span className="text-sm font-medium">Informations article</span>
            <span className="flex-1 h-px bg-gray-200" />
            {/* Toggle Achat/Vente */}
            <div className="inline-flex rounded-full border border-gray-300 overflow-hidden">
              <button
                type="button"
                onClick={() => handleChange("typeFlux", "Achat")}
                className={`px-3 py-1 text-sm transition-colors ${
                  formData.typeFlux === "Achat" ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                Achat
              </button>
              <button
                type="button"
                onClick={() => handleChange("typeFlux", "Vente")}
                className={`px-3 py-1 text-sm transition-colors ${
                  formData.typeFlux === "Vente" ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                Vente
              </button>
            </div>
          </div>
        </header>

        {/* Body - Scrollable */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Ligne 1: Nom de l'article | Descriptif long */}
          <section className="rounded-xl bg-gray-50 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nomArticle" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nom de l'article <span className="text-red-500">*</span>
                </label>
                <input
                  ref={firstInputRef}
                  type="text"
                  id="nomArticle"
                  value={formData.nomArticle}
                  onChange={(e) => handleChange("nomArticle", e.target.value)}
                  placeholder="Saisir"
                  className={`w-full rounded-lg border ${
                    errors.nomArticle ? "border-red-500" : "border-gray-300"
                  } bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10`}
                  aria-invalid={errors.nomArticle ? "true" : "false"}
                  aria-describedby={errors.nomArticle ? "nomArticle-error" : undefined}
                />
                {errors.nomArticle && (
                  <p id="nomArticle-error" className="mt-1 text-xs text-red-600">
                    {errors.nomArticle}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="descriptifLong" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Descriptif long articles
                </label>
                <input
                  type="text"
                  id="descriptifLong"
                  value={formData.descriptifLong}
                  onChange={(e) => handleChange("descriptifLong", e.target.value)}
                  placeholder="Saisir"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                />
              </div>
            </div>
          </section>

          {/* Ligne 2: Nom fournisseur | Unité mesure */}
          <section className="rounded-xl bg-gray-50 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nomFournisseur" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nom fournisseur <span className="text-red-500">*</span>
                </label>
                <select
                  id="nomFournisseur"
                  value={formData.nomFournisseur}
                  onChange={(e) => handleChange("nomFournisseur", e.target.value)}
                  className={`w-full rounded-lg border ${
                    errors.nomFournisseur ? "border-red-500" : "border-gray-300"
                  } bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10`}
                  aria-invalid={errors.nomFournisseur ? "true" : "false"}
                  aria-describedby={errors.nomFournisseur ? "nomFournisseur-error" : undefined}
                >
                  <option value="">Sélectionner</option>
                  {FOURNISSEURS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                {errors.nomFournisseur && (
                  <p id="nomFournisseur-error" className="mt-1 text-xs text-red-600">
                    {errors.nomFournisseur}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="uniteMesure" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Unité mesure
                </label>
                <select
                  id="uniteMesure"
                  value={formData.uniteMesure}
                  onChange={(e) => handleChange("uniteMesure", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                >
                  <option value="">Sélectionner</option>
                  {UNITES.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Ligne 3: Branche | Famille | Gamme */}
          <section className="rounded-xl bg-gray-50 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="branche" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Branche
                </label>
                <select
                  id="branche"
                  value={formData.branche}
                  onChange={(e) => handleChange("branche", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                >
                  <option value="">Sélectionner</option>
                  {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="famille" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Famille <span className="text-red-500">*</span>
                </label>
                <select
                  id="famille"
                  value={formData.famille}
                  onChange={(e) => handleChange("famille", e.target.value)}
                  className={`w-full rounded-lg border ${
                    errors.famille ? "border-red-500" : "border-gray-300"
                  } bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10`}
                  aria-invalid={errors.famille ? "true" : "false"}
                  aria-describedby={errors.famille ? "famille-error" : undefined}
                >
                  <option value="">Sélectionner</option>
                  {FAMILLES.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                {errors.famille && (
                  <p id="famille-error" className="mt-1 text-xs text-red-600">
                    {errors.famille}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="gamme" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Gamme
                </label>
                <select
                  id="gamme"
                  value={formData.gamme}
                  onChange={(e) => handleChange("gamme", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                >
                  <option value="">Sélectionner</option>
                  {GAMMES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Ligne 4: Prix public HT | Prix de vente TTC */}
          <section className="rounded-xl bg-gray-50 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="prixPublicHT" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Prix public HT <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="prixPublicHT"
                  value={formData.prixPublicHT ?? ""}
                  onChange={(e) => handleNumberChange("prixPublicHT", e.target.value)}
                  placeholder="0"
                  step="0.01"
                  min="0"
                  className={`w-full rounded-lg border ${
                    errors.prixPublicHT ? "border-red-500" : "border-gray-300"
                  } bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10`}
                  aria-invalid={errors.prixPublicHT ? "true" : "false"}
                  aria-describedby={errors.prixPublicHT ? "prixPublicHT-error" : undefined}
                />
                {errors.prixPublicHT && (
                  <p id="prixPublicHT-error" className="mt-1 text-xs text-red-600">
                    {errors.prixPublicHT}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="prixVenteTTC" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Prix de vente TTC
                </label>
                <input
                  type="number"
                  id="prixVenteTTC"
                  value={formData.prixVenteTTC ?? ""}
                  onChange={(e) => handleNumberChange("prixVenteTTC", e.target.value)}
                  placeholder="0"
                  step="0.01"
                  min="0"
                  className={`w-full rounded-lg border ${
                    errors.prixVenteTTC ? "border-red-500" : "border-gray-300"
                  } bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10`}
                  aria-invalid={errors.prixVenteTTC ? "true" : "false"}
                  aria-describedby={errors.prixVenteTTC ? "prixVenteTTC-error" : undefined}
                />
                {errors.prixVenteTTC && (
                  <p id="prixVenteTTC-error" className="mt-1 text-xs text-red-600">
                    {errors.prixVenteTTC}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Ligne 5: Référence fournisseur | Référence interne | Gérer en stock | Statut */}
          <section className="rounded-xl bg-gray-50 p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="referenceFournisseur" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Référence fournisseur
                </label>
                <input
                  type="text"
                  id="referenceFournisseur"
                  value={formData.referenceFournisseur}
                  onChange={(e) => handleChange("referenceFournisseur", e.target.value)}
                  placeholder="Saisir"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                />
              </div>

              <div>
                <label htmlFor="referenceInterne" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Référence interne
                </label>
                <input
                  type="text"
                  id="referenceInterne"
                  value={formData.referenceInterne}
                  onChange={(e) => handleChange("referenceInterne", e.target.value)}
                  placeholder="Saisir"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                />
              </div>

              <div>
                <label htmlFor="gererEnStock" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Gérer en stock
                </label>
                <select
                  id="gererEnStock"
                  value={formData.gererEnStock ?? ""}
                  onChange={(e) => handleChange("gererEnStock", e.target.value || undefined)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                >
                  <option value="">Sélectionner</option>
                  <option value="Oui">Oui</option>
                  <option value="Non">Non</option>
                </select>
              </div>

              <div>
                <label htmlFor="statutArticle" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Statut de l'articles
                </label>
                <select
                  id="statutArticle"
                  value={formData.statutArticle}
                  onChange={(e) => handleChange("statutArticle", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                >
                  <option value="">Sélectionner</option>
                  {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Ligne 6: Quantité stock | Eco participation HT | Box présentation | N° contrat */}
          <section className="rounded-xl bg-gray-50 p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="quantiteStock" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Quantité stock
                </label>
                <input
                  type="number"
                  id="quantiteStock"
                  value={formData.quantiteStock ?? ""}
                  onChange={(e) => handleNumberChange("quantiteStock", e.target.value)}
                  placeholder="0"
                  min="0"
                  step="1"
                  className={`w-full rounded-lg border ${
                    errors.quantiteStock ? "border-red-500" : "border-gray-300"
                  } bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10`}
                  aria-invalid={errors.quantiteStock ? "true" : "false"}
                  aria-describedby={errors.quantiteStock ? "quantiteStock-error" : undefined}
                />
                {errors.quantiteStock && (
                  <p id="quantiteStock-error" className="mt-1 text-xs text-red-600">
                    {errors.quantiteStock}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="ecoParticipationHT" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Eco participation HT
                </label>
                <input
                  type="number"
                  id="ecoParticipationHT"
                  value={formData.ecoParticipationHT ?? ""}
                  onChange={(e) => handleNumberChange("ecoParticipationHT", e.target.value)}
                  placeholder="0"
                  step="0.01"
                  min="0"
                  className={`w-full rounded-lg border ${
                    errors.ecoParticipationHT ? "border-red-500" : "border-gray-300"
                  } bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10`}
                  aria-invalid={errors.ecoParticipationHT ? "true" : "false"}
                  aria-describedby={errors.ecoParticipationHT ? "ecoParticipationHT-error" : undefined}
                />
                {errors.ecoParticipationHT && (
                  <p id="ecoParticipationHT-error" className="mt-1 text-xs text-red-600">
                    {errors.ecoParticipationHT}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="boxPresentation" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Box de présentation
                </label>
                <select
                  id="boxPresentation"
                  value={formData.boxPresentation}
                  onChange={(e) => handleChange("boxPresentation", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                >
                  <option value="">Sélectionner</option>
                  {BOX_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="numeroContratElectromenager" className="block text-sm font-medium text-gray-700 mb-1.5">
                  N° contrat électroménager
                </label>
                <input
                  type="text"
                  id="numeroContratElectromenager"
                  value={formData.numeroContratElectromenager}
                  onChange={(e) => handleChange("numeroContratElectromenager", e.target.value)}
                  placeholder="Saisir"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Footer - Sticky */}
        <footer className="sticky bottom-0 bg-white border-t px-6 py-3 grid grid-cols-2 gap-4 flex-shrink-0">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <ArrowLeftIcon /> Retour
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleNext}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Suivant <ArrowRightIcon />
          </button>
        </footer>
      </div>
    </div>
  );
};

export default CreateArticleModal;
