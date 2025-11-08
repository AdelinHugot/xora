import React, { useMemo, useState } from "react";
import { CalendarDays, Search, ChevronDown, Plus, User, X, Calendar, ArrowUpRight, Pencil, Trash2, Check } from "lucide-react";
import Sidebar from "../components/Sidebar";
import UserTopBar from "../components/UserTopBar";

const startHour = 8;
const endHour = 18;
const intervalMinutes = 30;
const slotHeight = 64; // px per interval

const WEEK_PRESETS = [
  {
    id: "week-12",
    rangeLabel: "12/05 - 18/05",
    badge: "Semaine 12",
    days: [
      { id: "mon", label: "Lundi 12 avril" },
      { id: "tue", label: "Mardi 13 avril" },
      { id: "wed", label: "Mercredi 14 avril" },
      { id: "thu", label: "Jeudi 15 avril" },
      { id: "fri", label: "Vendredi 16 avril" },
      { id: "sat", label: "Samedi 17 avril" },
      { id: "sun", label: "Dimanche 18 avril" },
    ],
    events: [
      { id: "mon-standup", title: "Daily Standup", day: "mon", start: "09:00", end: "09:30", tone: "success", color: "emerald" },
      { id: "mon-event", title: "Event Name", day: "mon", start: "10:30", end: "11:30", tone: "danger", color: "rose" },
      { id: "tue-standup", title: "Daily Standup", day: "tue", start: "09:00", end: "09:30", tone: "success", color: "emerald" },
      { id: "wed-standup", title: "Daily Standup", day: "wed", start: "09:00", end: "09:30", tone: "success", color: "emerald" },
      { id: "wed-event", title: "Event Name", day: "wed", start: "12:00", end: "13:00", tone: "danger", color: "amber" },
      { id: "thu-standup", title: "Daily Standup", day: "thu", start: "09:00", end: "09:30", tone: "success", color: "emerald" },
      { id: "thu-event", title: "Event Name", day: "thu", start: "15:30", end: "16:30", tone: "danger", color: "violet" },
      { id: "fri-standup", title: "Daily Standup", day: "fri", start: "09:00", end: "09:30", tone: "success", color: "sky" },
    ],
  },
  {
    id: "week-13",
    rangeLabel: "19/05 - 25/05",
    badge: "Semaine 13",
    days: [
      { id: "mon", label: "Lundi 19 avril" },
      { id: "tue", label: "Mardi 20 avril" },
      { id: "wed", label: "Mercredi 21 avril" },
      { id: "thu", label: "Jeudi 22 avril" },
      { id: "fri", label: "Vendredi 23 avril" },
      { id: "sat", label: "Samedi 24 avril" },
      { id: "sun", label: "Dimanche 25 avril" },
    ],
    events: [
      { id: "week13-mon-standup", title: "Daily Standup", day: "mon", start: "09:30", end: "10:00", tone: "success", color: "emerald" },
      { id: "week13-tue-demo", title: "Démo projet client", day: "tue", start: "14:00", end: "15:30", tone: "danger", color: "rose" },
      { id: "week13-wed-workshop", title: "Atelier UX", day: "wed", start: "11:00", end: "12:00", tone: "success", color: "sky" },
      { id: "week13-thu-standup", title: "Daily Standup", day: "thu", start: "09:30", end: "10:00", tone: "success", color: "emerald" },
      { id: "week13-fri-retro", title: "Rétro sprint", day: "fri", start: "16:00", end: "17:00", tone: "success", color: "violet" },
    ],
  },
];

const EVENT_COLORS = {
  emerald: {
    bg: "bg-emerald-500",
    border: "border-emerald-600",
    text: "text-white",
    label: "Vert",
  },
  sky: {
    bg: "bg-sky-500",
    border: "border-sky-600",
    text: "text-white",
    label: "Bleu",
  },
  amber: {
    bg: "bg-amber-500",
    border: "border-amber-600",
    text: "text-neutral-900",
    label: "Ambre",
  },
  rose: {
    bg: "bg-rose-500",
    border: "border-rose-600",
    text: "text-white",
    label: "Rose",
  },
  violet: {
    bg: "bg-violet-500",
    border: "border-violet-600",
    text: "text-white",
    label: "Violet",
  },
};

