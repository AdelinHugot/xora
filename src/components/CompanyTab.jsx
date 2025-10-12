// filename: CompanyTab.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Building2,
  MapPin,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Check,
  AlertCircle,
  Upload,
  Download,
  X,
  Copy,
  FileText,
  Presentation,
  Heart,
  Shield
} from "lucide-react";

// Mock company data
const mockCompanyData = {
  id: "comp_001",
  legal: {
    entityType: "SARL",
    companyName: "Travaux confort",
    siren: "901195008",
    siret: "90119500800023",
    vatNumber: "FR66901195008",
    apeCode: "4759A",
    rcCity: "Paris",
    shareCapital: 11500,
    fixedPhone: "+33123456789",
    email: "contact@xora.com",
    website: "https://www.xora.com",
    insuranceName: "AXA",
    insuranceContract: "C-2025-1234"
  },
  addresses: [
    {
      id: "addr_1",
      label: "Siège social",
      type: "head_office",
      formatted: "4 Lotissement les Villas du Roucan, Moussan, France",
      street: "4 Lotissement les Villas du Roucan",
      postalCode: "11120",
      city: "Moussan",
      country: "FR"
    }
  ],
  bank: {
    bankName: "BNP Paribas",
    iban: "FR7630006000011234567890189",
    bic: "BNPAFRPP"
  },
  billingRules: {
    defaultVatPct: 20,
    paymentTerms: "30d_end_of_month",
    invoicePrefix: "FAC-{YYYY}-",
    invoiceCounter: 1283,
    quoteValidityDays: 30,
    lateFeesPctPerMonth: 1.5,
    recoveryFixedFee: 40
  }
};

// Format IBAN for display
const formatIBAN = (iban) => {
  if (!iban) return "";
  return iban.replace(/(.{4})/g, "$1 ").trim();
};

// Validate IBAN (basic)
const validateIBAN = (iban) => {
  const cleaned = iban.replace(/\s/g, "");
  return cleaned.length >= 15 && cleaned.length <= 34 && /^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(cleaned);
};

// Validate SIREN
const validateSIREN = (siren) => {
  const cleaned = siren.replace(/\s/g, "");
  return cleaned.length === 9 && /^\d{9}$/.test(cleaned);
};

// Validate SIRET
const validateSIRET = (siret) => {
  const cleaned = siret.replace(/\s/g, "");
  return cleaned.length === 14 && /^\d{14}$/.test(cleaned);
};

// Validate VAT number
const validateVAT = (vat) => {
  if (!vat) return true;
  return /^FR[0-9A-Z]{2}\d{9}$/.test(vat.replace(/\s/g, ""));
};

// Sub-tabs configuration
const SUB_TABS = [
  { id: "informations", label: "Informations", icon: Building2 },
  { id: "documents", label: "Documents légaux", icon: FileText },
  { id: "commercial", label: "Présentation commerciale", icon: Presentation },
  { id: "loyalty", label: "Fidélisation", icon: Heart },
  { id: "rgpd", label: "RGPD", icon: Shield }
];

// Entity types
const ENTITY_TYPES = [
  { value: "auto_entrepreneur", label: "Auto-entreprise" },
  { value: "ei", label: "EI" },
  { value: "eurl", label: "EURL" },
  { value: "sarl", label: "SARL" },
  { value: "sas", label: "SAS" },
  { value: "sasu", label: "SASU" },
  { value: "sa", label: "SA" },
  { value: "scop", label: "SCOP" },
  { value: "association", label: "Association" }
];

// Address types
const ADDRESS_TYPES = [
  { value: "head_office", label: "Siège social" },
  { value: "office", label: "Bureau" },
  { value: "warehouse", label: "Dépôt" },
  { value: "billing", label: "Facturation" },
  { value: "delivery", label: "Livraison" },
  { value: "other", label: "Autre" }
];

