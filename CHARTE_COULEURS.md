# Charte Graphique Xora - Statuts et Couleurs

## Guide des couleurs pour les pilules de statut

Ce document conserve la charte graphique officielle des statuts utilisée dans l'application Xora.

### Statuts des Projets

#### 1. Prospect
- **Fond (Background)** : `#E0E7FF` (Indigo très clair)
- **Texte (Text)** : `#4F46E5` (Indigo)
- **Classe Tailwind bg** : `bg-[#E0E7FF]`
- **Classe Tailwind text** : `text-[#4F46E5]`
- **Barre de progression** : `bg-indigo-500`

#### 2. Étude client
- **Fond (Background)** : `#EED1F4` (Rose/Violet très clair)
- **Texte (Text)** : `#C970AB` (Violet/Rose)
- **Classe Tailwind bg** : `bg-[#EED1F4]`
- **Classe Tailwind text** : `text-[#C970AB]`
- **Barre de progression** : `bg-violet-500`

#### 3. Dossier technique
- **Fond (Background)** : `#A4E6FE` (Cyan/Bleu ciel clair)
- **Texte (Text)** : `#1A8AB3` (Bleu foncé)
- **Classe Tailwind bg** : `bg-[#A4E6FE]`
- **Classe Tailwind text** : `text-[#1A8AB3]`
- **Barre de progression** : `bg-sky-500`

#### 4. Installation
- **Fond (Background)** : `#A9C9F9` (Bleu royal clair)
- **Texte (Text)** : `#385D95` (Bleu foncé)
- **Classe Tailwind bg** : `bg-[#A9C9F9]`
- **Classe Tailwind text** : `text-[#385D95]`
- **Barre de progression** : `bg-blue-500`

#### 5. SAV
- **Fond (Background)** : `#FFD0C1` (Corail/Orange très clair)
- **Texte (Text)** : `#DF7959` (Orange/Corail)
- **Classe Tailwind bg** : `bg-[#FFD0C1]`
- **Classe Tailwind text** : `text-[#DF7959]`
- **Barre de progression** : `bg-rose-500`

#### 6. Terminé
- **Fond (Background)** : `#76D88B` (Vert clair)
- **Texte (Text)** : `#2A732F` (Vert foncé)
- **Classe Tailwind bg** : `bg-[#76D88B]`
- **Classe Tailwind text** : `text-[#2A732F]`
- **Barre de progression** : `bg-green-500`

---

## Implémentation

### Style des pilules de statut
- **Forme** : Badges arrondis (`rounded-full`)
- **Padding** : `px-4 py-2`
- **Typographie** :
  - Taille : `text-sm`
  - Poids : `font-semibold`
- **Display** : `inline-block`

### Exemple de composant réutilisable

```jsx
function getStatusColors(status) {
  switch (status) {
    case "Prospect":
      return { bg: "#E0E7FF", text: "#4F46E5", progress: "bg-indigo-500" };
    case "Étude client":
      return { bg: "#EED1F4", text: "#C970AB", progress: "bg-violet-500" };
    case "Dossier technique":
      return { bg: "#A4E6FE", text: "#1A8AB3", progress: "bg-sky-500" };
    case "Installation":
      return { bg: "#A9C9F9", text: "#385D95", progress: "bg-blue-500" };
    case "SAV":
      return { bg: "#FFD0C1", text: "#DF7959", progress: "bg-rose-500" };
    case "Terminé":
      return { bg: "#76D88B", text: "#2A732F", progress: "bg-green-500" };
    default:
      return { bg: "#F3F4F6", text: "#1F2937", progress: "bg-neutral-500" };
  }
}
```

---

## Référence source
- **Fichier source** : `src/pages/ProjectTrackingPage.jsx` (fonction `getStatusColors`)
- **Date de mise à jour** : 22 Octobre 2025
