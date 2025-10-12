// filename: UserTopBar.tsx
import React from "react";
import { Bell, Settings, ChevronDown } from "lucide-react";

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
  userName = "Thomas",
  userRole = "Admin",
  userAvatar = "https://i.pravatar.cc/40?img=12",
  onNotificationsClick = () => {},
  onSettingsClick = () => {},
  onProfileClick = () => {},
  settingsActive = false,
}) => {
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
