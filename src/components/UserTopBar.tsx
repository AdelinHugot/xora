// filename: UserTopBar.tsx
import React, { useEffect, useState } from "react";
import { Bell, Settings, ChevronDown } from "lucide-react";
import { supabase } from "../lib/supabase";

// UserTopBar Component - Matches Dashboard exactly
interface UserTopBarProps {
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
  settingsActive?: boolean;
}

const UserTopBar: React.FC<UserTopBarProps> = ({
  userName: propUserName,
  userRole: propUserRole,
  userAvatar: propUserAvatar,
  onNotificationsClick = () => {},
  onSettingsClick = () => {},
  onProfileClick = () => {},
  settingsActive = false,
}) => {
  const [userName, setUserName] = useState(propUserName || "Chargement...");
  const [userRole, setUserRole] = useState(propUserRole || "");
  const [userAvatar, setUserAvatar] = useState(propUserAvatar || "https://i.pravatar.cc/40?img=12");

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      // Get authenticated user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        return;
      }

      // Fetch user info from utilisateurs_auth table to get id_utilisateur
      const { data: authData, error: authError } = await supabase
        .from('utilisateurs_auth')
        .select('id_utilisateur')
        .eq('id_auth_user', authUser.id)
        .single();

      if (authError) {
        // Use email as fallback
        const nameFromEmail = authUser.email?.split('@')[0] || 'Utilisateur';
        setUserName(nameFromEmail);
        setUserAvatar(`https://i.pravatar.cc/40?u=${authUser.id}`);
        return;
      }
      if (!authData) {
        // Use email as fallback
        const nameFromEmail = authUser.email?.split('@')[0] || 'Utilisateur';
        setUserName(nameFromEmail);
        setUserAvatar(`https://i.pravatar.cc/40?u=${authUser.id}`);
        return;
      }

      // Fetch from utilisateurs table
      const { data: userData, error: userError } = await supabase
        .from('utilisateurs')
        .select('prenom, nom')
        .eq('id', authData.id_utilisateur)
        .single();

      if (userError) {
        // Use email as fallback
        const nameFromEmail = authUser.email?.split('@')[0] || 'Utilisateur';
        setUserName(nameFromEmail);
        setUserAvatar(`https://i.pravatar.cc/40?u=${authData.id_utilisateur}`);
        return;
      }

      if (userData) {
        const prenom = userData.prenom ? userData.prenom.charAt(0).toUpperCase() + userData.prenom.slice(1).toLowerCase() : '';
        const nom = userData.nom ? userData.nom.charAt(0).toUpperCase() + userData.nom.slice(1).toLowerCase() : '';
        const fullName = `${prenom} ${nom}`.trim();
        setUserName(fullName || "Utilisateur");
        setUserRole("Utilisateur");
        setUserAvatar(`https://i.pravatar.cc/40?u=${authData.id_utilisateur}`);
      } else {
        const nameFromEmail = authUser.email?.split('@')[0] || 'Utilisateur';
        setUserName(nameFromEmail);
        setUserAvatar(`https://i.pravatar.cc/40?u=${authData.id_utilisateur}`);
      }
    } catch (err) {
      // Silently handle errors
    }
  };
  return (
    <div className="flex items-center gap-2 ml-auto">
      <button
        className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-50"
        aria-label="Notifications"
        title="Notifications"
        onClick={onNotificationsClick}
      >
        <Bell className="size-4" />
      </button>
      <button
        className={`p-2 rounded-xl border transition-colors ${
          settingsActive
            ? "bg-violet-50 border-violet-200 text-violet-700"
            : "border-neutral-200 hover:bg-neutral-50"
        }`}
        aria-label="Paramètres"
        title="Paramètres"
        onClick={onSettingsClick}
      >
        <Settings className="size-4" />
      </button>
      <div className="flex items-center gap-2 pl-3 ml-2 border-l border-neutral-200">
        <img src={userAvatar} alt="avatar" className="size-8 rounded-full" />
        <div className="text-sm leading-tight">
          <div className="font-semibold">{userName}</div>
          <div className="text-neutral-500">{userRole}</div>
        </div>
        <button
          onClick={onProfileClick}
          aria-label="Menu utilisateur"
          className="hover:opacity-70 transition-opacity"
        >
          <ChevronDown className="size-4 text-neutral-500" />
        </button>
      </div>
    </div>
  );
};

export default UserTopBar;
