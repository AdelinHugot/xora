import React, { useMemo, useState, useRef, useEffect } from "react";
import { CalendarDays, Search, ChevronDown, Plus, User, X, Calendar, ArrowUpRight, Pencil, Trash2, Check } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format, parse } from "date-fns";
import "react-day-picker/dist/style.css";
import Sidebar from "../components/Sidebar";
import UserTopBar from "../components/UserTopBar";
import { useAppointments } from "../hooks/useAppointments";
import { transformAppointmentForAgenda } from "../utils/dataTransformers";

// Custom Select Component
function CustomSelect({ value, onChange, options, placeholder = "Sélectionner" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleOpen = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
    setIsOpen(!isOpen);
  };

  const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleOpen}
        className="w-full rounded-lg border border-[#E4E4E7] bg-white px-3 py-2.5 text-left text-sm text-[#1F2027] flex items-center justify-between hover:bg-[#FAFAFA] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30"
      >
        <span>{selectedLabel}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {isOpen && (
        <div
          className="bg-white border border-[#E4E4E7] rounded-lg shadow-lg z-[9999]"
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            width: position.width
          }}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="w-full px-3 py-2.5 text-left text-sm text-[#1F2027] hover:bg-[#F9F9F9] border-b border-[#EEEEEE] last:border-b-0 transition-colors"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Custom Toggle Switch Component