// Address Card Component
function AddressCard({ address, onUpdate, onDelete, canDelete }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [formData, setFormData] = useState(address);

  return (
    <div className="border border-neutral-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 flex-1">
          <MapPin className="size-4 text-neutral-500" />
          <input
            type="text"
            value={formData.label}
            onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
            placeholder="Libellé"
            className="flex-1 px-2 py-1 rounded border border-neutral-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-neutral-100 rounded"
            aria-label={isExpanded ? "Replier" : "Déplier"}
          >
            {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>
          {canDelete && (
            <button
              onClick={onDelete}
              className="p-1 hover:bg-red-50 text-red-600 rounded"
              aria-label="Supprimer"
            >
              <Trash2 className="size-4" />
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3 pt-2 border-t border-neutral-100">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Type d'adresse
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
            >
              {ADDRESS_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Adresse complète
            </label>
            <input
              type="text"
              value={formData.formatted}
              onChange={(e) => setFormData(prev => ({ ...prev, formatted: e.target.value }))}
              placeholder="Rechercher une adresse..."
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
            />
          </div>

          <button
            onClick={() => onUpdate(formData)}
            className="text-sm text-violet-600 hover:text-violet-700 font-medium"
          >
            Mettre à jour
          </button>
        </div>
      )}
    </div>
  );
}

// Informations Tab
function InformationsTab({ companyData, onUpdate }) {
  const [formData, setFormData] = useState(companyData);
  const [addresses, setAddresses] = useState(companyData.addresses || []);
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleFieldChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
    setHasChanges(true);
    if (errors[`${section}.${field}`]) {
      setErrors(prev => ({ ...prev, [`${section}.${field}`]: "" }));
    }
  };

  const addAddress = () => {
    const newAddress = {
      id: `addr_${Date.now()}`,
      label: "Nouvelle adresse",
      type: "office",
      formatted: "",
      street: "",
      postalCode: "",
      city: "",
      country: "FR"
    };
    setAddresses(prev => [...prev, newAddress]);
    setHasChanges(true);
  };

  const updateAddress = (index, updatedAddress) => {
    setAddresses(prev => prev.map((addr, i) => i === index ? updatedAddress : addr));
    setHasChanges(true);
  };

  const deleteAddress = (index) => {
    setAddresses(prev => prev.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.legal.companyName || formData.legal.companyName.length < 2) {
      newErrors["legal.companyName"] = "Raison sociale requise (min 2 caractères)";
    }

    if (formData.legal.siren && !validateSIREN(formData.legal.siren)) {
      newErrors["legal.siren"] = "SIREN invalide (9 chiffres)";
    }

    if (formData.legal.siret && !validateSIRET(formData.legal.siret)) {
      newErrors["legal.siret"] = "SIRET invalide (14 chiffres)";
    }

    if (formData.legal.vatNumber && !validateVAT(formData.legal.vatNumber)) {
      newErrors["legal.vatNumber"] = "N° TVA invalide";
    }

    if (formData.bank.iban && !validateIBAN(formData.bank.iban)) {
      newErrors["bank.iban"] = "IBAN invalide";
    }

    if (!addresses.some(addr => addr.type === "head_office")) {
      newErrors.addresses = "Au moins une adresse de type 'Siège social' est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    onUpdate({ ...formData, addresses });
    setHasChanges(false);
    setIsSaving(false);
    alert("Informations enregistrées");
  };

  const hasHeadOffice = addresses.some(addr => addr.type === "head_office");

  return (
    <div className="space-y-6">
      {/* Carte Société */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">Société</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Entity Type */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Forme juridique
            </label>
            <select
              value={formData.legal.entityType}
              onChange={(e) => handleFieldChange("legal", "entityType", e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
            >
              {ENTITY_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Raison sociale <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.legal.companyName}
              onChange={(e) => handleFieldChange("legal", "companyName", e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border ${
                errors["legal.companyName"] ? "border-red-500" : "border-neutral-200"
              } focus:outline-none focus:ring-2 focus:ring-neutral-900/10`}
            />
            {errors["legal.companyName"] && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="size-3" />
                {errors["legal.companyName"]}
              </p>
            )}
          </div>

          {/* Website */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Site internet
            </label>
            <input
              type="url"
              value={formData.legal.website}
              onChange={(e) => handleFieldChange("legal", "website", e.target.value)}
              placeholder="https://www.exemple.com"
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
            />
          </div>
        </div>

        {/* Addresses */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-neutral-700">
              Adresses
            </label>
            <button
              onClick={addAddress}
              className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
            >
              <Plus className="size-4" />
              Ajouter une adresse
            </button>
          </div>

          {!hasHeadOffice && addresses.length > 0 && (
            <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>Au moins une adresse de type "Siège social" est requise</span>
            </div>
          )}

          <div className="space-y-3">
            {addresses.map((address, index) => (
              <AddressCard
                key={address.id}
                address={address}
                onUpdate={(updated) => updateAddress(index, updated)}
                onDelete={() => deleteAddress(index)}
                canDelete={addresses.length > 1 && address.type !== "head_office"}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Carte Informations légales & bancaires */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">
          Informations légales & bancaires
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* SIREN */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              SIREN
            </label>
            <input
              type="text"
              value={formData.legal.siren}
              onChange={(e) => handleFieldChange("legal", "siren", e.target.value.replace(/\s/g, ""))}
              placeholder="123 456 789"
              maxLength={11}
              className={`w-full px-3 py-2 rounded-xl border ${
                errors["legal.siren"] ? "border-red-500" : "border-neutral-200"
              } focus:outline-none focus:ring-2 focus:ring-neutral-900/10`}
            />
            {errors["legal.siren"] && (
              <p className="mt-1 text-xs text-red-600">{errors["legal.siren"]}</p>
            )}
          </div>

          {/* SIRET */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              SIRET
            </label>
            <input
              type="text"
              value={formData.legal.siret}
              onChange={(e) => handleFieldChange("legal", "siret", e.target.value.replace(/\s/g, ""))}
              placeholder="123 456 789 00023"
              maxLength={17}
              className={`w-full px-3 py-2 rounded-xl border ${
                errors["legal.siret"] ? "border-red-500" : "border-neutral-200"
              } focus:outline-none focus:ring-2 focus:ring-neutral-900/10`}
            />
            {errors["legal.siret"] && (
              <p className="mt-1 text-xs text-red-600">{errors["legal.siret"]}</p>
            )}
          </div>

          {/* VAT Number */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              N° de TVA
            </label>
            <input
              type="text"
              value={formData.legal.vatNumber}
              onChange={(e) => handleFieldChange("legal", "vatNumber", e.target.value.toUpperCase())}
              placeholder="FR12345678901"
              className={`w-full px-3 py-2 rounded-xl border ${
                errors["legal.vatNumber"] ? "border-red-500" : "border-neutral-200"
              } focus:outline-none focus:ring-2 focus:ring-neutral-900/10`}
            />
            {errors["legal.vatNumber"] && (
              <p className="mt-1 text-xs text-red-600">{errors["legal.vatNumber"]}</p>
            )}
          </div>

          {/* APE Code */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Code APE / NAF
            </label>
            <input
              type="text"
              value={formData.legal.apeCode}
              onChange={(e) => handleFieldChange("legal", "apeCode", e.target.value.toUpperCase())}
              placeholder="4759A"
              maxLength={5}
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
            />
          </div>

          {/* RC City */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Ville du RC
            </label>
            <input
              type="text"
              value={formData.legal.rcCity}
              onChange={(e) => handleFieldChange("legal", "rcCity", e.target.value)}
              placeholder="Paris"
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
            />
          </div>

          {/* Share Capital */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Montant du capital (€)
            </label>
            <input
              type="number"
              value={formData.legal.shareCapital}
              onChange={(e) => handleFieldChange("legal", "shareCapital", parseFloat(e.target.value) || 0)}
              min={0}
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
            />
          </div>

          {/* Fixed Phone */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Téléphone fixe
            </label>
            <input
              type="tel"
              value={formData.legal.fixedPhone}
              onChange={(e) => handleFieldChange("legal", "fixedPhone", e.target.value)}
              placeholder="+33 1 23 45 67 89"
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={formData.legal.email}
              onChange={(e) => handleFieldChange("legal", "email", e.target.value)}
              placeholder="contact@exemple.com"
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
            />
          </div>

          {/* Insurance Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Nom assurance
            </label>
            <input
              type="text"
              value={formData.legal.insuranceName}
              onChange={(e) => handleFieldChange("legal", "insuranceName", e.target.value)}
              placeholder="AXA"
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
            />
          </div>

          {/* Insurance Contract */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              N° contrat assurance
            </label>
            <input
              type="text"
              value={formData.legal.insuranceContract}
              onChange={(e) => handleFieldChange("legal", "insuranceContract", e.target.value)}
              placeholder="C-2025-1234"
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
            />
          </div>

          {/* Bank Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Nom banque
            </label>
            <input
              type="text"
              value={formData.bank.bankName}
              onChange={(e) => handleFieldChange("bank", "bankName", e.target.value)}
              placeholder="BNP Paribas"
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
            />
          </div>

          {/* IBAN */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              IBAN
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.bank.iban}
                onChange={(e) => handleFieldChange("bank", "iban", e.target.value.replace(/\s/g, "").toUpperCase())}
                placeholder="FR76 3000 6000 0112 3456 7890 189"
                className={`w-full px-3 py-2 pr-10 rounded-xl border ${
                  errors["bank.iban"] ? "border-red-500" : "border-neutral-200"
                } focus:outline-none focus:ring-2 focus:ring-neutral-900/10`}
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(formData.bank.iban);
                  alert("IBAN copié");
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 rounded"
                aria-label="Copier IBAN"
              >
                <Copy className="size-4 text-neutral-400" />
              </button>
            </div>
            {errors["bank.iban"] && (
              <p className="mt-1 text-xs text-red-600">{errors["bank.iban"]}</p>
            )}
          </div>

          {/* BIC */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Code BIC
            </label>
            <input
              type="text"
              value={formData.bank.bic}
              onChange={(e) => handleFieldChange("bank", "bic", e.target.value.toUpperCase())}
              placeholder="BNPAFRPP"
              maxLength={11}
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
            />
          </div>
        </div>
      </div>

      {/* Floating Save Button */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50 shadow-lg flex items-center gap-2 font-medium"
          >
            {isSaving ? (
              <>
                <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <Check className="size-5" />
                <span>Enregistrer</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// Documents Tab (Placeholder)
function DocumentsTab() {
  const documents = [
    { type: "kbis", label: "Kbis", required: true, expiresAt: "2025-09-01" },
    { type: "urssaf", label: "Attestation URSSAF", required: true },
    { type: "rcpro", label: "RC Pro", required: true },
    { type: "rib", label: "RIB", required: true },
    { type: "logo", label: "Logo officiel", required: false },
    { type: "cgv", label: "Conditions Générales de Vente", required: false }
  ];

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-6">Documents légaux</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div key={doc.type} className="border border-neutral-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-neutral-900">{doc.label}</h4>
              {doc.required && (
                <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                  Requis
                </span>
              )}
            </div>
            <div className="border-2 border-dashed border-neutral-200 rounded-lg p-6 text-center hover:border-neutral-300 transition-colors cursor-pointer">
              <Upload className="size-8 text-neutral-400 mx-auto mb-2" />
              <p className="text-sm text-neutral-500">Déposer ou cliquer</p>
              <p className="text-xs text-neutral-400 mt-1">PDF, PNG, JPG • Max 10 Mo</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Color options for commercial presentation
const COLOR_OPTIONS = [
  { value: "", label: "Sélectionner" },
  { value: "#FFFFFF", label: "Blanc", preview: "#FFFFFF" },
  { value: "#000000", label: "Noir", preview: "#000000" },
  { value: "#1E293B", label: "Gris foncé", preview: "#1E293B" },
  { value: "#64748B", label: "Gris", preview: "#64748B" },
  { value: "#E2E8F0", label: "Gris clair", preview: "#E2E8F0" },
  { value: "#3B82F6", label: "Bleu", preview: "#3B82F6" },
  { value: "#10B981", label: "Vert", preview: "#10B981" },
  { value: "#F59E0B", label: "Orange", preview: "#F59E0B" },
  { value: "#EF4444", label: "Rouge", preview: "#EF4444" },
  { value: "#8B5CF6", label: "Violet", preview: "#8B5CF6" },
  { value: "#EC4899", label: "Rose", preview: "#EC4899" },
];

// Commercial Tab Component
function CommercialTab() {
  const [colors, setColors] = useState({
    background: "",
    title: "",
    content: "",
    other: ""
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleColorChange = (field, value) => {
    setColors(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("Couleurs enregistrées:", colors);
    setHasChanges(false);
    setIsSaving(false);
    alert("Couleurs enregistrées");
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-6">Présentation commerciale</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Background couleur */}
        <div>
          <label htmlFor="backgroundColor" className="block text-sm font-medium text-neutral-700 mb-1.5">
            Background couleur
          </label>
          <div className="relative">
            <select
              id="backgroundColor"
              value={colors.background}
              onChange={(e) => handleColorChange("background", e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 appearance-none pr-10"
            >
              {COLOR_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400 pointer-events-none" />
            {colors.background && (
              <div
                className="absolute left-3 top-1/2 -translate-y-1/2 size-5 rounded border border-neutral-300"
                style={{ backgroundColor: colors.background }}
              />
            )}
          </div>
        </div>

        {/* Titre couleur */}
        <div>
          <label htmlFor="titleColor" className="block text-sm font-medium text-neutral-700 mb-1.5">
            Titre couleur
          </label>
          <div className="relative">
            <select
              id="titleColor"
              value={colors.title}
              onChange={(e) => handleColorChange("title", e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 appearance-none pr-10"
            >
              {COLOR_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400 pointer-events-none" />
            {colors.title && (
              <div
                className="absolute left-3 top-1/2 -translate-y-1/2 size-5 rounded border border-neutral-300"
                style={{ backgroundColor: colors.title }}
              />
            )}
          </div>
        </div>

        {/* Contenu couleur */}
        <div>
          <label htmlFor="contentColor" className="block text-sm font-medium text-neutral-700 mb-1.5">
            Contenu couleur
          </label>
          <div className="relative">
            <select
              id="contentColor"
              value={colors.content}
              onChange={(e) => handleColorChange("content", e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 appearance-none pr-10"
            >
              {COLOR_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400 pointer-events-none" />
            {colors.content && (
              <div
                className="absolute left-3 top-1/2 -translate-y-1/2 size-5 rounded border border-neutral-300"
                style={{ backgroundColor: colors.content }}
              />
            )}
          </div>
        </div>

        {/* Autre couleur (pagination, etc...) */}
        <div>
          <label htmlFor="otherColor" className="block text-sm font-medium text-neutral-700 mb-1.5">
            Autre couleur (pagination, etc...)
          </label>
          <div className="relative">
            <select
              id="otherColor"
              value={colors.other}
              onChange={(e) => handleColorChange("other", e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 appearance-none pr-10"
            >
              {COLOR_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400 pointer-events-none" />
            {colors.other && (
              <div
                className="absolute left-3 top-1/2 -translate-y-1/2 size-5 rounded border border-neutral-300"
                style={{ backgroundColor: colors.other }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Floating Save Button */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50 shadow-lg flex items-center gap-2 font-medium"
          >
            {isSaving ? (
              <>
                <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <Check className="size-5" />
                <span>Enregistrer</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function LoyaltyTab() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Fidélisation</h3>
      <p className="text-neutral-500">Programme de fidélisation à venir</p>
    </div>
  );
}

function RGPDTab() {
  const [rgpdMessage, setRgpdMessage] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleMessageChange = (value) => {
    setRgpdMessage(value);
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("Message RGPD enregistré:", rgpdMessage);
    setHasChanges(false);
    setIsSaving(false);
    alert("Message RGPD enregistré");
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-6">RGPD</h3>

      {/* Encart gris avec le champ de texte */}
      <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6">
        <div>
          <label htmlFor="rgpdMessage" className="block text-sm font-medium text-neutral-700 mb-2">
            Message RGPD
          </label>
          <textarea
            id="rgpdMessage"
            value={rgpdMessage}
            onChange={(e) => handleMessageChange(e.target.value)}
            placeholder="Saisir votre message de conformité RGPD..."
            rows={12}
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 resize-none"
          />
        </div>
      </div>

      {/* Floating Save Button */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50 shadow-lg flex items-center gap-2 font-medium"
          >
            {isSaving ? (
              <>
                <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <Check className="size-5" />
                <span>Enregistrer</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// Main Company Tab Component
export default function CompanyTab() {
  const [activeSubTab, setActiveSubTab] = useState("informations");
  const [companyData, setCompanyData] = useState(mockCompanyData);

  const handleUpdate = (updatedData) => {
    setCompanyData(updatedData);
  };

  return (
    <div>
      {/* Sub-tabs - Sticky */}
      <div className="sticky top-0 z-20 bg-white border-b border-neutral-200 shadow-sm mb-6">
        <div className="flex gap-6 px-6 overflow-x-auto">
          {SUB_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                  activeSubTab === tab.id
                    ? "border-neutral-900 text-neutral-900"
                    : "border-transparent text-neutral-500 hover:text-neutral-700"
                }`}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div>
        {activeSubTab === "informations" && (
          <InformationsTab companyData={companyData} onUpdate={handleUpdate} />
        )}
        {activeSubTab === "documents" && <DocumentsTab />}
        {activeSubTab === "commercial" && <CommercialTab />}
        {activeSubTab === "loyalty" && <LoyaltyTab />}
        {activeSubTab === "rgpd" && <RGPDTab />}
      </div>
    </div>
  );
}
