// Composants SVG pour les icônes du menu
// Les couleurs sont remplacées dynamiquement en fonction de l'état (actif/inactif)

export function DashboardIcon({ color = "currentColor" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.25 11.0625C2.25 10.7518 2.50184 10.5 2.8125 10.5H9.1875C9.49815 10.5 9.75 10.7518 9.75 11.0625V15.1875C9.75 15.4982 9.49815 15.75 9.1875 15.75H2.8125C2.50184 15.75 2.25 15.4982 2.25 15.1875V11.0625Z" fill={color}/>
      <path d="M2.25 2.8125C2.25 2.50184 2.50184 2.25 2.8125 2.25H15.1875C15.4982 2.25 15.75 2.50184 15.75 2.8125V6.9375C15.75 7.24816 15.4982 7.5 15.1875 7.5H2.8125C2.50184 7.5 2.25 7.24816 2.25 6.9375V2.8125Z" fill={color}/>
    </svg>
  );
}

export function AnnuaireIcon({ color = "currentColor" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 14.625V3.375C3 2.33947 3.83947 1.5 4.875 1.5H15V16.5H4.875C3.83947 16.5 3 15.6605 3 14.625ZM3 14.625C3 13.5895 3.83946 12.75 4.87498 12.75H15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function SuiviProjetsIcon({ color = "currentColor" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.25 15.75H15.75M5.25 11.25H12.75M6.75 6.75H11.25M14.25 15.75L9.98715 2.96151C9.84555 2.5366 9.4479 2.25 9 2.25C8.5521 2.25 8.15445 2.5366 8.01285 2.96151L3.75 15.75" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function TachesEtMemoIcon({ color = "currentColor" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.5 3.88501L7.9425 12.45L4.7625 9.27001L5.82 8.21251L7.9425 10.335L15.4425 2.83501L16.5 3.88501ZM14.8425 7.66501C14.94 8.09251 15 8.54251 15 9.00001C15 12.315 12.315 15 9 15C5.685 15 3 12.315 3 9.00001C3 5.68501 5.685 3.00001 9 3.00001C10.185 3.00001 11.28 3.34501 12.21 3.93751L13.29 2.85751C12.0348 1.97217 10.536 1.49788 9 1.50001C4.86 1.50001 1.5 4.86001 1.5 9.00001C1.5 13.14 4.86 16.5 9 16.5C13.14 16.5 16.5 13.14 16.5 9.00001C16.5 8.10751 16.335 7.25251 16.05 6.45751L14.8425 7.66501Z" fill={color}/>
    </svg>
  );
}

export function AgendaIcon({ color = "currentColor" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.25 7.5H15.75M12 1.5V4.5M6 1.5V4.5M3.75 16.5H14.25C15.0784 16.5 15.75 15.8284 15.75 15V4.5C15.75 3.67157 15.0784 3 14.25 3H3.75C2.92157 3 2.25 3.67157 2.25 4.5V15C2.25 15.8284 2.92157 16.5 3.75 16.5Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ArticlesIcon({ color = "currentColor" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 7.5V14.625C15 15.2463 14.4963 15.75 13.875 15.75H4.125C3.50368 15.75 3 15.2463 3 14.625V7.5M7.5 9.75H10.5M2.25 2.25H15.75C16.1642 2.25 16.5 2.58579 16.5 3V6.75C16.5 7.16421 16.1642 7.5 15.75 7.5H2.25C1.83579 7.5 1.5 7.16421 1.5 6.75V3C1.5 2.58579 1.83579 2.25 2.25 2.25Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function KPIIcon({ color = "currentColor" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.25 2.25V15.75H15.75M5.25 12L9.1875 8.0625L11.8125 10.6875L15.75 6.75" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function FacturesIcon({ color = "currentColor" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.7 3H12.75C13.5784 3 14.25 3.67157 14.25 4.5V15C14.25 15.8284 13.5784 16.5 12.75 16.5H5.25C4.42157 16.5 3.75 15.8284 3.75 15V4.5C3.75 3.67157 4.42157 3 5.25 3H6.3M6.75 4.125L6.05364 2.38411C6.01821 2.29552 5.99557 2.20007 6.01373 2.1064C6.08073 1.76088 6.3849 1.5 6.75 1.5H11.25C11.6151 1.5 11.9193 1.76088 11.9863 2.1064C12.0044 2.20007 11.9818 2.29552 11.9464 2.38411L11.25 4.125H6.75Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.75 7.5H11.25" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.75 10.125H11.25M6.75 12.75H9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function DevisIcon({ color = "currentColor" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.125 1.87868V5.625C10.125 6.03921 10.4608 6.375 10.875 6.375H14.6213M6 12.75H11.25M6 9.75H11.25M6 6.75H6.75M13.5 16.5H4.5C3.67157 16.5 3 15.8284 3 15V3C3 2.17157 3.67157 1.5 4.5 1.5H9.1287C9.5265 1.5 9.90803 1.65803 10.1894 1.93934L14.5606 6.31066C14.842 6.59197 15 6.97349 15 7.37132V15C15 15.8284 14.3284 16.5 13.5 16.5Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function CommandesIcon({ color = "currentColor" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.75 13.5H11.25M6.75 13.5C6.75 14.3284 6.07843 15 5.25 15C4.42157 15 3.75 14.3284 3.75 13.5M6.75 13.5C6.75 12.6716 6.07843 12 5.25 12C4.42157 12 3.75 12.6716 3.75 13.5M11.25 13.5C11.25 14.3284 11.9216 15 12.75 15C13.5784 15 14.25 14.3284 14.25 13.5M11.25 13.5C11.25 12.6716 11.9216 12 12.75 12C13.5784 12 14.25 12.6716 14.25 13.5M3.75 13.5H2.25C1.83579 13.5 1.5 13.1642 1.5 12.75V3.75C1.5 3.33579 1.83579 3 2.25 3H11.25C11.6642 3 12 3.33579 12 3.75V12.2007M14.25 13.5H16.5V9.3825C16.5 9.13155 16.437 8.88458 16.3169 8.66423L14.25 4.875H12M16.4504 9H12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function NotreEntrepriseIcon({ color = "currentColor" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_2512_23930)">
        <path d="M12 5.25V3C12 2.17157 11.3284 1.5 10.5 1.5H7.5C6.67157 1.5 6 2.17157 6 3V5.25M16.5 9L9.29415 10.4412C9.09998 10.48 8.90002 10.48 8.70585 10.4412L1.5 9M3 16.5H15C15.8284 16.5 16.5 15.8284 16.5 15V6.75C16.5 5.92157 15.8284 5.25 15 5.25H3C2.17157 5.25 1.5 5.92157 1.5 6.75V15C1.5 15.8284 2.17157 16.5 3 16.5Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_2512_23930">
          <rect width="18" height="18" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

export function SuiviSAVIcon({ color = "currentColor" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_2512_23914)">
        <path d="M10.1329 10.4719C11.8 11.1048 13.7848 10.7274 15.1591 9.35306C16.6183 7.89378 16.8451 5.6378 16.0405 3.91307L12.7845 7.16914L10.8309 5.2155L14.087 1.95943C12.3622 1.15486 10.1062 1.38167 8.64697 2.8409C7.27267 4.2152 6.89524 6.19995 7.52805 7.86708M7.49296 7.90218L2.03948 13.3557C1.32017 14.075 1.32017 15.2412 2.03948 15.9605C2.75879 16.6798 3.92503 16.6798 4.64434 15.9605L10.0978 10.507" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_2512_23914">
          <rect width="18" height="18" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}
