import React from "react";

function StatusBadge({ tone = "neutral", children }) {
  const tones = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    neutral: "bg-neutral-100 text-neutral-600 border-neutral-200",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${tones[tone]}`}>
      {children}
    </span>
  );
}

function IntegrationIcon({ src, alt, background = "bg-white" }) {
  return (
    <div className={`size-12 rounded-2xl border border-neutral-200 shadow-sm grid place-items-center ${background}`}>
      <img src={src} alt={alt} className="h-8 w-8 object-contain" />
    </div>
  );
}

function GmailCard() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <IntegrationIcon
            src="https://www.gstatic.com/images/branding/product/1x/gmail_2020q4_48dp.png"
            alt="Logo Gmail"
          />
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Gmail</h3>
            <p className="text-sm text-neutral-500 mt-1">
              Connectez votre adresse Google à Xora pour envoyer des mails depuis votre adresse via Xora.
            </p>
          </div>
        </div>
        <StatusBadge tone="success">Connecté</StatusBadge>
      </div>

      <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50/80 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-rose-500 text-white hover:bg-rose-600 transition-colors">
          Se déconnecter
        </button>
        <span className="text-sm text-neutral-500">Actualisé il y a 5&nbsp;min</span>
      </div>
    </div>
  );
}

function HerculeProCard() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <IntegrationIcon
            src="https://res.cloudinary.com/dk4dtgxbe/image/upload/v1716057486/xora/herculepro.png"
            alt="Logo HerculePro"
            background="bg-[#fef2f2]"
          />
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">HerculePro</h3>
            <p className="text-sm text-neutral-500 mt-1">
              Connecter HerculePro à l&apos;application Xora permet de centraliser la gestion de vos devis.
            </p>
          </div>
        </div>
        <StatusBadge>Indisponible</StatusBadge>
      </div>

      <div className="mt-6 rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-3">
        <button
          disabled
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold border border-neutral-200 text-neutral-500 cursor-not-allowed opacity-70"
        >
          Bientôt disponible
        </button>
      </div>
    </div>
  );
}

function InSituCard() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 h-full">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <IntegrationIcon
            src="https://res.cloudinary.com/dk4dtgxbe/image/upload/v1716057486/xora/insitu.png"
            alt="Logo InSitu"
            background="bg-[#fefbf2]"
          />
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">InSitu</h3>
            <p className="text-sm text-neutral-500 mt-1">
              Connecter InSitu à l&apos;application Xora permet de centraliser la gestion de vos devis.
            </p>
          </div>
        </div>
        <StatusBadge>Non connecté</StatusBadge>
      </div>

      <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4 space-y-3">
        <button className="w-full inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors">
          Connecter
        </button>
        <p className="text-sm text-neutral-500 text-center">
          Connectez votre compte pour activer la synchronisation.
        </p>
      </div>
    </div>
  );
}

export default function ConnectionsTab() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900">Connexions</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Gérez l&apos;ensemble de vos intégrations avec les outils externes depuis cette page.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <GmailCard />
          <HerculeProCard />
        </div>
        <InSituCard />
      </div>
    </div>
  );
}
