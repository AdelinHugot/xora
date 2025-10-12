// filename: TeamTab.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  Mail,
  Phone,
  Copy,
  Check,
  X,
  AlertCircle,
  UserCircle,
  Edit3,
  Shield,
  Key,
  Power,
  Trash2,
  RefreshCw
} from "lucide-react";

// Mock data generator
const generateMockTeamMembers = () => {
  const roles = ["admin", "sales", "ops", "manager"];
  const roleLabels = {
    admin: "Admin",
    sales: "Commercial",
    ops: "Opérations",
    manager: "Manager"
  };
  const statuses = ["active", "invited", "disabled"];
  const names = [
    "Thomas André",
    "Sophie Martin",
    "Lucas Dubois",
    "Amélie Bernard",
    "Jérémy Petit",
    "Coline Moreau",
    "Pierre Durand",
    "Marie Leroy",
    "Nicolas Bonnet",
    "Emma Garcia"
  ];

  return names.map((name, idx) => ({
    id: `mem_${idx + 1}`,
    name,
    role: roles[idx % roles.length],
    roleLabel: roleLabels[roles[idx % roles.length]],
    email: `${name.toLowerCase().replace(/\s+/g, ".")}@xora.com`,
    phone: `+3360${String(idx + 1).padStart(7, "0")}`,
    avatarUrl: `https://i.pravatar.cc/40?img=${idx + 1}`,
    status: idx === 8 ? "invited" : idx === 9 ? "disabled" : "active",
    projectsInProgress: idx % 4,
    kpis: {
      revenue: { value: 120000 + idx * 10000, target: 300000, pct: (120000 + idx * 10000) / 300000 },
      margin: { value: 48000 + idx * 4000, target: 120000, pct: (48000 + idx * 4000) / 120000 },
      marginRatePct: 0.4 + idx * 0.02,
      winRatePct: 0.35 + idx * 0.03
    },
    lastActivityAt: new Date(2025, 9, 7 - idx, 14, 12).toISOString(),
    createdAt: new Date(2025, 2, 1 + idx, 9, 0).toISOString()
  }));
};

const mockMembers = generateMockTeamMembers();

// Mini Donut Chart Component
function MiniDonut({ percent, size = 28 }) {
  const radius = (size - 4) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent || 0) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        className="text-neutral-200"
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className={`transition-all duration-300 ${
          percent === null ? "text-neutral-300" : "text-violet-600"
        }`}
      />
    </svg>
  );
}

