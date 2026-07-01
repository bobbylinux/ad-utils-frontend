import { useActionState, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./CreateADUser.css";

interface ActionState {
  success: boolean | null;
  message: string | null;
}

const initialState: ActionState = {
  success: null,
  message: null,
};

function CreateADUser() {
  const [userType, setUserType] = useState("");
  // Ref per resettare nativamente il form in modo sicuro se necessario
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    async (
      _prevState: ActionState,
      formData: FormData,
    ): Promise<ActionState> => {
      if (formData.get("script_type") === "EXT") {
        formData.set("user_id", "");
      }

      const user_id = formData.get("user_id");
      const first_name = formData
        .get("first_name")
        ?.toString()
        .trim()
        .toUpperCase();
      const last_name = formData
        .get("last_name")
        ?.toString()
        .trim()
        .toUpperCase();
      const tax_code = formData
        .get("tax_code")
        ?.toString()
        .trim()
        .toUpperCase();
      const email = formData.get("email")?.toString().trim().toLowerCase();
      const script_type = formData.get("script_type");

      try {
        const response = await fetch("/api/create_user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id,
            first_name,
            last_name,
            tax_code,
            email,
            script_type,
          }),
        });

        if (!response.ok) {
          try {
            const errorData = await response.json();
            const errorMsg =
              errorData.error || "Errore durante la creazione dell'utente.";
            const dettaglioMsg = errorData.dettaglio
              ? `\nDettaglio: ${errorData.dettaglio}`
              : "";

            return {
              success: false,
              message: `${errorMsg}${dettaglioMsg}`,
            };
          } catch {
            // Fallback se la response non è un JSON valido
            return {
              success: false,
              message:
                "Errore durante la creazione dell'utente (Risposta server non valida).",
            };
          }
        }

        const data = await response.json();

        return {
          success: true,
          message: `Utente ${first_name} ${last_name} creato con successo!\n ${data.message || ""}`,
        };
      } catch (error) {
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : `Si è verificato un errore imprevisto!\n ${error}`,
        };
      }
    },
    initialState,
  );
  useEffect(() => {
    if (state.success) {
      // setUserType("");
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <>
      <div className="flex items-center justify-center bg-blue-300 p-6">
        <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl">
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← Torna alla Home
            </Link>
          </div>
          <h1 className="mb-6 text-2xl font-bold text-slate-700 text-center">
            Creazione Nuovo Utente Active Directory
          </h1>

          <form ref={formRef} action={formAction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Tipologia Utente
              </label>
              <select
                name="script_type"
                value={userType}
                required
                onChange={(e) => setUserType(e.target.value)}
                disabled={isPending}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-hidden disabled:bg-slate-100 cursor-pointer"
              >
                <option value="DIP">Dipendente</option>{" "}
                <option value="EXT">Personale Esterno</option>
                <option value="MMG">
                  Abilitazione Scarico Referti (MMG_PLS)
                </option>
                <option value="O4C">Abilitazione O4C Argos</option>
              </select>
            </div>

            {userType !== "EXT" && (
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Matricola
                </label>
                <input
                  name="user_id"
                  type="number"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-hidden disabled:bg-slate-100"
                  placeholder="es. 123456"
                  disabled={isPending}
                  required={userType !== "EXT"} // Rende la matricola obbligatoria se non è esterno
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Nome
              </label>
              <input
                name="first_name"
                type="text"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-hidden disabled:bg-slate-100"
                placeholder="es. MARIO"
                required
                disabled={isPending}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Cognome
              </label>
              <input
                name="last_name"
                type="text"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-hidden disabled:bg-slate-100"
                placeholder="es. ROSSI"
                required
                disabled={isPending}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Codice Fiscale
              </label>
              <input
                name="tax_code"
                type="text"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-hidden disabled:bg-slate-100"
                placeholder="es. TXACDE80A01D612W"
                required
                disabled={isPending}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Indirizzo E-Mail
              </label>
              <input
                name="email"
                type="text"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-hidden disabled:bg-slate-100"
                placeholder="es. mario.rossi@uslcentro.toscana.it"
                required
                disabled={isPending}
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-blue-600 mt-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isPending ? "Creazione in corso..." : "Crea Utente"}
            </button>
          </form>

          {/* Feedback visivo per l'utente (Successo / Errore) */}
          {state.message && (
            <div
              className={`mt-4 p-3 rounded-lg text-sm text-center font-medium whitespace-pre-line ${
                state.success
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {state.message}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CreateADUser;