function ToggleSwitch({ value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        value ? "bg-[#2B7FFF]" : "bg-[#E1E4ED]"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
          value ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

// Custom Date Picker Component
function DatePickerField({ value, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const selectedDate = value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined;
  const displayDate = value ? format(parse(value, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy') : '';

  return (
    <div>
      <label className="block text-xs text-[#6B7280] font-medium mb-2">{label}</label>
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full rounded-lg border border-[#E1E4ED] bg-white px-3 py-2.5 pl-9 text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 text-left flex items-center justify-between"
        >
          <span>{displayDate}</span>
          <Calendar className="size-4 text-[#A1A7B6]" />
        </button>
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#A1A7B6] pointer-events-none" />

        {isOpen && (
          <div
            ref={pickerRef}
            className="bg-white border border-[#E1E4ED] rounded-lg shadow-lg z-[9999] p-4"
            style={{
              position: 'fixed',
              top: (buttonRef.current?.getBoundingClientRect().bottom ?? 0) + window.scrollY + 8,
              left: buttonRef.current?.getBoundingClientRect().left ?? 0,
              minWidth: (buttonRef.current?.getBoundingClientRect().width ?? 0) + 32
            }}
          >
            <style>{`
              .rdp {
                --rdp-cell-size: 36px;
                --rdp-accent-color: #2B7FFF;
                --rdp-background-color: #E0E7FF;
              }
              .rdp-caption {
                color: #1F2027;
                font-weight: 600;
                margin-bottom: 12px;
              }
              .rdp-head_cell {
                color: #6B7280;
                font-weight: 500;
                font-size: 12px;
              }
              .rdp-day {
                color: #1F2027;
              }
              .rdp-day_selected:not([disabled]) {
                background-color: #2B7FFF;
                color: white;
              }
              .rdp-day_today {
                font-weight: 600;
                color: #2B7FFF;
              }
              .rdp-day_disabled {
                color: #D1D5DB;
                opacity: 0.5;
                cursor: not-allowed;
              }
            `}</style>
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  onChange(format(date, 'yyyy-MM-dd'));
                  setIsOpen(false);
                }
              }}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today;
              }}
              defaultMonth={selectedDate || new Date()}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Custom Time Picker Component
function TimePickerField({ value, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);
  const buttonRef = useRef(null);
  const [hours, setHours] = useState(value ? parseInt(value.split(':')[0]) : 0);
  const [minutes, setMinutes] = useState(value ? parseInt(value.split(':')[1]) : 0);

  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const displayTime = value || '';

  const handleTimeSelect = (h, m) => {
    const timeString = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    onChange(timeString);
    setIsOpen(false);
  };

  return (
    <div>
      <label className="block text-xs text-[#6B7280] font-medium mb-2">{label}</label>
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full rounded-lg border border-[#E1E4ED] bg-white px-3 py-2.5 pl-9 text-sm text-[#1F2027] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 text-left flex items-center justify-between"
        >
          <span>{displayTime}</span>
          <svg className="size-4 text-[#A1A7B6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2"/>
            <path strokeWidth="2" d="M12 6v6l4 2"/>
          </svg>
        </button>
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#A1A7B6] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="2"/>
          <path strokeWidth="2" d="M12 6v6l4 2"/>
        </svg>

        {isOpen && (
          <div
            ref={pickerRef}
            className="bg-white border border-[#E1E4ED] rounded-lg shadow-lg z-[9999] p-3"
            style={{
              position: 'fixed',
              top: (buttonRef.current?.getBoundingClientRect().bottom ?? 0) + window.scrollY + 8,
              left: buttonRef.current?.getBoundingClientRect().left ?? 0,
              width: '280px'
            }}
          >
            {/* Display current time */}
            <div className="text-center mb-4 pb-3 border-b border-[#E1E4ED]">
              <div className="text-2xl font-bold text-[#1F2027]">
                {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
              </div>
            </div>

            {/* Hours Grid */}
            <div className="mb-4">
              <label className="text-xs text-[#6B7280] font-medium block mb-2">Heures</label>
              <div className="grid grid-cols-6 gap-1">
                {Array.from({ length: 24 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setHours(i)}
                    className={`py-1.5 px-1 rounded text-xs font-medium transition-colors ${
                      hours === i
                        ? "bg-[#2B7FFF] text-white"
                        : "bg-[#F3F4F6] text-[#1F2027] hover:bg-[#E1E4ED]"
                    }`}
                  >
                    {String(i).padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>

            {/* Minutes Grid */}
            <div className="mb-4">
              <label className="text-xs text-[#6B7280] font-medium block mb-2">Minutes</label>
              <div className="grid grid-cols-4 gap-1">
                {Array.from({ length: 4 }).map((_, i) => {
                  const min = i * 15;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setMinutes(min)}
                      className={`py-1.5 px-1 rounded text-xs font-medium transition-colors ${
                        minutes === min
                          ? "bg-[#2B7FFF] text-white"
                          : "bg-[#F3F4F6] text-[#1F2027] hover:bg-[#E1E4ED]"
                      }`}
                    >
                      {String(min).padStart(2, '0')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Confirm button */}
            <button
              type="button"
              onClick={() => handleTimeSelect(hours, minutes)}
              className="w-full py-2 rounded-lg bg-[#2B7FFF] text-white font-medium text-xs transition-colors hover:bg-[#1E5FCC]"
            >
              Valider
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Custom Multi-Select Component for Collaborators
function CustomMultiSelect({ value, onChange, options, placeholder = "Sélectionner" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const selectedItems = options.filter(opt => value.includes(opt.value));

  const handleToggle = (optionValue) => {
    onChange(
      value.includes(optionValue)
        ? value.filter(id => id !== optionValue)
        : [...value, optionValue]
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-lg border border-[#E4E4E7] bg-white px-3 py-2.5 text-left text-sm text-[#1F2027] flex items-center justify-between hover:bg-[#FAFAFA] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30"
      >
        <span className="truncate">
          {selectedItems.length > 0
            ? `${selectedItems.length} collaborateur${selectedItems.length > 1 ? 's' : ''} sélectionné${selectedItems.length > 1 ? 's' : ''}`
            : placeholder
          }
        </span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={`transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
          <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E4E4E7] rounded-lg shadow-lg z-[9999] max-h-64 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleToggle(option.value)}
              className="w-full px-3 py-2.5 text-left text-sm text-[#1F2027] hover:bg-[#F9F9F9] border-b border-[#EEEEEE] last:border-b-0 transition-colors flex items-center gap-3"
            >
              <input
                type="checkbox"
                checked={value.includes(option.value)}
                onChange={() => {}}
                className="rounded border-[#E4E4E7]"
              />
              {option.avatar && (
                <img src={option.avatar} alt={option.label} className="size-5 rounded-full flex-shrink-0" />
              )}
              <span className="truncate">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const startHour = 8;
const endHour = 18;
const intervalMinutes = 30;
const slotHeight = 64; // px per interval

// Fonction pour générer une semaine à partir d'une date
function generateWeekFromDate(date) {
  const startDate = new Date(date);
  const day = startDate.getDay();
  const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // Lundi
  startDate.setDate(diff);

  const days = [];
  const dayLabels = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  const dayIds = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    days.push({
      id: dayIds[i],
      label: `${dayLabels[i]} ${currentDate.getDate()} ${currentDate.toLocaleString('fr-FR', { month: 'long' }).charAt(0).toUpperCase() + currentDate.toLocaleString('fr-FR', { month: 'long' }).slice(1)}`
    });
  }

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

  return {
    id: `week-${startDate.getTime()}`,
    rangeLabel: `${format(startDate, 'dd/MM')} - ${format(endDate, 'dd/MM')}`,
    badge: `Semaine ${format(startDate, 'w')}`,
    days: days,
    events: []
  };
}

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
      { id: "mon-event", title: "RDV Dupont", day: "mon", start: "10:30", end: "12:30", tone: "danger", color: "rose", location: "19 rue voltaire" },
      { id: "tue-standup", title: "Daily Standup", day: "tue", start: "09:00", end: "09:30", tone: "success", color: "emerald" },
      { id: "wed-standup", title: "Daily Standup", day: "wed", start: "09:00", end: "09:30", tone: "success", color: "emerald" },
      { id: "wed-event", title: "Réunion Client", day: "wed", start: "12:00", end: "14:00", tone: "danger", color: "amber", location: "Showroom" },
      { id: "thu-standup", title: "Daily Standup", day: "thu", start: "09:00", end: "10:00", tone: "success", color: "emerald" },
      { id: "thu-event", title: "Visite Chantier", day: "thu", start: "14:00", end: "16:30", tone: "danger", color: "violet", location: "Chantier" },
      { id: "fri-standup", title: "RDV Visio", day: "fri", start: "09:00", end: "10:30", tone: "success", color: "sky", icons: ["🎥"] },
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
      {null}
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

    // Mock collaborators for display
    const collaborators = [
      { id: "1", avatarUrl: "https://i.pravatar.cc/40?img=12" },
      { id: "2", avatarUrl: "https://i.pravatar.cc/40?img=8" },
    ];

    return (
      <button
        onClick={(e) => onEventClick(evt, e)}
        className={`absolute left-2 right-2 rounded-lg border shadow-sm ${color.bg} ${color.bdr} ${evt.strong ? "ring-1 ring-red-300" : ""} hover:shadow-md transition-shadow cursor-pointer text-left p-2 h-full flex flex-col`}
        style={{ top, height }}
      >
        {/* Ligne 1 : Nom du RDV */}
        <div className={`text-[11px] leading-tight font-medium ${color.text} truncate`}>
          {evt.title}
        </div>

        {!isMini && (
          <>
            {/* Ligne 2 : Collaborateurs */}
            <div className="flex -space-x-2 mt-1">
              {collaborators.slice(0, 2).map((collab) => (
                <img
                  key={collab.id}
                  src={collab.avatarUrl}
                  alt=""
                  className="w-5 h-5 rounded-full border border-white shadow-sm flex-shrink-0"
                />
              ))}
            </div>

            {/* Ligne 3 : Lieu (si adresse physique) */}
            {evt.location && (
              <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-600">
                <span>📍</span>
                <span className="truncate">Extérieur</span>
              </div>
            )}

            {/* Ligne en bas : Icône visio (gauche) + Heure (droite) */}
            <div className="mt-auto flex items-center justify-between text-[10px] text-gray-600">
              <div>
                {evt.icons?.includes("🎥") && <span>📹</span>}
              </div>
              <span className="whitespace-nowrap font-medium">
                {evt.start} – {evt.end}
              </span>
            </div>
          </>
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
                <div className="flex items-center justify-center gap-2">
                  <div className="text-center">
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
                      onClick={(e) => onEventClick(event, e)}
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

// Agenda Date Picker Component
function AgendaDatePicker({ selectedRange, onRangeChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);
  const buttonRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleDateSelect = (date) => {
    if (!date) return;

    setSelectedDate(date);

    // Générer la semaine complète à partir de la date sélectionnée
    const weekData = generateWeekFromDate(date);
    onRangeChange(weekData.rangeLabel);

    setIsOpen(false);
  };

  return (
    <div>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 flex items-center gap-2"
      >
        <Calendar className="size-4" />
        {selectedRange}
      </button>

      {isOpen && (
        <div
          ref={pickerRef}
          className="bg-white border border-neutral-200 rounded-lg shadow-lg p-4"
          style={{
            position: 'fixed',
            top: (buttonRef.current?.getBoundingClientRect().bottom ?? 0) + window.scrollY + 8,
            left: buttonRef.current?.getBoundingClientRect().left ?? 0,
            minWidth: (buttonRef.current?.getBoundingClientRect().width ?? 0) + 32,
            zIndex: 50
          }}
        >
          <style>{`
            .rdp {
              --rdp-cell-size: 36px;
              --rdp-accent-color: #1F2937;
              --rdp-background-color: #E5E7EB;
            }
            .rdp-caption {
              color: #1F2937;
              font-weight: 600;
              margin-bottom: 12px;
            }
            .rdp-head_cell {
              color: #6B7280;
              font-weight: 500;
              font-size: 12px;
            }
            .rdp-day {
              color: #1F2937;
            }
            .rdp-day_selected:not([disabled]) {
              background-color: #1F2937;
              color: white;
            }
            .rdp-day_today {
              font-weight: 600;
              color: #1F2937;
            }
          `}</style>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            defaultMonth={selectedDate}
          />
        </div>
      )}
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
          <AgendaDatePicker
            selectedRange={selectedRange}
            onRangeChange={onRangeChange}
          />
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
  const [step, setStep] = useState(1); // 1 for first modal, 2 for second modal
  const [formData, setFormData] = useState({
    directoryType: "",
    contactType: "",
    searchQuery: "",
    selectedContact: "",
    selectedContactId: "",
    selectedProject: "",
    eventType: "",
    // Step 2 fields
    title: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    isRecurrent: false,
    collaborators: [],
    isPrivate: false,
    locationType: "", // showroom, adresse-client, autre-adresse, rdv-tel
    clientAddress: "", // pour adresse-client
    otherAddress: "", // pour autre-adresse
    otherAddressSearch: "", // pour la recherche d'adresse API
    createVideoLink: false,
    comment: "",
    additionalInfo: "",
  });

  const [searchResults, setSearchResults] = useState([]);
  const [addressSearchResults, setAddressSearchResults] = useState([]);
  const addressSearchTimeoutRef = useRef(null);

  // Mock contacts data by type
  const mockContacts = {
    client: [
      { id: "c1", name: "Dupont Chloé" },
      { id: "c2", name: "Martinez Lucas" },
      { id: "c3", name: "Bernard Amélie" },
      { id: "c4", name: "Farget Coline" },
      { id: "c5", name: "Durand Jean" },
    ],
    fournisseur: [
      { id: "f1", name: "APPROSINE" },
      { id: "f2", name: "HYDROPLUS" },
      { id: "f3", name: "SANIFIX" },
      { id: "f4", name: "BATHPRO" },
      { id: "f5", name: "AQUATECH" },
    ],
    salarie: [
      { id: "s1", name: "Jérémy Colomb" },
      { id: "s2", name: "Sophie Martin" },
      { id: "s3", name: "Thomas Dubois" },
      { id: "s4", name: "Claire Rousseau" },
      { id: "s5", name: "Marc Lefebvre" },
      { id: "s6", name: "Nathalie Blanc" },
    ],
    prescripteur: [
      { id: "pr1", name: "Architecte Lambert" },
      { id: "pr2", name: "Designer Lefevre" },
      { id: "pr3", name: "Décorateur Moreau" },
    ],
  };

  // Mock projects data by client
  const mockProjectsByClient = {
    c1: [
      { id: "p1", name: "Cuisine étage 2" },
      { id: "p2", name: "Salle de bain étage" },
    ],
    c2: [
      { id: "p3", name: "Terrasse" },
      { id: "p4", name: "Rénovation cuisine" },
    ],
    c3: [
      { id: "p5", name: "Installation douche" },
      { id: "p6", name: "Aménagement sdb" },
      { id: "p7", name: "Pose robinetterie" },
    ],
    c4: [
      { id: "p8", name: "Projet client 4" },
    ],
    c5: [
      { id: "p9", name: "Cuisine moderne" },
      { id: "p10", name: "Rénovation salle d'eau" },
    ],
  };

  // Mock addresses by client
  const mockAddressesByClient = {
    c1: [
      { id: "a1", address: "12 rue de Paris, 75001 Paris" },
      { id: "a2", address: "45 avenue des Champs, 75008 Paris" },
    ],
    c2: [
      { id: "a3", address: "8 rue Montmartre, 75002 Paris" },
    ],
    c3: [
      { id: "a4", address: "15 boulevard Saint-Germain, 75005 Paris" },
      { id: "a5", address: "20 rue de Rivoli, 75004 Paris" },
    ],
    c4: [
      { id: "a6", address: "5 avenue Foch, 75016 Paris" },
    ],
    c5: [
      { id: "a7", address: "100 rue de Turenne, 75003 Paris" },
    ],
  };

  // Mock collaborators
  const mockCollaborators = [
    { id: "s1", name: "Jérémy Colomb", avatar: "https://i.pravatar.cc/32?img=1" },
    { id: "s2", name: "Sophie Martin", avatar: "https://i.pravatar.cc/32?img=2" },
    { id: "s3", name: "Thomas Dubois", avatar: "https://i.pravatar.cc/32?img=3" },
    { id: "s4", name: "Claire Rousseau", avatar: "https://i.pravatar.cc/32?img=4" },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Si c'est la recherche, filtrer les contacts
    if (field === "searchQuery") {
      const contactList = mockContacts[formData.contactType] || [];
      const filtered = contactList.filter((contact) =>
        contact.name.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filtered);
    }

    // Si c'est le type de contact, réinitialiser la recherche
    if (field === "contactType") {
      setFormData((prev) => ({ ...prev, searchQuery: "", selectedContact: "" }));
      setSearchResults([]);
    }
  };

  const handleSelectContact = (contact) => {
    setFormData((prev) => ({
      ...prev,
      selectedContact: contact.id,
      selectedContactId: contact.id,
      searchQuery: contact.name,
      selectedProject: "",
      eventType: ""
    }));
    setSearchResults([]);
  };

  const toggleCollaborator = (collaboratorId) => {
    setFormData((prev) => ({
      ...prev,
      collaborators: prev.collaborators.includes(collaboratorId)
        ? prev.collaborators.filter((id) => id !== collaboratorId)
        : [...prev.collaborators, collaboratorId],
    }));
  };

  // Determine if form is valid based on current step
  const isFormValid = () => {
    if (step === 1) {
      // Step 1: Recherche annuaire must be selected
      if (!formData.directoryType) return false;

      // If Hors Annuaire is selected, form is valid with just that
      if (formData.directoryType === "hors-annuaire") return true;

      // If Annuaire is selected, need Type de contact
      if (!formData.contactType) return false;

      // If Client is selected, need a contact to be selected
      if (formData.contactType === "client") {
        if (!formData.selectedContactId) return false;
        // If client is selected, need project and event type
        if (!formData.selectedProject || !formData.eventType) return false;
      }

      return true;
    } else {
      // Step 2: Check all required fields
      if (!formData.title) return false;
      if (!formData.startDate || !formData.startTime) return false;
      if (!formData.endDate || !formData.endTime) return false;
      return true;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (step === 1) {
      // Initialize title with default value
      setFormData((prev) => ({
        ...prev,
        title: `${prev.eventType} - ${prev.searchQuery}`
      }));
      setStep(2);
    } else {
      // Save and close
      onSave(formData);
      setStep(1);
      onClose();
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      onClick={handleOverlayClick}
    >
      <div
        className="w-full rounded-2xl border border-neutral-200 bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '935px', width: '935px', maxHeight: 'calc(100vh - 48px)' }}
      >
        {/* En-tête */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F8F9FA] border-b border-[#E4E4E7] rounded-t-2xl flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white border border-[#E4E4E7] rounded-lg">
              <Calendar className="size-4 text-neutral-500" />
            </div>
            <h2 className="text-sm font-semibold text-[#1F2027]">Créer un rendez-vous</h2>
          </div>
          <button
            className="size-8 rounded-lg border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors"
            onClick={onClose}
            aria-label="Fermer"
          >
            <X className="size-4 text-neutral-500" />
          </button>
        </div>

        {/* Corps de la modale */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="px-6 py-6 space-y-4 flex-1 overflow-y-auto" style={{ overscrollBehavior: 'contain' }}>
            {step === 1 ? (
              // Step 1 content
              <>
            {/* Recherche Annuaire - Dropdown */}
            <div style={{ overflow: 'visible', position: 'relative', zIndex: 9999 }}>
              <section className="rounded-lg bg-[#F3F4F6] p-4 border border-[#E1E4ED]">
                <label className="block text-xs text-[#6B7280] font-medium mb-3">Recherche annuaire</label>
                <CustomSelect
                  value={formData.directoryType}
                  onChange={(value) => handleChange("directoryType", value)}
                  options={[
                    { value: "annuaire", label: "Rendez-vous annuaire" },
                    { value: "hors-annuaire", label: "Rendez-vous hors annuaire" }
                  ]}
                />
              </section>
            </div>

            {/* Type d'événement - Conditionnel pour Hors Annuaire */}
            {formData.directoryType === "hors-annuaire" && (
              <section className="rounded-lg bg-[#F3F4F6] p-4 border border-[#E1E4ED]">
                <label className="block text-xs text-[#6B7280] font-medium mb-3">Type d'événement</label>
                <CustomSelect
                  value=""
                  onChange={() => {}}
                  options={[
                    { value: "reunion", label: "Réunion" },
                    { value: "appel", label: "Appel" },
                    { value: "visite", label: "Visite" },
                    { value: "autre", label: "Autre" }
                  ]}
                />
              </section>
            )}

            {/* Type de contact - Conditionnel pour Annuaire */}
            {formData.directoryType === "annuaire" && (
              <section className="rounded-lg bg-[#F3F4F6] p-4 border border-[#E1E4ED]">
                <label className="block text-xs text-[#6B7280] font-medium mb-3">Type de contact</label>
                <CustomSelect
                  value={formData.contactType}
                  onChange={(value) => handleChange("contactType", value)}
                  options={[
                    { value: "client", label: "Client" },
                    { value: "fournisseur", label: "Fournisseur" },
                    { value: "salarie", label: "Salarié" },
                    { value: "prescripteur", label: "Prescripteur" }
                  ]}
                />
              </section>
            )}

            {/* Rechercher un contact - Conditionnel pour Annuaire avec type sélectionné */}
            {formData.directoryType === "annuaire" && formData.contactType && (
              <div style={{ overflow: 'visible', position: 'relative', zIndex: 9999 }}>
                <section className="rounded-lg bg-[#F3F4F6] p-4 border border-[#E1E4ED]">
                  <label className="block text-xs text-[#6B7280] font-medium mb-3">
                    Rechercher un {formData.contactType === "sous-traitant" ? "sous-traitant" : formData.contactType}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.searchQuery}
                      onChange={(e) => handleChange("searchQuery", e.target.value)}
                      placeholder={`Saisir le nom d'un ${formData.contactType}`}
                      className="w-full rounded-lg border border-[#E1E4ED] bg-white px-3 py-2.5 text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30"
                      id="search-input"
                    />

                    {/* Résultats de recherche */}
                    {searchResults.length > 0 && (
                      <div
                        className="bg-white border border-[#E1E4ED] rounded-lg shadow-lg z-[9999]"
                        style={{
                          position: 'fixed',
                          top: (document.getElementById('search-input')?.getBoundingClientRect().bottom ?? 0) + window.scrollY + 8,
                          left: document.getElementById('search-input')?.getBoundingClientRect().left ?? 0,
                          width: document.getElementById('search-input')?.getBoundingClientRect().width ?? 'auto'
                        }}
                      >
                        {searchResults.map((contact) => (
                          <button
                            key={contact.id}
                            type="button"
                            onClick={() => handleSelectContact(contact)}
                            className="w-full px-3 py-2.5 text-left text-sm text-[#1F2027] hover:bg-[#F3F4F6] border-b border-[#E1E4ED] last:border-b-0 transition-colors"
                          >
                            {contact.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}

            {/* Sélectionner un projet client - Conditionnel pour Client avec contact sélectionné */}
            {formData.directoryType === "annuaire" && formData.contactType === "client" && formData.selectedContactId && (
              <section className="rounded-lg bg-[#F3F4F6] p-4 border border-[#E1E4ED]">
                <label className="block text-xs text-[#6B7280] font-medium mb-3">Sélectionner un projet client</label>
                <CustomSelect
                  value={formData.selectedProject}
                  onChange={(value) => handleChange("selectedProject", value)}
                  options={(mockProjectsByClient[formData.selectedContactId] || []).map((project) => ({
                    value: project.id,
                    label: project.name
                  }))}
                />
              </section>
            )}

            {/* Type d'événement - Conditionnel pour Client avec contact sélectionné */}
            {formData.directoryType === "annuaire" && formData.contactType === "client" && formData.selectedContactId && (
              <section className="rounded-lg bg-[#F3F4F6] p-4 border border-[#E1E4ED]">
                <label className="block text-xs text-[#6B7280] font-medium mb-3">Type d'événement</label>
                <CustomSelect
                  value={formData.eventType}
                  onChange={(value) => handleChange("eventType", value)}
                  options={[
                    { value: "R1", label: "R1" },
                    { value: "R2", label: "R2" },
                    { value: "R3", label: "R3" },
                    { value: "R4", label: "R4" },
                    { value: "R5", label: "R5" }
                  ]}
                />
              </section>
            )}
              </>
            ) : (
              // Step 2 content
              <>
                {/* 1. Titre du rendez-vous */}
                <section className="rounded-lg bg-[#F3F4F6] p-4 border border-[#E1E4ED]">
                  <label className="block text-xs text-[#6B7280] font-medium mb-3">Titre du rendez-vous</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Titre du rendez-vous"
                    className="w-full rounded-lg border border-[#E1E4ED] bg-white px-3 py-2.5 text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30"
                  />
                </section>

                {/* 2. Dates et heures */}
                <section className="rounded-lg bg-[#F3F4F6] p-4 border border-[#E1E4ED]">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-xs text-[#6B7280] font-medium">Dates et heures du rendez-vous</label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#6B7280] font-medium">Récurrent</span>
                      <ToggleSwitch
                        value={formData.isRecurrent}
                        onChange={(value) => handleChange("isRecurrent", value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <DatePickerField
                        value={formData.startDate}
                        onChange={(value) => handleChange("startDate", value)}
                        label="Date de début"
                      />
                    </div>
                    <div className="flex-1">
                      <TimePickerField
                        value={formData.startTime}
                        onChange={(value) => handleChange("startTime", value)}
                        label="Heure de début"
                      />
                    </div>
                    <div className="w-px bg-[#E1E4ED]"></div>
                    <div className="flex-1">
                      <DatePickerField
                        value={formData.endDate}
                        onChange={(value) => handleChange("endDate", value)}
                        label="Date de fin"
                      />
                    </div>
                    <div className="flex-1">
                      <TimePickerField
                        value={formData.endTime}
                        onChange={(value) => handleChange("endTime", value)}
                        label="Heure de fin"
                      />
                    </div>
                  </div>
                </section>

                {/* 3. Collaborateurs et Privé */}
                <section className="rounded-lg bg-[#F3F4F6] p-4 border border-[#E1E4ED]">
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <label className="block text-xs text-[#6B7280] font-medium mb-3">Collaborateurs (choix multiple)</label>
                      <CustomMultiSelect
                        value={formData.collaborators}
                        onChange={(value) => handleChange("collaborators", value)}
                        options={mockCollaborators.map((collab) => ({
                          value: collab.id,
                          label: collab.name,
                          avatar: collab.avatar
                        }))}
                        placeholder="Sélectionner des collaborateurs"
                      />
                    </div>

                    <div className="w-[15%] flex-shrink-0">
                      <label className="block text-xs text-[#6B7280] font-medium mb-3">Privé</label>
                      <ToggleSwitch
                        value={formData.isPrivate}
                        onChange={(value) => handleChange("isPrivate", value)}
                      />
                    </div>
                  </div>
                </section>

                {/* 4. Lieu et Lien visio */}
                <section className="rounded-lg bg-[#F3F4F6] p-4 border border-[#E1E4ED]">
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <label className="block text-xs text-[#6B7280] font-medium mb-3">Lieu du rendez-vous</label>
                      <CustomSelect
                        value={formData.locationType}
                        onChange={(value) => {
                          handleChange("locationType", value);
                          // Reset related fields when type changes
                          handleChange("clientAddress", "");
                          handleChange("otherAddress", "");
                          handleChange("otherAddressSearch", "");
                          setAddressSearchResults([]);
                        }}
                        options={[
                          { value: "showroom", label: "Showroom" },
                          { value: "adresse-client", label: "Adresse client" },
                          { value: "autre-adresse", label: "Autre adresse" },
                          { value: "rdv-tel", label: "RDV tel" }
                        ]}
                      />

                      {/* Dropdown pour adresse client */}
                      {formData.locationType === "adresse-client" && (
                        <div className="mt-3">
                          <CustomSelect
                            value={formData.clientAddress}
                            onChange={(value) => handleChange("clientAddress", value)}
                            options={
                              formData.selectedContactId && mockAddressesByClient[formData.selectedContactId]
                                ? mockAddressesByClient[formData.selectedContactId].map((addr) => ({
                                    value: addr.id,
                                    label: addr.address
                                  }))
                                : []
                            }
                            placeholder="Sélectionner une adresse"
                          />
                        </div>
                      )}

                      {/* Champ de recherche pour autre adresse */}
                      {formData.locationType === "autre-adresse" && (
                        <div className="mt-3">
                          <div style={{ overflow: 'visible', position: 'relative', zIndex: 'auto' }}>
                            <input
                              type="text"
                              value={formData.otherAddressSearch}
                              onChange={(e) => {
                                handleChange("otherAddressSearch", e.target.value);

                                // Annuler le timer précédent
                                if (addressSearchTimeoutRef.current) {
                                  clearTimeout(addressSearchTimeoutRef.current);
                                }

                                // Recherche API avec Nominatim avec debounce
                                if (e.target.value.length > 2) {
                                  addressSearchTimeoutRef.current = setTimeout(() => {
                                    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(e.target.value)}&countrycodes=fr&limit=5&addressdetails=1`)
                                      .then(response => response.json())
                                      .then(data => {
                                        const results = data.map((item) => {
                                          const address = item.address;
                                          // Extraire les infos essentielles
                                          const voie = address.road || '';
                                          const numero = address.house_number || '';
                                          const codePostal = address.postcode || '';
                                          const ville = address.city || address.town || address.village || '';

                                          // Construire l'adresse formatée
                                          const adresseFormatee = [
                                            numero && voie ? `${numero} ${voie}` : voie,
                                            codePostal,
                                            ville
                                          ].filter(Boolean).join(', ');

                                          return {
                                            id: item.place_id,
                                            address: adresseFormatee || item.display_name
                                          };
                                        });
                                        setAddressSearchResults(results);
                                      })
                                      .catch(error => {
                                        console.error('Erreur lors de la recherche:', error);
                                        setAddressSearchResults([]);
                                      });
                                  }, 500); // Attendre 500ms après que l'utilisateur arrête de taper
                                } else {
                                  setAddressSearchResults([]);
                                }
                              }}
                              placeholder="Rechercher une adresse..."
                              id="address-search-input"
                              className="w-full rounded-lg border border-[#E1E4ED] bg-white px-3 py-2.5 text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30"
                            />
                            {addressSearchResults.length > 0 && (
                              <div
                                className="bg-white border border-[#E1E4ED] rounded-lg shadow-lg"
                                style={{
                                  position: 'fixed',
                                  top: (document.getElementById('address-search-input')?.getBoundingClientRect().bottom ?? 0) + window.scrollY + 8,
                                  left: document.getElementById('address-search-input')?.getBoundingClientRect().left ?? 0,
                                  width: document.getElementById('address-search-input')?.getBoundingClientRect().width ?? 'auto',
                                  maxHeight: '200px',
                                  overflowY: 'auto',
                                  zIndex: 50
                                }}
                              >
                                {addressSearchResults.map((result) => (
                                  <button
                                    key={result.id}
                                    type="button"
                                    onClick={() => {
                                      handleChange("otherAddress", result.address);
                                      handleChange("otherAddressSearch", result.address);
                                      setAddressSearchResults([]);
                                    }}
                                    className="w-full px-3 py-2.5 text-left text-sm text-[#1F2027] hover:bg-[#F9F9F9] border-b border-[#EEEEEE] last:border-b-0 transition-colors"
                                  >
                                    {result.address}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="w-[15%] flex-shrink-0">
                      <label className="block text-xs text-[#6B7280] font-medium mb-3">Créer un lien visio</label>
                      <ToggleSwitch
                        value={formData.createVideoLink}
                        onChange={(value) => handleChange("createVideoLink", value)}
                      />
                    </div>
                  </div>
                </section>

                {/* 5. Commentaire */}
                <section className="rounded-lg bg-[#F3F4F6] p-4 border border-[#E1E4ED]">
                  <label className="block text-xs text-[#6B7280] font-medium mb-3">Commentaire de l'événement</label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => handleChange("comment", e.target.value)}
                    placeholder="Saisir un commentaire..."
                    rows={3}
                    className="w-full rounded-lg border border-[#E1E4ED] bg-white px-3 py-2.5 text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 resize-none"
                  />
                </section>

                {/* 6. Informations supplémentaires */}
                <section className="rounded-lg bg-[#F3F4F6] p-4 border border-[#E1E4ED]">
                  <label className="block text-xs text-[#6B7280] font-medium mb-3">Informations supplémentaires</label>
                  <textarea
                    value={formData.additionalInfo}
                    onChange={(e) => handleChange("additionalInfo", e.target.value)}
                    placeholder="Ajouter des informations supplémentaires..."
                    rows={3}
                    className="w-full rounded-lg border border-[#E1E4ED] bg-white px-3 py-2.5 text-sm text-[#1F2027] placeholder:text-[#A1A7B6] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 resize-none"
                  />
                </section>
              </>
            )}
          </div>

          {/* Pied de la modale */}
          <div className="px-6 pb-6 pt-2 flex items-center gap-3 border-t border-[#E4E4E7] flex-shrink-0 bg-white relative z-10">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 px-4 py-2.5 rounded-lg border border-white bg-white text-[#6B7280] text-sm font-medium hover:bg-neutral-50 transition-colors"
            >
              {step === 1 ? "Fermer" : "Retour"}
            </button>
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                isFormValid()
                  ? "border-[#2B7FFF] bg-[#2B7FFF] text-white hover:bg-[#1F6FE6]"
                  : "border-[#D1D5DB] bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed"
              }`}
            >
              {step === 1 ? "Suivant" : "Créer l'événement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AppointmentDetailModal({ isOpen, onClose, onDelete, onEdit, eventPosition }) {
  const [position, setPosition] = React.useState({ top: 0, left: 0, side: 'right' });

  React.useEffect(() => {
    if (isOpen && eventPosition) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const modalWidth = 380; // Largeur fixe de la modale
      const modalHeight = 500; // Hauteur approximative
      const gap = 16; // Écart avec l'événement

      let side = 'right';
      let left = eventPosition.right + gap;

      // Si pas de place à droite, afficher à gauche
      if (left + modalWidth > viewportWidth) {
        side = 'left';
        left = eventPosition.left - modalWidth - gap;
      }

      // S'assurer que la modale n'est pas complètement sortie du viewport
      if (left < 0) {
        left = gap;
        side = 'right';
      }

      // Positionnement vertical : centré par rapport à l'événement
      let top = eventPosition.top + (eventPosition.height / 2) - (modalHeight / 2);

      // Éviter que la modale sorte du viewport verticalement
      if (top < 0) top = gap;
      if (top + modalHeight > viewportHeight) top = viewportHeight - modalHeight - gap;

      setPosition({ top, left, side });
    }
  }, [isOpen, eventPosition]);

  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    const handleClickOutside = (e) => {
      if (isOpen && e.target === e.currentTarget) onClose();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Mock data
  const appointmentData = {
    title: "RDV R1 Dupont",
    clientName: "Chloé Dubois",
    date: "Mardi 13 avril",
    startTime: "11:30",
    endTime: "13:30",
    type: "home", // home ou visio
    collaborators: [
      { id: "1", avatarUrl: "https://i.pravatar.cc/40?img=12" },
      { id: "2", avatarUrl: "https://i.pravatar.cc/40?img=8" },
    ],
    location: "Extérieur 19 rue voltaire, lyon, 69003",
  };

  return (
    <>
      {/* Overlay pour fermer */}
      <div
        className="fixed inset-0 z-30"
        onClick={onClose}
        style={{ cursor: 'default' }}
      />

      {/* Modale positionnée */}
      <div
        className="fixed z-40 w-96 rounded-2xl border border-neutral-200 bg-white shadow-xl"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-[#F8F9FA] rounded-t-2xl">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex size-10 items-center justify-center rounded-lg border border-neutral-200 bg-white">
              <Calendar className="size-5 text-neutral-600" strokeWidth={1} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-neutral-900 truncate">
                  {appointmentData.title}
                </h3>
                {appointmentData.type === 'visio' && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-neutral-900 text-white text-xs font-medium flex-shrink-0">
                    📹 Visio
                  </span>
                )}
                {appointmentData.type === 'home' && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-neutral-900 text-white text-xs font-medium flex-shrink-0">
                    🏠 Maison
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-1">{appointmentData.clientName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-lg border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors flex-shrink-0 ml-2"
            aria-label="Fermer"
          >
            <X className="size-4 text-neutral-500" />
          </button>
        </div>

        {/* Corps */}
        <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
          <div className="px-6 py-4 space-y-3">
            {/* Informations du rendez-vous */}
            <div className="rounded-xl bg-[#F8F9FA] border border-[#E9E9E9] px-4 py-3">
              <p className="text-xs text-neutral-600 mb-1">Informations du rendez-vous</p>
              <p className="text-sm font-medium text-neutral-900">
                {appointmentData.date} {appointmentData.startTime} - {appointmentData.endTime}
              </p>
            </div>

            {/* Participants */}
            <div className="rounded-xl bg-[#F8F9FA] border border-[#E9E9E9] px-4 py-3">
              <p className="text-xs text-neutral-600 mb-2">Participants</p>
              <div className="flex -space-x-2">
                {appointmentData.collaborators.map((collab) => (
                  <img
                    key={collab.id}
                    src={collab.avatarUrl}
                    alt=""
                    className="size-8 rounded-full border-2 border-white"
                  />
                ))}
              </div>
            </div>

            {/* Lieu */}
            <div className="rounded-xl bg-[#F8F9FA] border border-[#E9E9E9] px-4 py-3">
              <p className="text-xs text-neutral-600 mb-1">Lieu du rendez-vous</p>
              <div className="flex items-start gap-2">
                <span className="text-lg flex-shrink-0 mt-0.5">📍</span>
                <p className="text-sm font-medium text-neutral-900">{appointmentData.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between gap-2">
          <button
            onClick={onDelete}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            <Trash2 className="size-4" />
            Supprimer
          </button>
          <button
            onClick={onEdit}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <Pencil className="size-4" />
            Modifier
          </button>
        </div>
      </div>
    </>
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
  // Récupérer les rendez-vous depuis Supabase
  const { appointments: supabaseAppointments, loading, error } = useAppointments();

  // Transformer les rendez-vous Supabase au format UI
  const transformedAppointments = supabaseAppointments.map(appointment =>
    transformAppointmentForAgenda(appointment)
  );

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
  const [eventPosition, setEventPosition] = useState(null);

  const currentWeek = useMemo(() => {
    // D'abord, chercher dans WEEK_PRESETS
    const preset = WEEK_PRESETS.find((preset) => preset.rangeLabel === selectedWeekRange);
    if (preset) return preset;

    // Si pas trouvé, générer dynamiquement la semaine à partir de la plage
    // Parser la plage pour extraire la date de début
    const [startStr] = selectedWeekRange.split(' - ');
    if (!startStr) return WEEK_PRESETS[0];

    const [day, month] = startStr.split('/');
    const date = new Date();
    date.setMonth(parseInt(month) - 1);
    date.setDate(parseInt(day));

    return generateWeekFromDate(date);
  }, [selectedWeekRange]);

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

  const handleEventClick = (event, clickEvent) => {
    setSelectedEvent(event);
    if (clickEvent?.target) {
      const rect = clickEvent.target.getBoundingClientRect();
      setEventPosition({
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
      });
    }
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
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 mb-4"></div>
              <p className="text-neutral-600">Chargement des rendez-vous...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <p className="text-red-600 font-semibold">Erreur lors du chargement</p>
              <p className="text-neutral-600 text-sm mt-2">{error}</p>
            </div>
          </div>
        ) : (
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
        )}
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
          setEventPosition(null);
        }}
        onDelete={() => {
          console.log("Supprimer le rendez-vous:", selectedEvent);
          setDetailModalOpen(false);
          setSelectedEvent(null);
          setEventPosition(null);
        }}
        onEdit={() => {
          console.log("Modifier le rendez-vous:", selectedEvent);
          setDetailModalOpen(false);
          setSelectedEvent(null);
          setEventPosition(null);
          // Ici vous pourriez ouvrir une modale d'édition
        }}
        eventPosition={eventPosition}
      />
    </div>
  );
}