// Invite Member Modal
function InviteMemberModal({ isOpen, onClose, onInvite }) {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "sales",
    phone: "",
    sendEmail: true
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && emailInputRef.current) {
      setTimeout(() => emailInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({ email: "", name: "", role: "sales", phone: "", sendEmail: true });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email requis";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email invalide";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    onInvite(formData);
    onClose();
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Inviter un membre</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"
            aria-label="Fermer"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="invite-email" className="block text-sm font-medium text-neutral-700 mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              ref={emailInputRef}
              id="invite-email"
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, email: e.target.value }));
                if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
              }}
              placeholder="email@exemple.com"
              className={`w-full px-3 py-2 rounded-xl border ${
                errors.email ? "border-red-500" : "border-neutral-200"
              } bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10`}
            />
            {errors.email && (
              <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                <AlertCircle className="size-3" />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          {/* Name */}
          <div>
            <label htmlFor="invite-name" className="block text-sm font-medium text-neutral-700 mb-1.5">
              Nom complet
            </label>
            <input
              id="invite-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Thomas André"
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
            />
          </div>

          {/* Role */}
          <div>
            <label htmlFor="invite-role" className="block text-sm font-medium text-neutral-700 mb-1.5">
              Rôle
            </label>
            <select
              id="invite-role"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
            >
              <option value="sales">Commercial</option>
              <option value="ops">Opérations</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="invite-phone" className="block text-sm font-medium text-neutral-700 mb-1.5">
              Téléphone
            </label>
            <input
              id="invite-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="06 01 02 03 04"
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
            />
          </div>

          {/* Send Email Checkbox */}
          <div className="flex items-center gap-2">
            <input
              id="send-email"
              type="checkbox"
              checked={formData.sendEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, sendEmail: e.target.checked }))}
              className="size-4 rounded border-neutral-300 text-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
            />
            <label htmlFor="send-email" className="text-sm text-neutral-700">
              Envoyer l'invitation par email
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors text-sm font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50 transition-colors text-sm font-medium"
            >
              {isSubmitting ? "Envoi..." : "Inviter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Member Card Component
function MemberCard({ member, onAction }) {
  const [showMenu, setShowMenu] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatPercent = (value) => {
    if (value === null || value === undefined) return "—";
    return `${Math.round(value * 100)}%`;
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isDisabled = member.status === "disabled";
  const isInvited = member.status === "invited";

  return (
    <div
      className={`bg-white rounded-2xl border border-neutral-200 p-5 transition-all ${
        isDisabled ? "opacity-60" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {member.avatarUrl ? (
            <img
              src={member.avatarUrl}
              alt={member.name}
              className="size-10 rounded-full object-cover border border-neutral-200 shrink-0"
            />
          ) : (
            <div className="size-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold border border-neutral-200 shrink-0">
              {getInitials(member.name)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-neutral-900 truncate">{member.name}</h3>
            <p className="text-sm text-neutral-500">{member.roleLabel}</p>
          </div>
        </div>

        {/* Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"
            aria-label="Actions"
          >
            <MoreVertical className="size-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl border border-neutral-200 shadow-lg py-1 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewMember(member);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2"
              >
                <UserCircle className="size-4" />
                Voir le profil
              </button>
              <button
                onClick={() => { onAction("edit", member); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2"
              >
                <Edit3 className="size-4" />
                Modifier les infos
              </button>
              <button
                onClick={() => { onAction("changeRole", member); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2"
              >
                <Shield className="size-4" />
                Changer le rôle
              </button>
              <button
                onClick={() => { onAction("resetPassword", member); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2"
              >
                <Key className="size-4" />
                Réinitialiser le mot de passe
              </button>
              {isInvited && (
                <button
                  onClick={() => { onAction("resendInvite", member); setShowMenu(false); }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2"
                >
                  <RefreshCw className="size-4" />
                  Relancer l'invitation
                </button>
              )}
              <div className="my-1 border-t border-neutral-200" />
              <button
                onClick={() => { onAction(isDisabled ? "enable" : "disable", member); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2"
              >
                <Power className="size-4" />
                {isDisabled ? "Réactiver" : "Désactiver"}
              </button>
              <button
                onClick={() => { onAction("delete", member); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2 text-red-600"
              >
                <Trash2 className="size-4" />
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {member.projectsInProgress > 0 && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">
            {member.projectsInProgress} projet{member.projectsInProgress > 1 ? "s" : ""} en cours
          </span>
        )}
        {isDisabled && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            Désactivé
          </span>
        )}
      </div>

      {/* Invited Banner */}
      {isInvited && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-sm">
          <span className="text-amber-800">Invitation envoyée</span>
          <button
            onClick={() => onAction("resendInvite", member)}
            className="text-amber-700 hover:text-amber-900 font-medium"
          >
            Relancer
          </button>
        </div>
      )}

      {/* Contact Info */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-neutral-600 group">
          <Mail className="size-4 shrink-0" />
          <a
            href={`mailto:${member.email}`}
            className="truncate hover:text-neutral-900"
          >
            {member.email}
          </a>
          <button
            onClick={() => handleCopy(member.email, "email")}
            className="ml-auto p-1 hover:bg-neutral-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Copier l'email"
            title={copiedField === "email" ? "Copié" : "Copier"}
          >
            {copiedField === "email" ? (
              <Check className="size-3 text-green-600" />
            ) : (
              <Copy className="size-3" />
            )}
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-600 group">
          <Phone className="size-4 shrink-0" />
          <a
            href={`tel:${member.phone}`}
            className="truncate hover:text-neutral-900"
          >
            {member.phone}
          </a>
          <button
            onClick={() => handleCopy(member.phone, "phone")}
            className="ml-auto p-1 hover:bg-neutral-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Copier le téléphone"
            title={copiedField === "phone" ? "Copié" : "Copier"}
          >
            {copiedField === "phone" ? (
              <Check className="size-3 text-green-600" />
            ) : (
              <Copy className="size-3" />
            )}
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-200">
        <div className="flex items-center gap-2">
          <MiniDonut percent={member.kpis.revenue.pct} />
          <div className="flex-1 min-w-0">
            <div className="text-xs text-neutral-500 truncate">CA généré</div>
            <div className="text-sm font-semibold text-neutral-900">
              {formatPercent(member.kpis.revenue.pct)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MiniDonut percent={member.kpis.margin.pct} />
          <div className="flex-1 min-w-0">
            <div className="text-xs text-neutral-500 truncate">Marge générée</div>
            <div className="text-sm font-semibold text-neutral-900">
              {formatPercent(member.kpis.margin.pct)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MiniDonut percent={member.kpis.marginRatePct} />
          <div className="flex-1 min-w-0">
            <div className="text-xs text-neutral-500 truncate">Taux de marge</div>
            <div className="text-sm font-semibold text-neutral-900">
              {formatPercent(member.kpis.marginRatePct)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MiniDonut percent={member.kpis.winRatePct} />
          <div className="flex-1 min-w-0">
            <div className="text-xs text-neutral-500 truncate">Taux de transfo.</div>
            <div className="text-sm font-semibold text-neutral-900">
              {formatPercent(member.kpis.winRatePct)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Member Row Component for List View
function MemberRow({ member, onAction, onViewMember }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRowClick = (e) => {
    // Don't navigate if clicking on the action menu
    if (!menuRef.current?.contains(e.target)) {
      onViewMember(member);
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatPercent = (value) => {
    if (value === null || value === undefined) return "—";
    return `${Math.round(value * 100)}%`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            Actif
          </span>
        );
      case "invited":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            Invitation en attente
          </span>
        );
      case "disabled":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            Désactivé
          </span>
        );
      default:
        return null;
    }
  };

  const isDisabled = member.status === "disabled";
  const isInvited = member.status === "invited";

  return (
    <tr
      onClick={handleRowClick}
      className={`border-b border-neutral-200 hover:bg-neutral-50 transition-colors cursor-pointer ${isDisabled ? "opacity-60" : ""}`}
    >
      {/* Avatar + Name */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          {member.avatarUrl ? (
            <img
              src={member.avatarUrl}
              alt={member.name}
              className="size-10 rounded-full object-cover border border-neutral-200 shrink-0"
            />
          ) : (
            <div className="size-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold border border-neutral-200 shrink-0">
              {getInitials(member.name)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="font-medium text-neutral-900 truncate">{member.name}</div>
            <div className="text-sm text-neutral-500 truncate">{member.email}</div>
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="px-4 py-4">
        <span className="text-sm text-neutral-700">{member.roleLabel}</span>
      </td>

      {/* Phone */}
      <td className="px-4 py-4">
        <a href={`tel:${member.phone}`} className="text-sm text-neutral-600 hover:text-neutral-900">
          {member.phone}
        </a>
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        {getStatusBadge(member.status)}
      </td>

      {/* Projects */}
      <td className="px-4 py-4 text-center">
        <span className="text-sm text-neutral-900 font-medium">
          {member.projectsInProgress}
        </span>
      </td>

      {/* KPIs */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-1">
          <MiniDonut percent={member.kpis.revenue.pct} size={24} />
          <span className="text-xs text-neutral-600">{formatPercent(member.kpis.revenue.pct)}</span>
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-1">
          <MiniDonut percent={member.kpis.margin.pct} size={24} />
          <span className="text-xs text-neutral-600">{formatPercent(member.kpis.margin.pct)}</span>
        </div>
      </td>

      <td className="px-4 py-4">
        <span className="text-sm text-neutral-700">{formatPercent(member.kpis.marginRatePct)}</span>
      </td>

      <td className="px-4 py-4">
        <span className="text-sm text-neutral-700">{formatPercent(member.kpis.winRatePct)}</span>
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"
            aria-label="Actions"
          >
            <MoreVertical className="size-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl border border-neutral-200 shadow-lg py-1 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewMember(member);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2"
              >
                <UserCircle className="size-4" />
                Voir le profil
              </button>
              <button
                onClick={() => { onAction("edit", member); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2"
              >
                <Edit3 className="size-4" />
                Modifier les infos
              </button>
              <button
                onClick={() => { onAction("changeRole", member); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2"
              >
                <Shield className="size-4" />
                Changer le rôle
              </button>
              <button
                onClick={() => { onAction("resetPassword", member); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2"
              >
                <Key className="size-4" />
                Réinitialiser le mot de passe
              </button>
              {isInvited && (
                <button
                  onClick={() => { onAction("resendInvite", member); setShowMenu(false); }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2"
                >
                  <RefreshCw className="size-4" />
                  Relancer l'invitation
                </button>
              )}
              <div className="my-1 border-t border-neutral-200" />
              <button
                onClick={() => { onAction(isDisabled ? "enable" : "disable", member); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2"
              >
                <Power className="size-4" />
                {isDisabled ? "Réactiver" : "Désactiver"}
              </button>
              <button
                onClick={() => { onAction("delete", member); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2 text-red-600"
              >
                <Trash2 className="size-4" />
                Supprimer
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

// Main Team Tab Component
export default function TeamTab({ onNavigate }) {
  const [members, setMembers] = useState(mockMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter members
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      member.phone.includes(debouncedQuery) ||
      member.roleLabel.toLowerCase().includes(debouncedQuery.toLowerCase());

    const matchesRole = !roleFilter || member.role === roleFilter;
    const matchesStatus = !statusFilter || member.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleInvite = (formData) => {
    console.log("Inviting:", formData);
    // Simulate adding new invited member
    const newMember = {
      id: `mem_${Date.now()}`,
      name: formData.name || formData.email.split("@")[0],
      role: formData.role,
      roleLabel: { admin: "Admin", sales: "Commercial", ops: "Opérations", manager: "Manager" }[formData.role],
      email: formData.email,
      phone: formData.phone,
      avatarUrl: "",
      status: "invited",
      projectsInProgress: 0,
      kpis: {
        revenue: { value: 0, target: 300000, pct: 0 },
        margin: { value: 0, target: 120000, pct: 0 },
        marginRatePct: 0,
        winRatePct: 0
      },
      createdAt: new Date().toISOString()
    };
    setMembers(prev => [newMember, ...prev]);
    alert("Invitation envoyée");
  };

  const handleViewMember = (member) => {
    if (onNavigate) {
      onNavigate(`team-member-${member.id}`);
    }
  };

  const handleAction = (action, member) => {
    console.log(`Action: ${action} for member:`, member);

    switch (action) {
      case "disable":
        if (confirm(`Le membre ${member.name} ne pourra plus se connecter. Continuer ?`)) {
          setMembers(prev =>
            prev.map(m => (m.id === member.id ? { ...m, status: "disabled" } : m))
          );
          alert("Compte désactivé");
        }
        break;
      case "enable":
        setMembers(prev =>
          prev.map(m => (m.id === member.id ? { ...m, status: "active" } : m))
        );
        alert("Compte réactivé");
        break;
      case "delete":
        if (confirm(`Suppression définitive de ${member.name} après 7 jours. Continuer ?`)) {
          setMembers(prev => prev.filter(m => m.id !== member.id));
          alert("Membre supprimé");
        }
        break;
      case "resendInvite":
        alert("Invitation relancée");
        break;
      case "resetPassword":
        alert("Email de réinitialisation envoyé");
        break;
      default:
        alert(`Action "${action}" pour ${member.name}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un membre"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
          />
        </div>

        {/* Filters */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
        >
          <option value="">Tous les rôles</option>
          <option value="admin">Admin</option>
          <option value="sales">Commercial</option>
          <option value="ops">Opérations</option>
          <option value="manager">Manager</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
        >
          <option value="">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="invited">Invité en attente</option>
          <option value="disabled">Désactivé</option>
        </select>

        {/* Add Member Button */}
        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition-colors flex items-center gap-2 justify-center whitespace-nowrap"
        >
          <Plus className="size-4" />
          <span>Ajouter un membre</span>
        </button>
      </div>

      {/* Members List Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Collaborateur
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Téléphone
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Projets
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  CA généré
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Marge
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Taux marge
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Taux transfo.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {filteredMembers.map((member) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  onAction={handleAction}
                  onViewMember={handleViewMember}
                />
              ))}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-500">Aucun membre trouvé</p>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <InviteMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvite={handleInvite}
      />
    </div>
  );
}
