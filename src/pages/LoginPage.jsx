import React, { useState } from "react";
import { LogIn, AlertCircle } from "lucide-react";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const VALID_EMAIL = "contact@xora.fr";
  const VALID_PASSWORD = "Xora123@.";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Valider les identifiants
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      onLogin();
    } else {
      setError("Identifiants incorrects. Veuillez vérifier votre email et mot de passe.");
      setPassword("");
    }
  };

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
            Bienvenue sur Xora
          </h1>
          <p className="text-neutral-600">
            Connectez-vous pour accéder à votre espace
          </p>
        </div>

        {/* Formulaire de connexion */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex gap-3 items-start">
              <AlertCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                placeholder="votre.email@exemple.com"
                required
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Lien mot de passe oublié */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-neutral-300 text-violet-600 focus:ring-violet-500"
                />
                <span className="ml-2 text-sm text-neutral-600">
                  Se souvenir de moi
                </span>
              </label>
              <button
                type="button"
                className="text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
              >
                Mot de passe oublié ?
              </button>
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/30"
            >
              <LogIn className="size-5" />
              Se connecter
            </button>
          </form>

          {/* Séparateur */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-neutral-500">
                Nouveau sur Xora ?
              </span>
            </div>
          </div>

          {/* Lien d'inscription */}
          <button
            type="button"
            className="w-full border border-neutral-200 text-neutral-700 font-semibold py-3 px-6 rounded-xl hover:bg-neutral-50 transition-all duration-200"
          >
            Créer un compte
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-neutral-500">
          <p>
            En vous connectant, vous acceptez nos{" "}
            <button className="text-violet-600 hover:text-violet-700 font-medium">
              Conditions d'utilisation
            </button>
            {" "}et notre{" "}
            <button className="text-violet-600 hover:text-violet-700 font-medium">
              Politique de confidentialité
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
