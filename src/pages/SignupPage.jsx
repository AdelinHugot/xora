import React, { useState } from "react";
import { UserPlus, AlertCircle, CheckCircle, Building2 } from "lucide-react";
import { useSignup } from "../hooks/useSignup";

export default function SignupPage({ onSignupSuccess, onBackToLogin }) {
  const [step, setStep] = useState(1); // 1: Org info, 2: User info
  const [formData, setFormData] = useState({
    organizationName: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { signup, loading } = useSignup();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const validateStep1 = () => {
    if (!formData.organizationName.trim()) {
      setError("Le nom de l'organisation est requis");
      return false;
    }
    if (formData.organizationName.length < 3) {
      setError("Le nom de l'organisation doit contenir au moins 3 caractères");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("Le prénom et le nom sont requis");
      return false;
    }
    if (!formData.email.trim()) {
      setError("L'email est requis");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("L'email n'est pas valide");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateStep2()) {
      return;
    }

    const result = await signup({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      organizationName: formData.organizationName
    });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onSignupSuccess && onSignupSuccess();
      }, 2000);
    } else {
      setError(result.error || "Une erreur est survenue lors de l'inscription");
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-lg p-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="size-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-3">
              Compte créé avec succès !
            </h2>
            <p className="text-neutral-600 mb-6">
              Votre organisation <strong>{formData.organizationName}</strong> a été créée.
              <br />
              Vous allez être redirigé vers la page de connexion...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6">
            <img
              src="/logo-xora.png"
              alt="Xora Logo"
              className="h-20 w-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Créer votre compte Xora
          </h1>
          <p className="text-neutral-600">
            {step === 1 ? "Commencez par créer votre organisation" : "Complétez vos informations personnelles"}
          </p>
        </div>

        {/* Indicateur d'étapes */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${step === 1 ? 'bg-violet-100 text-violet-700' : 'bg-neutral-100 text-neutral-400'}`}>
            <Building2 className="size-4" />
            <span className="text-sm font-medium">Organisation</span>
          </div>
          <div className="w-8 h-0.5 bg-neutral-200"></div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${step === 2 ? 'bg-violet-100 text-violet-700' : 'bg-neutral-100 text-neutral-400'}`}>
            <UserPlus className="size-4" />
            <span className="text-sm font-medium">Utilisateur</span>
          </div>
        </div>

        {/* Formulaire d'inscription */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex gap-3 items-start">
              <AlertCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNextStep(); } : handleSubmit} className="space-y-6">
            {step === 1 ? (
              // Étape 1 : Organisation
              <>
                <div>
                  <label
                    htmlFor="organizationName"
                    className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                    Nom de votre organisation
                  </label>
                  <input
                    id="organizationName"
                    name="organizationName"
                    type="text"
                    value={formData.organizationName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    placeholder="Ma Société"
                    required
                  />
                  <p className="mt-2 text-xs text-neutral-500">
                    Le nom de votre entreprise ou organisation
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/30"
                >
                  Suivant
                </button>
              </>
            ) : (
              // Étape 2 : Utilisateur
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-neutral-700 mb-2"
                    >
                      Prénom
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                      placeholder="Jean"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-neutral-700 mb-2"
                    >
                      Nom
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                      placeholder="Dupont"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    placeholder="votre.email@exemple.com"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                    Mot de passe
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <p className="mt-2 text-xs text-neutral-500">
                    Minimum 6 caractères
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                    Confirmer le mot de passe
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 border border-neutral-200 text-neutral-700 font-semibold py-3 px-6 rounded-xl hover:bg-neutral-50 transition-all duration-200"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Création...
                      </>
                    ) : (
                      <>
                        <UserPlus className="size-5" />
                        Créer mon compte
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-neutral-500">
          <p>
            Vous avez déjà un compte ?{" "}
            <button
              onClick={onBackToLogin}
              className="text-violet-600 hover:text-violet-700 font-medium"
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
