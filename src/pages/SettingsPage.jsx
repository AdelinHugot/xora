// filename: SettingsPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Camera, X, Eye, EyeOff, Check, AlertCircle, Building2, Shield, Users, Wifi, Plus, Pencil, Trash2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import UserTopBar from "../components/UserTopBar";
import TeamTab from "../components/TeamTab";
import CompanyTab from "../components/CompanyTab";
import ConnectionsTab from "../components/ConnectionsTab";

// Mock initial user data
const mockUserData = {
  id: "usr_123",
  civility: "Mr",
  firstName: "Thomas",
  lastName: "André",
  email: "andre.thomas@gmail.com",
  phone: "+33601020304",
  avatarUrl: "https://i.pravatar.cc/128?img=12",
  role: "admin"
};

// Format phone for display (E.164 to FR format)
const formatPhoneForDisplay = (phone) => {
  if (!phone) return "";
  // Remove +33 and format as 06 01 02 03 04
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("33")) {
    const local = cleaned.substring(2);
    return local.replace(/(\d{2})(?=\d)/g, "$1 ");
  }
  return phone;
};

// Format phone for storage (any format to E.164)
const formatPhoneForStorage = (phone) => {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    return "+33" + cleaned.substring(1);
  }
  if (cleaned.startsWith("33")) {
    return "+" + cleaned;
  }
  return "+" + cleaned;
};

// Validate email
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validate name (2-64 chars, letters, spaces, hyphens, apostrophes)
const validateName = (name) => {
  if (!name || name.length < 2 || name.length > 64) return false;
  const regex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
  return regex.test(name);
};

// Validate phone (FR format)
const validatePhone = (phone) => {
  if (!phone) return true; // Optional field
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length >= 9 && cleaned.length <= 15;
};

// Validate password strength
const validatePassword = (password) => {
  if (password.length < 12) return false;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  return hasLetter && hasNumber;
};

// Get password strength indicator
const getPasswordStrength = (password) => {
  if (password.length === 0) return { label: "", color: "" };
  if (password.length < 8) return { label: "Faible", color: "text-red-600" };
  if (password.length < 12) return { label: "Moyen", color: "text-amber-600" };
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  if (hasLetter && hasNumber && hasSpecial) return { label: "Fort", color: "text-green-600" };
  if (hasLetter && hasNumber) return { label: "Correct", color: "text-blue-600" };
  return { label: "Moyen", color: "text-amber-600" };
};

// Tabs configuration
const TABS = [
  { id: "company", label: "Société", icon: Building2 },
  { id: "role", label: "Rôle", icon: Shield },
  { id: "team", label: "Équipe", icon: Users, count: 10 },
  { id: "connection", label: "Connexion", icon: Wifi }
];

// Avatar Upload Modal
function AvatarUploadModal({ isOpen, onClose, currentAvatar, onSave }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(currentAvatar);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setError("Format non supporté. Utilisez PNG ou JPG.");
      return;
    }

    // Validate file size (5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Fichier trop volumineux (max 5 Mo).");
      return;
    }

    setError("");
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!selectedFile) return;

    setUploading(true);

    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 1000));

    onSave(preview);
    setUploading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Changer l'avatar</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"
            aria-label="Fermer"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Preview */}
          <div className="flex justify-center">
            <div className="relative">
              <img
                src={preview || "https://via.placeholder.com/128"}
                alt="Aperçu"
                className="size-32 rounded-full object-cover border-2 border-neutral-200"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors"
                aria-label="Sélectionner une image"
              >
                <Camera className="size-4" />
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileSelect}
            className="hidden"
          />

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="text-xs text-neutral-500 text-center">
            PNG ou JPG, maximum 5 Mo
          </div>

          <div className="flex gap-2 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors text-sm font-medium"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={!selectedFile || uploading}
              className="flex-1 px-4 py-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {uploading ? "Envoi..." : "Enregistrer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Profile Tab Component
