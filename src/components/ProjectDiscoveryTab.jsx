import React, { useState, useEffect } from "react";
import { Plus, Search, X } from "lucide-react";
import { debounce } from "../utils/debounce";
import { supabase } from "../lib/supabase";

// Form Components
function ToggleSwitch({ enabled, onChange, disabled = false }) {
  return (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
        enabled ? "bg-neutral-900" : "bg-[#D3D9E5]"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} shadow-[inset_0_1px_2px_rgba(15,23,42,0.1)]`}
    >
      <span
        className={`inline-block h-[22px] w-[22px] transform rounded-full bg-white transition-transform shadow-[0_2px_6px_rgba(15,23,42,0.15)] ${
          enabled ? "translate-x-7" : "translate-x-1"
        }`}
      />
      <span className="sr-only">{enabled ? "Activé" : "Désactivé"}</span>
    </button>
  );
}

function FormSection({ title, children, action, documentCount }) {
  return (
    <section className="bg-white rounded-lg border border-[#ECEEF5] shadow-[0_16px_36px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-[#1F2027]">{title}</h3>
          {documentCount !== undefined && (
            <span className="px-3 py-1 rounded-full border border-[#E9E9E9] bg-white text-xs font-medium text-[#6B7280]">
              {documentCount} document{documentCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
        {action}
      </div>
      <div className="px-6 pb-6">
        <div className="rounded-lg border border-[#ECEEF5] bg-[#F8F9FC] p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

function FormField({ label, children, span = 1, required = false }) {
  const spanClass = span === 2 ? "md:col-span-2" : span === 3 ? "md:col-span-3" : "";

  return (
    <div className={`${spanClass} space-y-2`}>
      <label className="block text-sm font-semibold text-[#2B2E38]">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function SelectInput({ value, onChange, options, placeholder, disabled = false }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full rounded-lg border border-[#E5E5E5] bg-white px-3 py-2.5 text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#6B7280] focus:ring-offset-1 disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF]"
    >
      <option value="">{placeholder}</option>
      {options && options.map((option) => (
        <option key={option.value || option} value={option.value || option}>
          {option.label || option}
        </option>
      ))}
    </select>
  );
}

function DateInput({ value, onChange, disabled = false }) {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full rounded-lg border border-[#E5E5E5] bg-white px-3 py-2.5 text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#6B7280] focus:ring-offset-1 disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF]"
    />
  );
}

function TextInput({ value, onChange, placeholder, type = "text", disabled = false }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full rounded-lg border border-[#E5E5E5] bg-white px-3 py-2.5 text-sm text-[#1F2027] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6B7280] focus:ring-offset-1 disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF]"
    />
  );
}

function ToggleField({ label, enabled, onChange, disabled = false }) {
  return (
    <div className="flex items-center gap-3">
      {label && <span className="text-sm text-[#6B7280]">{label}</span>}
      <ToggleSwitch enabled={enabled} onChange={onChange} disabled={disabled} />
    </div>
  );
}

// Contact Search Modal Component
function ContactSearchModal({ isOpen, onClose, onSelect, organizationId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const searchContacts = async () => {
      if (searchTerm.trim() === "") {
        setContacts([]);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("contacts")
          .select("id, prenom, nom, email, telephone")
          .eq("id_organisation", organizationId)
          .or(
            `prenom.ilike.%${searchTerm}%, nom.ilike.%${searchTerm}%, email.ilike.%${searchTerm}%`
          )
          .limit(10);

        if (error) throw error;
        setContacts(data || []);
      } catch (err) {
        console.error("Erreur lors de la recherche:", err);
        setContacts([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debouncedSearch = debounce(searchContacts, 300);
    debouncedSearch();
  }, [searchTerm, isOpen, organizationId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 max-h-96 flex flex-col">
        <div className="p-4 border-b border-[#E5E5E5] flex items-center justify-between">
          <h3 className="font-semibold">Chercher un contact</h3>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">
            <X className="size-5" />
          </button>
        </div>

        <div className="p-4 border-b border-[#E5E5E5]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Nom, email, téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-[#6B7280]"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-neutral-500 text-sm">Recherche en cours...</div>
          ) : contacts.length === 0 && searchTerm ? (
            <div className="p-4 text-center text-neutral-500 text-sm">Aucun contact trouvé</div>
          ) : (
            contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => {
                  onSelect(contact);
                  onClose();
                }}
                className="w-full px-4 py-3 text-left hover:bg-neutral-50 border-b border-[#E5E5E5] last:border-b-0 transition-colors"
              >
                <div className="font-medium text-sm text-neutral-900">
                  {contact.prenom} {contact.nom}
                </div>
                {contact.email && (
                  <div className="text-xs text-neutral-500">{contact.email}</div>
                )}
                {contact.telephone && (
                  <div className="text-xs text-neutral-500">{contact.telephone}</div>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * ProjectDiscoveryTab Component
 * Gère l'onglet "Découverte" avec sauvegarde automatique en base de données
 */
export default function ProjectDiscoveryTab({ project, onUpdate }) {
  const [formData, setFormData] = useState({
    agency: "",
    referent: "",
    origin: "",
    subOrigin: "",
    sponsorLink: "",
    sponsorLinkId: "",
    siteAddress: "",
    billingAddress: "",
    studyTrade: "",
    workExecution: "",
    artisansNeeded: false,
    artisansList: "",
    signatureDate: "",
    workDates: "",
    installationDate: "",
    budgetLow: "",
    budgetHigh: "",
    globalBudget: "",
    financing: "",
    removal: "",
    installation: "",
    deliveryBy: "",
    technicalPlans: false,
    competitorsCount: "",
    competitors: "",
    competitorBudget: "",
    projectStatus: "",
    buildingPermit: false,
    permitDate: ""
  });

  const [isSaving, setIsSaving] = useState(false);
  const [organizationName, setOrganizationName] = useState("");
  const [employees, setEmployees] = useState([]);
  const [organizationId, setOrganizationId] = useState(null);
  const [contactSearchOpen, setContactSearchOpen] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState(null);

  // Charger les données du projet et les infos de l'organisation
  useEffect(() => {
    if (project) {
      setFormData({
        agency: project.agence || "",
        referent: project.id_referent || "",
        origin: project.origine || "",
        subOrigin: project.sous_origine || "",
        sponsorLink: project.lien_sponsor || "",
        sponsorLinkId: project.lien_sponsor || "",
        siteAddress: project.adresse_chantier || "",
        billingAddress: project.adresse_facturation || "",
        studyTrade: project.metier_etudie || "",
        workExecution: project.execution_travaux || "",
        artisansNeeded: project.artisans_necessaires || false,
        artisansList: project.liste_artisans || "",
        signatureDate: project.date_signature ? project.date_signature : "",
        workDates: project.dates_travaux || "",
        installationDate: project.date_installation ? project.date_installation : "",
        budgetLow: project.budget_bas || "",
        budgetHigh: project.budget_haut || "",
        globalBudget: project.budget_global || "",
        financing: project.financement || "",
        removal: project.enlevement || "",
        installation: project.installation || "",
        deliveryBy: project.livre_par || "",
        technicalPlans: project.plans_techniques || false,
        competitorsCount: project.nombre_concurrents || "",
        competitors: project.concurrents || "",
        competitorBudget: project.budget_concurrence || "",
        projectStatus: project.statut_projet || "",
        buildingPermit: project.permis_construire || false,
        permitDate: project.date_permis ? project.date_permis : ""
      });

      // Fetch organization and employees
      fetchOrganizationData();
    }
  }, [project]);

  const fetchOrganizationData = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's organization
      const { data: authData, error: authError } = await supabase
        .from("utilisateurs_auth")
        .select("id_organisation")
        .eq("id_auth_user", user.id)
        .single();

      if (authError || !authData) return;

      const orgId = authData.id_organisation;
      setOrganizationId(orgId);

      // Get organization details
      const { data: orgData } = await supabase
        .from("organisations")
        .select("nom")
        .eq("id", orgId)
        .single();

      if (orgData) {
        setOrganizationName(orgData.nom);
      }

      // Get employees of the organization
      const { data: employeesData } = await supabase
        .from("utilisateurs")
        .select("id, prenom, nom")
        .eq("id_organisation", orgId);

      if (employeesData) {
        setEmployees(employeesData);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des données:", err);
    }
  };

  const saveToDatabase = async (updatedData) => {
    if (!project || !onUpdate) return;

    setIsSaving(true);
    try {
      const dbUpdates = {
        agence: updatedData.agency || null,
        id_referent: updatedData.referent || null,
        origine: updatedData.origin || null,
        sous_origine: updatedData.subOrigin || null,
        lien_sponsor: updatedData.sponsorLinkId || null,
        adresse_chantier: updatedData.siteAddress || null,
        adresse_facturation: updatedData.billingAddress || null,
        metier_etudie: updatedData.studyTrade || null,
        execution_travaux: updatedData.workExecution || null,
        artisans_necessaires: updatedData.artisansNeeded,
        liste_artisans: updatedData.artisansList || null,
        date_signature: updatedData.signatureDate || null,
        dates_travaux: updatedData.workDates || null,
        date_installation: updatedData.installationDate || null,
        budget_bas: updatedData.budgetLow ? parseFloat(updatedData.budgetLow) : null,
        budget_haut: updatedData.budgetHigh ? parseFloat(updatedData.budgetHigh) : null,
        budget_global: updatedData.globalBudget ? parseFloat(updatedData.globalBudget) : null,
        financement: updatedData.financing || null,
        enlevement: updatedData.removal || null,
        installation: updatedData.installation || null,
        livre_par: updatedData.deliveryBy || null,
        plans_techniques: updatedData.technicalPlans,
        nombre_concurrents: updatedData.competitorsCount ? parseInt(updatedData.competitorsCount) : null,
        concurrents: updatedData.competitors || null,
        budget_concurrence: updatedData.competitorBudget || null,
        statut_projet: updatedData.projectStatus || null,
        permis_construire: updatedData.buildingPermit,
        date_permis: updatedData.permitDate || null
      };

      await onUpdate(dbUpdates);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const debouncedSave = React.useCallback(
    debounce((updatedData) => {
      saveToDatabase(updatedData);
    }, 500),
    [project, onUpdate]
  );

  const updateField = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    // Sauvegarder immédiatement, sans attendre le débounce
    saveToDatabase(updatedData);
  };

  const handleSponsorSelect = (contact) => {
    setSelectedSponsor(contact);
    const sponsorName = `${contact.prenom} ${contact.nom}`;
    updateField("sponsorLink", sponsorName);
    updateField("sponsorLinkId", contact.id);
  };

  return (
    <div className="space-y-6">
      {isSaving && (
        <div className="fixed top-4 right-4 px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm">
          Enregistrement en cours...
        </div>
      )}

      <ContactSearchModal
        isOpen={contactSearchOpen}
        onClose={() => setContactSearchOpen(false)}
        onSelect={handleSponsorSelect}
        organizationId={organizationId}
      />

      {/* Attribution */}
      <FormSection title="Attribution">
        <FormField label="Agence">
          <div className="w-full rounded-lg border border-[#E5E5E5] bg-[#F3F4F6] px-3 py-2.5 text-sm text-[#1F2027]">
            {organizationName || "Chargement..."}
          </div>
        </FormField>
        <FormField label="Agenceur référent">
          <SelectInput
            value={formData.referent}
            onChange={(value) => updateField("referent", value)}
            options={employees.map((emp) => ({
              value: emp.id,
              label: `${emp.prenom} ${emp.nom}`
            }))}
            placeholder="Sélectionner un agenceur"
          />
        </FormField>
      </FormSection>

      {/* Origine du projet */}
      <FormSection title="Origine du Projet">
        <FormField label="Origine de projet">
          <TextInput
            value={formData.origin}
            onChange={(value) => updateField("origin", value)}
            placeholder="Entrer l'origine"
          />
        </FormField>
        <FormField label="Sous origine">
          <TextInput
            value={formData.subOrigin}
            onChange={(value) => updateField("subOrigin", value)}
            placeholder="Entrer la sous-origine"
          />
        </FormField>
        <FormField label="Lien parrain">
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.sponsorLink}
                placeholder="Chercher un contact..."
                readOnly
                className="flex-1 rounded-lg border border-[#E5E5E5] bg-white px-3 py-2.5 text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#6B7280]"
              />
              <button
                onClick={() => setContactSearchOpen(true)}
                className="px-4 py-2.5 rounded-lg border border-[#E5E5E5] bg-white hover:bg-neutral-50 transition-colors flex items-center gap-2"
              >
                <Search className="size-4" />
              </button>
            </div>
            {selectedSponsor && (
              <button
                onClick={() => {
                  setSelectedSponsor(null);
                  updateField("sponsorLink", "");
                  updateField("sponsorLinkId", "");
                }}
                className="text-xs text-neutral-500 hover:text-neutral-700 flex items-center gap-1"
              >
                <X className="size-3" /> Effacer
              </button>
            )}
          </div>
        </FormField>
      </FormSection>

      {/* Projet */}
      <FormSection title="Projet">
        <FormField label="Adresse chantier" span={2}>
          <TextInput
            value={formData.siteAddress}
            onChange={(value) => updateField("siteAddress", value)}
            placeholder="Adresse déjà renseignée lors de la création"
            disabled={true}
          />
        </FormField>
        <FormField label="Métier de l'étude" span={2}>
          <TextInput
            value={formData.studyTrade}
            onChange={(value) => updateField("studyTrade", value)}
            placeholder="Métier déjà renseigné lors de la création"
            disabled={true}
          />
        </FormField>
        <FormField label="Exécution des travaux">
          <SelectInput
            value={formData.workExecution}
            onChange={(value) => updateField("workExecution", value)}
            placeholder="Sélectionner"
          />
        </FormField>
        <FormField label="Artisan(s) nécessaires" span={3}>
          <div className="space-y-3">
            <ToggleField
              label=""
              enabled={formData.artisansNeeded}
              onChange={(value) => updateField("artisansNeeded", value)}
            />
            {formData.artisansNeeded && (
              <SelectInput
                value={formData.artisansList}
                onChange={(value) => updateField("artisansList", value)}
                placeholder="Sélectionner les artisans"
              />
            )}
          </div>
        </FormField>
        <FormField label="Date prévisionnelle signature">
          <DateInput
            value={formData.signatureDate}
            onChange={(value) => updateField("signatureDate", value)}
          />
        </FormField>
        <FormField label="Dates prévisionnel chantier">
          <TextInput
            value={formData.workDates}
            onChange={(value) => updateField("workDates", value)}
            placeholder="Entrer les dates"
          />
        </FormField>
        <FormField label="Date installation cuisine">
          <DateInput
            value={formData.installationDate}
            onChange={(value) => updateField("installationDate", value)}
          />
        </FormField>
      </FormSection>

      {/* Enveloppe financière */}
      <FormSection
        title="Enveloppe financière"
        action={
          <button className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
            <Plus className="size-4" />
            Ajouter une note
          </button>
        }
      >
        <FormField label="Fourchette basse budget">
          <TextInput
            type="number"
            value={formData.budgetLow}
            onChange={(value) => updateField("budgetLow", value)}
            placeholder="0"
          />
        </FormField>
        <FormField label="Fourchette haute budget">
          <TextInput
            type="number"
            value={formData.budgetHigh}
            onChange={(value) => updateField("budgetHigh", value)}
            placeholder="0"
          />
        </FormField>
        <FormField label="Budget global du chantier">
          <TextInput
            type="number"
            value={formData.globalBudget}
            onChange={(value) => updateField("globalBudget", value)}
            placeholder="0"
          />
        </FormField>
        <FormField label="Financement du projet">
          <SelectInput
            value={formData.financing}
            onChange={(value) => updateField("financing", value)}
            options={[
              { value: "etalement", label: "Étalement de paiement" },
              { value: "comptant", label: "Comptant" }
            ]}
            placeholder="Sélectionner"
          />
        </FormField>
      </FormSection>

      {/* Installation */}
      <FormSection title="Installation">
        <FormField label="Dépose">
          <SelectInput
            value={formData.removal}
            onChange={(value) => updateField("removal", value)}
            options={[
              { value: "client", label: "Client" },
              { value: organizationName || "Société", label: organizationName || "Société" },
              { value: "autre", label: "Autre" }
            ]}
            placeholder="Sélectionner"
          />
        </FormField>
        <FormField label="Installation">
          <SelectInput
            value={formData.installation}
            onChange={(value) => updateField("installation", value)}
            options={[
              { value: "client", label: "Client" },
              { value: organizationName || "Société", label: organizationName || "Société" },
              { value: "autre", label: "Autre" }
            ]}
            placeholder="Sélectionner"
          />
        </FormField>
        <FormField label="Livraison à charge de">
          <SelectInput
            value={formData.deliveryBy}
            onChange={(value) => updateField("deliveryBy", value)}
            options={[
              { value: "client", label: "Client" },
              { value: organizationName || "Société", label: organizationName || "Société" },
              { value: "autre", label: "Autre" }
            ]}
            placeholder="Sélectionner"
          />
        </FormField>
        <FormField label="Plans techniques">
          <ToggleField
            label=""
            enabled={formData.technicalPlans}
            onChange={(value) => updateField("technicalPlans", value)}
          />
        </FormField>
      </FormSection>

      {/* Concurrence */}
      <FormSection title="Concurrence">
        <FormField label="Nombre de confrères consultés">
          <TextInput
            type="number"
            value={formData.competitorsCount}
            onChange={(value) => updateField("competitorsCount", value)}
            placeholder="0"
          />
        </FormField>
        <FormField label="Confrères">
          <TextInput
            value={formData.competitors}
            onChange={(value) => updateField("competitors", value)}
            placeholder="Entrer les confrères"
          />
        </FormField>
        <FormField label="Budget">
          <TextInput
            value={formData.competitorBudget}
            onChange={(value) => updateField("competitorBudget", value)}
            placeholder="Montant"
          />
        </FormField>
        <FormField label="Statut des projets">
          <SelectInput
            value={formData.projectStatus}
            onChange={(value) => updateField("projectStatus", value)}
            options={[
              { value: "en-cours", label: "En cours" },
              { value: "abandonnes", label: "Abandonnés" },
              { value: "realises", label: "Réalisés" }
            ]}
            placeholder="Sélectionner"
          />
        </FormField>
      </FormSection>

      {/* Permis de construire */}
      <FormSection title="Permis de construire">
        <FormField label="Permis de construire accordé">
          <ToggleField
            label=""
            enabled={formData.buildingPermit}
            onChange={(value) => updateField("buildingPermit", value)}
          />
        </FormField>
        {formData.buildingPermit && (
          <FormField label="Date d'obtention permis">
            <DateInput
              value={formData.permitDate}
              onChange={(value) => updateField("permitDate", value)}
            />
          </FormField>
        )}
      </FormSection>
    </div>
  );
}