const toneLabels = {
  success: "Rendez-vous",
  danger: "Important",
  neutral: "Information",
};

const formatHourLabel = (hour) => `${hour.toString().padStart(2, "0")}:00`;

const parseMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

function AgendaEvent({ event, onClick }) {
  const color = EVENT_COLORS[event.color ?? "emerald"] ?? EVENT_COLORS.emerald;
  const top = ((parseMinutes(event.start) - startHour * 60) / intervalMinutes) * slotHeight;
  const duration = (parseMinutes(event.end) - parseMinutes(event.start)) / intervalMinutes;
  const height = Math.max(duration * slotHeight - 8, slotHeight - 12);
  const isMini = height < 60;

  // Mock collaborators for display
  const collaborators = [
    { id: "1", avatarUrl: "https://i.pravatar.cc/40?img=12" },
    { id: "2", avatarUrl: "https://i.pravatar.cc/40?img=8" },
  ];

  return (
    <button
      onClick={() => onClick(event)}
      className={`absolute left-2 right-2 px-3 py-2 rounded-lg border shadow-sm ${color.bg} ${color.border} ${color.text} text-sm font-medium flex flex-col gap-1.5 hover:shadow-md transition-shadow cursor-pointer text-left overflow-hidden`}
      style={{ top, height }}
    >
      {/* Title and time */}
      <div className="flex items-start justify-between gap-2">
        <span className="font-semibold text-xs leading-tight">{event.title}</span>
        {!isMini && <span className="text-xs font-medium whitespace-nowrap flex-shrink-0">{event.start}</span>}
      </div>

      {!isMini && (
        <>
          {/* Collaborators with negative spacing */}
          <div className="flex -space-x-2">
            {collaborators.map((collab) => (
              <img key={collab.id} src={collab.avatarUrl} alt="" className="size-5 rounded-full border border-white shadow-sm" />
            ))}
          </div>

          {/* Time range at bottom */}
          <div className="text-xs opacity-80 mt-auto">
            {event.start} – {event.end}
          </div>
        </>
      )}
    </button>
  );
}