function ProfileTab({ userData, onUpdate }) {
  const [formData, setFormData] = useState({
    civility: userData.civility || "",
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    email: userData.email || "",
    phone: formatPhoneForDisplay(userData.phone || ""),
    avatarUrl: userData.avatarUrl || ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false
  });
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);

    // Clear error on change
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleFieldBlur = (field) => {
    // Soft validation on blur
    const value = formData[field];
    let error = "";

    switch (field) {
      case "firstName":
      case "lastName":
        if (!validateName(value)) {
          error = "2 à 64 caractères, lettres uniquement";
        }
        break;
      case "email":
        if (!validateEmail(value)) {
          error = "Adresse e-mail invalide";
        }
        break;
      case "phone":
        if (value && !validatePhone(value)) {
          error = "Numéro de téléphone invalide";
        }
        break;
    }

    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};

    if (!formData.firstName || !validateName(formData.firstName)) {
      newErrors.firstName = "Prénom requis (2-64 caractères)";
    }
    if (!formData.lastName || !validateName(formData.lastName)) {
      newErrors.lastName = "Nom requis (2-64 caractères)";
    }
    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = "Adresse e-mail invalide";
    }
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = "Numéro de téléphone invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSave = async () => {
    if (!validateProfileForm()) return;

    setIsSaving(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const updatedData = {
      ...formData,
      phone: formatPhoneForStorage(formData.phone)
    };

    onUpdate(updatedData);
    setHasUnsavedChanges(false);
    setIsSaving(false);

    // Show success toast (you can implement a toast system)
    alert("Profil mis à jour");
  };

  const handlePasswordChange = async () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Mot de passe actuel requis";
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = "Nouveau mot de passe requis";
    } else if (!validatePassword(passwordData.newPassword)) {
      newErrors.newPassword = "Minimum 12 caractères, 1 lettre, 1 chiffre";
    }
    if (passwordData.currentPassword === passwordData.newPassword) {
      newErrors.newPassword = "Le nouveau mot de passe doit être différent";
    }

    setPasswordErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsPasswordSaving(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate random error for demo
    if (Math.random() > 0.7) {
      setPasswordErrors({ currentPassword: "Mot de passe incorrect" });
      setIsPasswordSaving(false);
      return;
    }

    setPasswordData({ currentPassword: "", newPassword: "" });
    setIsPasswordSaving(false);
    alert("Mot de passe mis à jour");
  };

  const handleAvatarSave = (newAvatarUrl) => {
    setFormData(prev => ({ ...prev, avatarUrl: newAvatarUrl }));
    setHasUnsavedChanges(true);
  };

  const handleAvatarDelete = () => {
    setFormData(prev => ({ ...prev, avatarUrl: "" }));
    setHasUnsavedChanges(true);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const isProfileFormValid = () => {
    return formData.firstName && formData.lastName && formData.email &&
           Object.keys(errors).length === 0;
  };

  const isPasswordFormValid = () => {
    return passwordData.currentPassword && passwordData.newPassword &&
           validatePassword(passwordData.newPassword) &&
           passwordData.currentPassword !== passwordData.newPassword;
  };

  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Personal Information Card */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">Coordonnées personnelles</h3>

        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              {formData.avatarUrl ? (
                <img
                  src={formData.avatarUrl}
                  alt="Avatar"
                  className="size-24 rounded-full object-cover border-2 border-neutral-200"
                />
              ) : (
                <div className="size-24 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold border-2 border-neutral-200">
                  {getInitials(formData.firstName, formData.lastName)}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAvatarModal(true)}
                className="px-4 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors text-sm font-medium"
              >
                Changer
              </button>
              {formData.avatarUrl && (
                <button
                  onClick={handleAvatarDelete}
                  className="px-4 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors text-sm font-medium text-red-600"
                >
                  Supprimer
                </button>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Civility */}
            <div>
              <label htmlFor="civility" className="block text-sm font-medium text-neutral-700 mb-1.5">
                Civilité
              </label>
              <select
                id="civility"
                value={formData.civility}
                onChange={(e) => handleFieldChange("civility", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
              >
                <option value="">Sélectionner</option>
                <option value="Mr">M.</option>
                <option value="Mme">Mme</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-1.5">
                Prénom <span className="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleFieldChange("firstName", e.target.value)}
                onBlur={() => handleFieldBlur("firstName")}
                placeholder="Thomas"
                className={`w-full px-3 py-2 rounded-xl border ${
                  errors.firstName ? "border-red-500" : "border-neutral-200"
                } bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900`}
                aria-invalid={errors.firstName ? "true" : "false"}
                aria-describedby={errors.firstName ? "firstName-error" : undefined}
              />
              {errors.firstName && (
                <div id="firstName-error" className="flex items-center gap-1 mt-1 text-xs text-red-600">
                  <AlertCircle className="size-3" />
                  <span>{errors.firstName}</span>
                </div>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-1.5">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleFieldChange("lastName", e.target.value)}
                onBlur={() => handleFieldBlur("lastName")}
                placeholder="André"
                className={`w-full px-3 py-2 rounded-xl border ${
                  errors.lastName ? "border-red-500" : "border-neutral-200"
                } bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900`}
                aria-invalid={errors.lastName ? "true" : "false"}
                aria-describedby={errors.lastName ? "lastName-error" : undefined}
              />
              {errors.lastName && (
                <div id="lastName-error" className="flex items-center gap-1 mt-1 text-xs text-red-600">
                  <AlertCircle className="size-3" />
                  <span>{errors.lastName}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">
                Adresse e-mail <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                onBlur={() => handleFieldBlur("email")}
                placeholder="andre.thomas@gmail.com"
                className={`w-full px-3 py-2 rounded-xl border ${
                  errors.email ? "border-red-500" : "border-neutral-200"
                } bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900`}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <div id="email-error" className="flex items-center gap-1 mt-1 text-xs text-red-600">
                  <AlertCircle className="size-3" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Phone */}
            <div className="md:col-span-2">
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1.5">
                Téléphone
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                onBlur={() => handleFieldBlur("phone")}
                placeholder="06 01 02 03 04"
                className={`w-full px-3 py-2 rounded-xl border ${
                  errors.phone ? "border-red-500" : "border-neutral-200"
                } bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900`}
                aria-invalid={errors.phone ? "true" : "false"}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
              {errors.phone && (
                <div id="phone-error" className="flex items-center gap-1 mt-1 text-xs text-red-600">
                  <AlertCircle className="size-3" />
                  <span>{errors.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-neutral-200">
            <button
              onClick={handleProfileSave}
              disabled={!hasUnsavedChanges || !isProfileFormValid() || isSaving}
              className="px-6 py-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Check className="size-4" />
                  <span>Enregistrer</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Password Card */}
      <div className="lg:col-span-1 bg-white rounded-2xl border border-neutral-200 p-6 h-fit">
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">Mot de passe</h3>

        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-neutral-700 mb-1.5">
              Mot de passe actuel
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                type={showPassword.current ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => {
                  setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }));
                  if (passwordErrors.currentPassword) {
                    setPasswordErrors(prev => ({ ...prev, currentPassword: "" }));
                  }
                }}
                className={`w-full px-3 py-2 pr-10 rounded-xl border ${
                  passwordErrors.currentPassword ? "border-red-500" : "border-neutral-200"
                } bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900`}
                aria-invalid={passwordErrors.currentPassword ? "true" : "false"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                aria-label={showPassword.current ? "Masquer" : "Afficher"}
              >
                {showPassword.current ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {passwordErrors.currentPassword && (
              <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                <AlertCircle className="size-3" />
                <span>{passwordErrors.currentPassword}</span>
              </div>
            )}
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-700 mb-1.5">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPassword.new ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => {
                  setPasswordData(prev => ({ ...prev, newPassword: e.target.value }));
                  if (passwordErrors.newPassword) {
                    setPasswordErrors(prev => ({ ...prev, newPassword: "" }));
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && isPasswordFormValid()) {
                    handlePasswordChange();
                  }
                }}
                className={`w-full px-3 py-2 pr-10 rounded-xl border ${
                  passwordErrors.newPassword ? "border-red-500" : "border-neutral-200"
                } bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900`}
                aria-invalid={passwordErrors.newPassword ? "true" : "false"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                aria-label={showPassword.new ? "Masquer" : "Afficher"}
              >
                {showPassword.new ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {passwordData.newPassword && (
              <div className={`mt-1 text-xs font-medium ${passwordStrength.color}`}>
                {passwordStrength.label}
              </div>
            )}
            {passwordErrors.newPassword && (
              <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                <AlertCircle className="size-3" />
                <span>{passwordErrors.newPassword}</span>
              </div>
            )}
            <div className="mt-2 text-xs text-neutral-500">
              Minimum 12 caractères, 1 lettre et 1 chiffre
            </div>
          </div>

          {/* Save Password Button */}
          <div className="pt-4">
            <button
              onClick={handlePasswordChange}
              disabled={!isPasswordFormValid() || isPasswordSaving}
              className="w-full px-4 py-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              {isPasswordSaving ? (
                <>
                  <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Check className="size-4" />
                  <span>Enregistrer</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Avatar Upload Modal */}
      <AvatarUploadModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        currentAvatar={formData.avatarUrl}
        onSave={handleAvatarSave}
      />
    </div>
  );
}

// Mock roles data
const mockRoles = [
  {
    id: "role_1",
    name: "Administrateur",
    description: "Accès complet à toutes les fonctionnalités",
    usersCount: 2,
    permissions: ["all"],
    color: "violet"
  },
  {
    id: "role_2",
    name: "Manager",
    description: "Gestion d'équipe et de projets",
    usersCount: 5,
    permissions: ["projects", "team", "reports"],
    color: "blue"
  },
  {
    id: "role_3",
    name: "Commercial",
    description: "Accès aux clients et devis",
    usersCount: 8,
    permissions: ["clients", "quotes", "calendar"],
    color: "green"
  },
  {
    id: "role_4",
    name: "Technicien",
    description: "Suivi des interventions",
    usersCount: 12,
    permissions: ["projects", "calendar"],
    color: "orange"
  }
];

// Role Tab Component
function RoleTab() {
  const [roles, setRoles] = useState(mockRoles);
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  const handleDeleteRole = (roleId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce rôle ?")) {
      setRoles(roles.filter(role => role.id !== roleId));
    }
  };

  const getRoleColorClasses = (color) => {
    const colors = {
      violet: "bg-violet-100 text-violet-700 border-violet-200",
      blue: "bg-blue-100 text-blue-700 border-blue-200",
      green: "bg-green-100 text-green-700 border-green-200",
      orange: "bg-orange-100 text-orange-700 border-orange-200"
    };
    return colors[color] || colors.blue;
  };

  return (
    <div>
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Gestion des rôles</h3>
            <p className="text-sm text-neutral-500 mt-1">
              Gérez les rôles et permissions de votre équipe
            </p>
          </div>
          <button
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 transition-colors"
          >
            <Plus className="size-4" />
            Ajouter un rôle
          </button>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          {roles.map((role) => (
            <div
              key={role.id}
              className="border border-neutral-200 rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              {/* Role Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-neutral-900">{role.name}</h4>
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getRoleColorClasses(role.color)}`}>
                      {role.usersCount}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 line-clamp-2">
                    {role.description}
                  </p>
                </div>
              </div>

              {/* Permissions Preview */}
              <div className="mb-4">
                <div className="text-xs font-medium text-neutral-600 mb-2">Permissions</div>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 3).map((perm, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-1 text-xs text-neutral-600"
                    >
                      {perm}
                    </span>
                  ))}
                  {role.permissions.length > 3 && (
                    <span className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-1 text-xs text-neutral-500">
                      +{role.permissions.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-neutral-100">
                <button
                  onClick={() => console.log("Modifier", role.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <Pencil className="size-3" />
                  Modifier
                </button>
                <button
                  onClick={() => handleDeleteRole(role.id)}
                  className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                  aria-label="Supprimer"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {roles.length === 0 && (
          <div className="text-center py-12">
            <Shield className="size-12 text-neutral-300 mx-auto mb-3" />
            <h4 className="text-sm font-medium text-neutral-900 mb-1">Aucun rôle</h4>
            <p className="text-sm text-neutral-500 mb-4">
              Commencez par créer votre premier rôle
            </p>
            <button
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 transition-colors"
            >
              <Plus className="size-4" />
              Ajouter un rôle
            </button>
          </div>
        )}
      </div>

      {/* Add Role Modal Placeholder */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900">Ajouter un rôle</h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"
                aria-label="Fermer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Nom du rôle
                </label>
                <input
                  type="text"
                  placeholder="Ex: Coordinateur"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Description
                </label>
                <textarea
                  placeholder="Description du rôle..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setAddModalOpen(false)}
                  className="flex-1 px-4 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors text-sm font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    alert("Rôle créé");
                    setAddModalOpen(false);
                  }}
                  className="flex-1 px-4 py-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition-colors text-sm font-medium"
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main Settings Page Component
export default function SettingsPage({ onNavigate, sidebarCollapsed, onToggleSidebar, initialTab = "company", onTabNavigate = () => {} }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [userData, setUserData] = useState(mockUserData);
  const sidebarWidth = sidebarCollapsed ? 72 : 256;

  const handleUserUpdate = (updatedData) => {
    setUserData(prev => ({ ...prev, ...updatedData }));
  };

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    onTabNavigate(tabId);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Sidebar
        currentPage="settings"
        onNavigate={onNavigate}
        initialCollapsed={sidebarCollapsed}
        onToggleCollapse={onToggleSidebar}
      />

      <main className="lg:transition-[margin] lg:duration-200 min-h-screen" style={{ marginLeft: `${sidebarWidth}px` }}>
        {/* Topbar */}
        <header className="h-16 border-b border-neutral-200 bg-white/60 backdrop-blur-sm px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-neutral-900">Paramètres</h1>
          </div>
          <UserTopBar settingsActive={true} onSettingsClick={() => onNavigate("settings-connection")} />
        </header>

        {/* Tabs */}
        <div className="border-b border-neutral-200 bg-white">
          <div className="px-4 lg:px-6">
            <nav className="flex gap-8" aria-label="Onglets paramètres">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                      activeTab === tab.id
                        ? "border-neutral-900 text-neutral-900"
                        : "border-transparent text-neutral-500 hover:text-neutral-700"
                    }`}
                    aria-current={activeTab === tab.id ? "page" : undefined}
                  >
                    <Icon className="size-4" />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className="text-neutral-400">({tab.count})</span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1400px] mx-auto p-6">
          {activeTab === "company" && (
            <CompanyTab />
          )}
          {activeTab === "role" && (
            <RoleTab />
          )}
          {activeTab === "team" && (
            <TeamTab onNavigate={onNavigate} />
          )}
          {activeTab === "connection" && (
            <ConnectionsTab />
          )}
        </div>
      </main>
    </div>
  );
}
