import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useAppointments } from "../hooks/useAppointments";

export default function ProjectCalendarTab({ project }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Use the project's contact ID to fetch appointments
  const { appointments, loading } = useAppointments(project?.id_contact);

  // Since we don't have a way to create appointments from the project page
  // and the appointments are linked to the contact, we'll just show them as read-only
  const handleAddAppointment = () => {
    // Could open a modal or redirect to contact page to add appointment
    alert("Veuillez créer le rendez-vous depuis la page de contact");
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-neutral-500">
        Chargement des rendez-vous...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rendez-vous Section */}
      <div className="rounded-xl border p-6 bg-gray-50 border-gray-200">
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">
            Liste des rendez-vous
          </h3>
          <button
            onClick={handleAddAppointment}
            className="px-4 py-2 rounded-lg bg-white border border-[#E5E5E5] hover:bg-neutral-50 text-sm font-medium transition-colors whitespace-nowrap"
          >
            + Ajouter un RDV
          </button>
        </div>
        {appointments.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">
            Vous n'avez pas renseigné de rendez-vous
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-xl border border-[#E5E5E5] p-4 space-y-2"
              >
                <h4 className="font-semibold text-neutral-900">
                  {appointment.titre || "Sans titre"}
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-neutral-600">
                  <div>
                    <span className="font-medium">📅 Date:</span>{" "}
                    {new Date(appointment.date_debut).toLocaleDateString(
                      "fr-FR"
                    )}
                  </div>
                  <div>
                    <span className="font-medium">🕐 Heure:</span>{" "}
                    {appointment.heure_debut} - {appointment.heure_fin}
                  </div>
                  <div>
                    <span className="font-medium">📍 Lieu:</span>{" "}
                    {appointment.lieu || "Non spécifié"}
                  </div>
                  {appointment.commentaires && (
                    <div>
                      <span className="font-medium">📝 Notes:</span>{" "}
                      {appointment.commentaires}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