function WeeklyCalendarGrid({ days, events, onEventClick }) {
  // ====== CONFIG (visual grid) ======
  const HOUR_HEIGHT = 72; // px per hour (adjust to taste)

  // Helper: convert "HH:MM" -> y offset in px relative to grid start
  const timeToY = (t) => {
    const [hh, mm] = t.split(":").map(Number);
    return ((hh + mm / 60) - startHour) * HOUR_HEIGHT;
  };

  // Helper: compute height from start/end times
  const durationToH = (start, end) => timeToY(end) - timeToY(start);

  // Mini avatar group (purely decorative)
  const Avatars = () => (
    <div className="flex -space-x-2">
      {"ABCDE".split("").map((ch, i) => (
        <div
          key={i}
          className="w-6 h-6 rounded-full bg-neutral-300 ring-2 ring-white text-[10px] flex items-center justify-center font-semibold text-neutral-700"
        >
          {ch}
        </div>
      ))}
      <span className="ml-2 text-xs text-neutral-500">+3</span>
    </div>
  );

  // Map event colors to Tailwind classes (adapted to the design system)
  const colorMap = {
    emerald: { bg: "bg-emerald-100", bdr: "border-emerald-300", text: "text-emerald-800" },
    sky: { bg: "bg-sky-100", bdr: "border-sky-300", text: "text-sky-800" },
    indigo: { bg: "bg-indigo-100", bdr: "border-indigo-300", text: "text-indigo-800" },
    amber: { bg: "bg-amber-100", bdr: "border-amber-300", text: "text-amber-900" },
    rose: { bg: "bg-rose-100", bdr: "border-rose-300", text: "text-rose-900" },
    violet: { bg: "bg-violet-100", bdr: "border-violet-300", text: "text-violet-800" },
    gray: { bg: "bg-gray-100", bdr: "border-gray-300", text: "text-gray-700" },
  };

  // Render one event block absolutely inside its day column
  const EventBlock = ({ evt }) => {
    const color = colorMap[evt.color] || colorMap.gray;
    const top = timeToY(evt.start);
    const height = Math.max(28, durationToH(evt.start, evt.end));
    const isMini = height < 48;

    return (
      <button
        onClick={() => onEventClick(evt)}
        className={`absolute left-2 right-2 rounded-lg border shadow-sm ${color.bg} ${color.bdr} ${evt.strong ? "ring-1 ring-red-300" : ""} hover:shadow-md transition-shadow cursor-pointer text-left p-2 h-full flex flex-col`}
        style={{ top, height }}
      >
        <div className={`text-[11px] leading-tight font-medium ${color.text} truncate`}>
          {evt.title}
        </div>
        {!isMini && (
          <div className="mt-1 text-[10px] text-gray-500 flex items-center gap-1">
            <span>{evt.start} – {evt.end}</span>
            {evt.location && (
              <span className="inline-flex items-center gap-1">
                <span>{evt.icons?.[0] ?? "📍"}</span>
                <span className="truncate">{evt.location}</span>
              </span>
            )}
            {evt.badges?.map((b) => (
              <span key={b} className="ml-auto px-1.5 py-0.5 text-[9px] rounded bg-white/70 border border-white/80 text-gray-700">
                {b}
              </span>
            ))}
          </div>
        )}
        {!isMini && (
          <div className="mt-auto flex items-center justify-between text-[10px] text-gray-500">
            <div className="flex -space-x-1">
              {[0, 1].map((i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-white border border-gray-200" />
              ))}
            </div>
            {evt.icons?.includes("🎥") && <span>🎥</span>}
          </div>
        )}
      </button>
    );
  };

  // ====== RENDER ======
  return (
    <div className="w-full bg-white text-gray-900">
      {/* Outer container */}
      <div className="rounded-2xl border border-neutral-200 overflow-hidden overflow-x-auto">
        <div className="min-w-[960px]">
          {/* Header row: days */}
          <div className="grid border-b border-neutral-200" style={{ gridTemplateColumns: "96px repeat(7, minmax(0, 1fr))" }}>
            <div />
            {days.map((d) => (
              <div key={d.id} className="py-4 px-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-neutral-900">{d.label.split(" ")[0]} {d.label.split(" ")[1]}</div>
                    <div className="text-xs text-gray-500">{d.label.split(" ").slice(2).join(" ")}</div>
                  </div>
                  <Avatars />
                </div>
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div className="grid" style={{ gridTemplateColumns: "96px repeat(7, minmax(0, 1fr))" }}>
            {/* Time gutter */}
            <div className="relative bg-neutral-50">
              {Array.from({ length: endHour - startHour + 1 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[72px] text-xs text-gray-500 pr-3 flex items-start justify-end"
                  style={{ height: HOUR_HEIGHT }}
                >
                  <div className="-translate-y-2">{formatHourLabel(startHour + i)}</div>
                </div>
              ))}
            </div>

            {/* Day columns */}
            {days.map((d) => {
              const dayEvents = events.filter((evt) => evt.day === d.id);
              return (
                <div key={d.id} className="relative border-l border-gray-200 bg-white">
                  {/* Hour lines */}
                  {Array.from({ length: endHour - startHour + 1 }).map((_, i) => (
                    <div key={i} className="border-b border-gray-100" style={{ height: HOUR_HEIGHT }} />
                  ))}

                  {/* Events for this day */}
                  <div className="absolute inset-0">
                    {dayEvents.map((evt) => (
                      <EventBlock key={evt.id} evt={evt} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function AgendaList({ events, days, onEventClick }) {
  const grouped = useMemo(() => {
    const order = days.map((day) => day.id);
    const map = new Map(order.map((id) => [id, []]));
    events.forEach((event) => {
      if (map.has(event.day)) {
        map.get(event.day).push(event);
      }
    });
    order.forEach((id) => {
      const dayEvents = map.get(id);
      dayEvents?.sort((a, b) => parseMinutes(a.start) - parseMinutes(b.start));
    });
    return map;
  }, [events, days]);

  return (
    <div className="border border-neutral-200 rounded-2xl bg-white divide-y divide-neutral-200">
      {[...grouped.entries()].map(([dayId, dayEvents]) => {
        const dayInfo = days.find((d) => d.id === dayId);
        return (
          <div key={dayId} className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-neutral-700">{dayInfo?.label}</h3>
              <span className="text-xs text-neutral-400">{dayEvents.length} évènement(s)</span>
            </div>
            {dayEvents.length === 0 ? (
              <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-400">
                Aucun évènement pour ce jour.
              </div>
            ) : (
              <div className="grid gap-3">
                {dayEvents.map((event) => {
                  const color = EVENT_COLORS[event.color ?? "emerald"] ?? EVENT_COLORS.emerald;
                  const toneLabel = toneLabels[event.tone ?? "neutral"] ?? "Rendez-vous";
                  return (
                    <button
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className={`rounded-xl border px-4 py-3 ${color.bg} ${color.border} ${color.text} flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer text-left w-full`}
                    >
                      <div>
                        <div className="text-sm font-medium">{event.title}</div>
                        <div className="text-xs opacity-75">
                          {event.start} - {event.end}
                        </div>
                      </div>
                      <span className="text-xs uppercase tracking-wide">
                        {toneLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function AgendaControls({
  viewMode,
  onViewChange,
  selectedRange,
  onRangeChange,
  searchTerm,
  onSearch,
  onAddEvent,
  onAddTask,
}) {
  return (
    <div className="space-y-4">
      {/* First row: Title, week number, view pills, date selector (LEFT) | Add buttons (RIGHT) */}
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold text-neutral-900">Agenda</span>
          <span className="inline-block px-3 py-1 text-xs font-medium text-neutral-600 bg-neutral-100 rounded-full">
            Semaine 17
          </span>

          {/* View mode pills - similar to directory filter style */}
          <div className="inline-flex rounded-full border border-neutral-200 bg-neutral-100/70 p-1 gap-1">
            <button
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                viewMode === "list"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
              onClick={() => onViewChange("list")}
            >
              Jours
            </button>
            <button
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                viewMode === "week"
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
              onClick={() => onViewChange("week")}
            >
              Semaine
            </button>
            <button
              className="px-4 py-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-700 rounded-full transition-colors"
            >
              Mois
            </button>
          </div>

          {/* Date selector */}
          <div className="relative">
            <select
              value={selectedRange}
              onChange={(e) => onRangeChange(e.target.value)}
              className="appearance-none rounded-lg border border-neutral-200 bg-white px-3 py-2 pr-8 text-sm font-medium text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
            >
              {WEEK_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.rangeLabel}>
                  {preset.rangeLabel}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          </div>
        </div>

        {/* Right side: Add buttons */}
        <div className="flex items-center gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            onClick={onAddTask}
          >
            <span className="flex items-center justify-center size-4 rounded-full bg-neutral-200">
              <span className="text-xs">✓</span>
            </span>
            Ajouter une tâche
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors"
            onClick={onAddEvent}
          >
            <Plus className="size-4" />
            Ajouter un rendez-vous
          </button>
        </div>
      </div>

      {/* Second row: Search and collaborator filter */}
      <div className="flex items-center gap-3 w-full">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Rechercher"
            className="w-full rounded-lg border border-neutral-200 bg-white pl-10 pr-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
          />
        </div>
        <button className="flex-1 flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
          <div className="flex items-center gap-2.5">
            <img src="https://i.pravatar.cc/40?img=12" alt="" className="size-6 rounded-full flex-shrink-0" />
            <span>
              Loïc <span className="text-neutral-400">(Vous)</span>
            </span>
          </div>
          <ChevronDown className="size-4 text-neutral-400 flex-shrink-0" />
        </button>
      </div>
    </div>
  );
}

function AddAppointmentModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    isRecurrent: false,
    repeatEvery: 1,
    repeatUnit: "semaine",
    repeatOn: "lundi",
    endsOn: "",
    collaborators: ["loic"],
    appointmentType: "",
    directory: "",
    isPrivate: false,
    address: "",
    comment: "",
  });

  const maxNameLength = 25;

  const collaboratorsList = [
    { id: "loic", name: "Loïc", avatarUrl: "https://i.pravatar.cc/40?img=12", isCurrentUser: true },
    { id: "guillaume", name: "Guillaume", avatarUrl: "https://i.pravatar.cc/40?img=15", isCurrentUser: false },
    { id: "celine", name: "Céline", avatarUrl: "https://i.pravatar.cc/40?img=8", isCurrentUser: false },
  ];

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCollaborator = (collaboratorId) => {
    setFormData((prev) => ({
      ...prev,
      collaborators: prev.collaborators.includes(collaboratorId)
        ? prev.collaborators.filter((id) => id !== collaboratorId)
        : [...prev.collaborators, collaboratorId],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      onClick={handleOverlayClick}
    >
      <div
        className="w-full max-w-4xl rounded-2xl border border-neutral-200 bg-white shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-neutral-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100">
              <Calendar className="size-5 text-neutral-500" />
            </div>
            <h2 className="text-lg font-semibold text-neutral-900">Ajouter un rendez-vous</h2>
          </div>
          <button
            className="size-8 rounded-xl border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors"
            onClick={onClose}
            aria-label="Fermer"
          >
            <X className="size-4 text-neutral-500" />
          </button>
        </div>

        {/* Corps de la modale */}
        <form onSubmit={handleSubmit}>
          <div className="px-8 py-6 space-y-5">
            {/* Bloc "Nom du rdv" */}
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-2">Nom du rdv</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    if (e.target.value.length <= maxNameLength) {
                      handleChange("name", e.target.value);
                    }
                  }}
                  placeholder="Saisir"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 pr-16 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
                  {formData.name.length}/{maxNameLength}
                </span>
              </div>
            </div>

            {/* Bloc "Rendez-vous récurrent" */}
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-2">Rendez-vous récurrent</label>
              <div className="space-y-4">
                {/* Toggle Oui/Non */}
                <div className="inline-flex rounded-lg border border-neutral-200 bg-neutral-50 p-1">
                  <button
                    type="button"
                    onClick={() => handleChange("isRecurrent", false)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      !formData.isRecurrent
                        ? "bg-white text-neutral-900 shadow-sm"
                        : "text-neutral-500 hover:text-neutral-700"
                    }`}
                  >
                    Non
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("isRecurrent", true)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      formData.isRecurrent
                        ? "bg-white text-neutral-900 shadow-sm"
                        : "text-neutral-500 hover:text-neutral-700"
                    }`}
                  >
                    Oui
                  </button>
                </div>

                {/* Champs conditionnels */}
                {formData.isRecurrent && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl bg-neutral-50 p-4">
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                          Répéter tout(s)/s les
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={formData.repeatEvery}
                          onChange={(e) => handleChange("repeatEvery", parseInt(e.target.value) || 1)}
                          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-neutral-600 mb-1.5">De</label>
                        <select
                          value={formData.repeatUnit}
                          onChange={(e) => handleChange("repeatUnit", e.target.value)}
                          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                        >
                          <option value="jour">Jour</option>
                          <option value="semaine">Semaine</option>
                          <option value="mois">Mois</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-600 mb-1.5">Répéter le</label>
                      <select
                        value={formData.repeatOn}
                        onChange={(e) => handleChange("repeatOn", e.target.value)}
                        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                      >
                        <option value="lundi">Lundi</option>
                        <option value="mardi">Mardi</option>
                        <option value="mercredi">Mercredi</option>
                        <option value="jeudi">Jeudi</option>
                        <option value="vendredi">Vendredi</option>
                        <option value="samedi">Samedi</option>
                        <option value="dimanche">Dimanche</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-600 mb-1.5">Se termine le</label>
                      <input
                        type="date"
                        value={formData.endsOn}
                        onChange={(e) => handleChange("endsOn", e.target.value)}
                        placeholder="Sélectionner une date"
                        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bloc "Collaborateur / Type / Annuaire / Privé" */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Collaborateur */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-neutral-600 mb-2">
                  Collaborateur (choix multiple possible)
                </label>
                <div className="flex flex-wrap gap-2">
                  {collaboratorsList.map((collab) => (
                    <button
                      key={collab.id}
                      type="button"
                      onClick={() => toggleCollaborator(collab.id)}
                      className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all ${
                        formData.collaborators.includes(collab.id)
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      <img src={collab.avatarUrl} alt="" className="size-6 rounded-full" />
                      <span>
                        {collab.name}
                        {collab.isCurrentUser && " (Vous)"}
                      </span>
                      {formData.collaborators.includes(collab.id) && (
                        <Check className="size-4" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type de rendez-vous */}
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-2">Type de rendez-vous</label>
                <select
                  value={formData.appointmentType}
                  onChange={(e) => handleChange("appointmentType", e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                >
                  <option value="">Sélectionner</option>
                  <option value="decouverte">Découverte</option>
                  <option value="suivi">Suivi</option>
                  <option value="signature">Signature</option>
                </select>
              </div>

              {/* Annuaire */}
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-2">Annuaire</label>
                <select
                  value={formData.directory}
                  onChange={(e) => handleChange("directory", e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                >
                  <option value="">Sélectionner</option>
                  <option value="clients">Clients</option>
                  <option value="prospects">Prospects</option>
                  <option value="partenaires">Partenaires</option>
                </select>
              </div>

              {/* Privé */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-neutral-600 mb-2">Privé</label>
                <div className="inline-flex rounded-lg border border-neutral-200 bg-neutral-50 p-1">
                  <button
                    type="button"
                    onClick={() => handleChange("isPrivate", false)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      !formData.isPrivate
                        ? "bg-white text-neutral-900 shadow-sm"
                        : "text-neutral-500 hover:text-neutral-700"
                    }`}
                  >
                    Non
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("isPrivate", true)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      formData.isPrivate
                        ? "bg-white text-neutral-900 shadow-sm"
                        : "text-neutral-500 hover:text-neutral-700"
                    }`}
                  >
                    Oui
                  </button>
                </div>
              </div>
            </div>

            {/* Bloc "Adresse" */}
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-2">Adresse</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Saisir une adresse"
                className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
              />
            </div>

            {/* Bloc "Commentaire du rendez-vous" */}
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-2">
                Commentaire du rendez-vous
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => handleChange("comment", e.target.value)}
                placeholder="Appeler ce client pour le relancer vis-à-vis de l'augmentation des matières premières pour sa cuisine."
                rows={4}
                className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 resize-none"
              />
            </div>
          </div>

          {/* Pied de la modale */}
          <div className="px-8 pb-8 pt-4 flex items-center justify-center sticky bottom-0 bg-white border-t border-neutral-100">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors shadow-sm"
            >
              <Plus className="size-4" />
              Créer le rendez-vous
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AppointmentDetailModal({ isOpen, onClose, onDelete, onEdit }) {
  if (!isOpen) return null;

  // Mock data - dans une vraie application, ces données viendraient des props
  const appointmentData = {
    title: "Projet Cuisine 13/05/2025 10H00",
    createdBy: {
      name: "Loïc",
      avatarUrl: "https://i.pravatar.cc/40?img=12",
      isCurrentUser: true,
    },
    collaborators: [
      { id: "1", name: "Loïc", avatarUrl: "https://i.pravatar.cc/40?img=12", isCurrentUser: true },
      { id: "2", name: "Céline", avatarUrl: "https://i.pravatar.cc/40?img=8", isCurrentUser: false },
    ],
    clientName: "Chloé Dubois",
    projectName: "Projet cuisine",
    clientAddress: "17 rue du Vieux Lion",
    appointmentType: "Découverte",
    comment: "Appeler ce client pour le relancer vis-à-vis de l'augmentation des matières premières pour sa cuisine.",
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      onClick={handleOverlayClick}
    >
      <div
        className="w-full max-w-3xl rounded-2xl border border-neutral-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="flex items-start justify-between px-8 pt-8 pb-6 border-b border-neutral-100">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100">
              <Calendar className="size-5 text-neutral-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-neutral-900 mb-2">
                {appointmentData.title}
              </h2>
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-transparent px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors">
                Voir la fiche clients & prospects
                <ArrowUpRight className="size-3.5" />
              </button>
            </div>
          </div>
          <button
            className="size-8 rounded-xl border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors ml-4"
            onClick={onClose}
            aria-label="Fermer"
          >
            <X className="size-4 text-neutral-500" />
          </button>
        </div>

        {/* Corps de la modale */}
        <div className="px-8 py-6 space-y-5">
          {/* Bloc "Créé par" */}
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Créé par
            </label>
            <div className="inline-flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5">
              <img
                src={appointmentData.createdBy.avatarUrl}
                alt=""
                className="size-7 rounded-full"
              />
              <span className="text-sm font-medium text-neutral-900">
                {appointmentData.createdBy.name}
                {appointmentData.createdBy.isCurrentUser && (
                  <span className="text-neutral-500 ml-1">(Vous)</span>
                )}
              </span>
            </div>
          </div>

          {/* Bloc "Collaborateur" */}
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Collaborateur
            </label>
            <div className="inline-flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5">
              {appointmentData.collaborators.map((collab, index) => (
                <React.Fragment key={collab.id}>
                  {index > 0 && <span className="text-neutral-300">•</span>}
                  <div className="flex items-center gap-2">
                    <img
                      src={collab.avatarUrl}
                      alt=""
                      className="size-7 rounded-full"
                    />
                    <span className="text-sm font-medium text-neutral-900">
                      {collab.name}
                      {collab.isCurrentUser && (
                        <span className="text-neutral-500 ml-1">(Vous)</span>
                      )}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Bloc "Informations principales" */}
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Informations principales
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5">
                <div className="text-xs font-medium text-neutral-500 mb-1">Nom</div>
                <div className="text-sm font-medium text-neutral-900">{appointmentData.clientName}</div>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5">
                <div className="text-xs font-medium text-neutral-500 mb-1">Projet concerné</div>
                <div className="text-sm font-medium text-neutral-900">{appointmentData.projectName}</div>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5">
                <div className="text-xs font-medium text-neutral-500 mb-1">Adresse client</div>
                <div className="text-sm font-medium text-neutral-900">{appointmentData.clientAddress}</div>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5">
                <div className="text-xs font-medium text-neutral-500 mb-1">Type de rendez-vous</div>
                <div className="text-sm font-medium text-neutral-900">{appointmentData.appointmentType}</div>
              </div>
            </div>
          </div>

          {/* Bloc "Commentaire du rendez-vous" */}
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Commentaire du rendez-vous
            </label>
            <div className="rounded-xl border border-neutral-200 bg-white px-3.5 py-3">
              <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
                {appointmentData.comment}
              </p>
            </div>
          </div>
        </div>

        {/* Pied de la modale */}
        <div className="px-8 pb-8 pt-4 flex items-center justify-center gap-3">
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            <Trash2 className="size-4" />
            Supprimer le rdv
          </button>
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <Pencil className="size-4" />
            Modifier le rdv
          </button>
        </div>
      </div>
    </div>
  );
}

function Topbar({ onNavigate }) {
  return (
    <header className="h-16 border-b bg-[#F8F9FA] border-neutral-200 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-white border border-neutral-300 rounded text-neutral-900">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.25 7.5H15.75M12 1.5V4.5M6 1.5V4.5M3.75 16.5H14.25C15.0784 16.5 15.75 15.8284 15.75 15V4.5C15.75 3.67157 15.0784 3 14.25 3H3.75C2.92157 3 2.25 3.67157 2.25 4.5V15C2.25 15.8284 2.92157 16.5 3.75 16.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-neutral-900">Agenda</h1>
      </div>
      <UserTopBar onSettingsClick={() => onNavigate("settings-connection")} />
    </header>
  );
}

export default function AgendaPage({ onNavigate, sidebarCollapsed, onToggleSidebar }) {
  const sidebarWidth = sidebarCollapsed ? 72 : 256;
  const [viewMode, setViewMode] = useState("week");
  const [selectedWeekRange, setSelectedWeekRange] = useState(WEEK_PRESETS[0].rangeLabel);
  const [searchTerm, setSearchTerm] = useState("");
  const [userCreatedEvents, setUserCreatedEvents] = useState(() =>
    Object.fromEntries(WEEK_PRESETS.map((preset) => [preset.id, []]))
  );
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const currentWeek = useMemo(
    () => WEEK_PRESETS.find((preset) => preset.rangeLabel === selectedWeekRange) ?? WEEK_PRESETS[0],
    [selectedWeekRange]
  );

  const mergedEvents = useMemo(() => {
    const base = currentWeek?.events ?? [];
    const added = userCreatedEvents[currentWeek?.id] ?? [];
    return [...base, ...added];
  }, [currentWeek, userCreatedEvents]);

  const filteredEvents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return mergedEvents;
    return mergedEvents.filter((event) => event.title.toLowerCase().includes(term));
  }, [mergedEvents, searchTerm]);

  const sortedFilteredEvents = useMemo(() => {
    if (!currentWeek) return filteredEvents;
    const dayOrder = currentWeek.days.map((day) => day.id);
    return [...filteredEvents].sort((a, b) => {
      const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
      if (dayDiff !== 0) return dayDiff;
      return parseMinutes(a.start) - parseMinutes(b.start);
    });
  }, [filteredEvents, currentWeek]);

  const handleAddEvent = (formData) => {
    if (!currentWeek) return;
    const newEvent = {
      id: `custom-${Date.now()}`,
      title: formData.name,
      day: "mon", // À adapter selon votre logique
      start: "09:00",
      end: "10:00",
      tone: "success",
      color: "emerald",
    };
    setUserCreatedEvents((prev) => {
      const current = prev[currentWeek.id] ?? [];
      return {
        ...prev,
        [currentWeek.id]: [...current, newEvent],
      };
    });
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setDetailModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Sidebar
        currentPage="agenda"
        onNavigate={onNavigate}
        initialCollapsed={sidebarCollapsed}
        onToggleCollapse={onToggleSidebar}
      />
      <main
        className="lg:transition-[margin] lg:duration-200 min-h-screen"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <Topbar onNavigate={onNavigate} />
        <div className="w-full py-6 px-4 lg:px-6 bg-white">
          <div className="space-y-6">
            <AgendaControls
              viewMode={viewMode}
              onViewChange={setViewMode}
              selectedRange={selectedWeekRange}
              onRangeChange={setSelectedWeekRange}
              searchTerm={searchTerm}
              onSearch={setSearchTerm}
              onAddEvent={() => setAddModalOpen(true)}
              onAddTask={() => console.log("Add task clicked")}
            />
            {viewMode === "week" ? (
              <WeeklyCalendarGrid days={currentWeek.days} events={sortedFilteredEvents} onEventClick={handleEventClick} />
            ) : (
              <AgendaList days={currentWeek.days} events={sortedFilteredEvents} onEventClick={handleEventClick} />
            )}
          </div>
        </div>
      </main>
      <AddAppointmentModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleAddEvent}
      />
      <AppointmentDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedEvent(null);
        }}
        onDelete={() => {
          console.log("Supprimer le rendez-vous:", selectedEvent);
          setDetailModalOpen(false);
          setSelectedEvent(null);
        }}
        onEdit={() => {
          console.log("Modifier le rendez-vous:", selectedEvent);
          setDetailModalOpen(false);
          setSelectedEvent(null);
          // Ici vous pourriez ouvrir une modale d'édition
        }}
      />
    </div>
  );
}
