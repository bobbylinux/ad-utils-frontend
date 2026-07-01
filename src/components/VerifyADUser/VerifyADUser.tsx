import { Link } from "react-router-dom";
import { useActionState, useState, useEffect, useRef } from "react";

interface ADDetails {
  dn?: string;
  sam_account_name?: string;
  object_class?: string;
  associations?: string[];
}

interface ADResponse {
  status: string;
  present: boolean;
  target: string;
  message?: string;
  details?: ADDetails;
}

interface ActionState {
  success: boolean | null;
  message: string | null;
  data?: ADResponse | null;
}

const initialState: ActionState = {
  success: null,
  message: null,
  data: null,
};

function VerifyADUser() {
  // Impostiamo il tipo di default su "utenza"
  const [objectType, setObjectType] = useState("utenza");
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    async (
      _prevState: ActionState,
      formData: FormData,
    ): Promise<ActionState> => {
      const sam_account_name = formData
        .get("tax_code")
        ?.toString()
        .trim();

      const selected_type = formData.get("object_type")?.toString() || "utenza";

      if (!sam_account_name) {
        return { success: false, message: "Inserire un nome o codice valido.", data: null };
      }

      try {
        const response = await fetch("/api/verify_user_and_group", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sam_account_name,
            object_type: selected_type, // "utenza" o "gruppo"
          }),
        });

        if (!response.ok) {
          try {
            const errorData = await response.json();
            const errorMsg = errorData.error || "Errore durante la verifica.";
            const dettaglioMsg = errorData.dettaglio ? `\nDettaglio: ${errorData.dettaglio}` : "";

            return {
              success: false,
              message: `${errorMsg}${dettaglioMsg}`,
              data: null,
            };
          } catch {
            return {
              success: false,
              message: "Errore durante la verifica (Risposta server non valida).",
              data: null,
            };
          }
        }

        const data: ADResponse = await response.json();

        if (!data.present) {
          return {
            success: true,
            message: data.message || `L'oggetto '${sam_account_name}' (${selected_type}) NON è presente in AD.`,
            data: data,
          };
        }

        return {
          success: true,
          message: "Oggetto trovato con successo.",
          data: data,
        };
      } catch (error) {
        return {
          success: false,
          message: error instanceof Error ? error.message : `Errore imprevisto!\n ${error}`,
          data: null,
        };
      }
    },
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      // Manteniamo sincronizzato il select anche dopo il reset nativo del form
      setObjectType("utenza");
    }
  }, [state.success]);

  return (
    <>
      <div className="flex items-center justify-center bg-blue-300 p-6 min-h-screen">
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
            Verifica Esistenza Utente o Gruppo Active Directory
          </h1>
          
          <form ref={formRef} action={formAction} className="space-y-4">
            {/* NUOVO SELETTORE DEL TIPO DI OGGETTO */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Tipo di oggetto da cercare
              </label>
              <select
                name="object_type"
                value={objectType}
                onChange={(e) => setObjectType(e.target.value)}
                disabled={isPending}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-hidden disabled:bg-slate-100"
              >
                <option value="utenza">Utenza (sAMAccountName / Matricola / CF)</option>
                <option value="gruppo">Gruppo AD (CN / Nome Gruppo)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                {objectType === "utenza" ? "Username / Matricola / CF" : "Nome del Gruppo AD"}
              </label>
              <input
                name="tax_code"
                type="text"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-hidden disabled:bg-slate-100"
                placeholder={objectType === "utenza" ? "es. TXACDE80A01D612W" : "es. Sistemi_Informativi_Admin"}
                required
                disabled={isPending}
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-blue-600 mt-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isPending ? "Verifica in corso..." : "Verifica"}
            </button>
          </form>

          {/* RENDERING FEEDBACK VISIVO */}
          {(state.message || state.data) && (
            <div className="mt-6 space-y-3">
              {state.success && state.data?.present ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between border-b border-green-100 pb-2 mb-3">
                    <span className="text-sm font-semibold text-green-900 flex items-center gap-1.5">
                      ✅ Oggetto Trovato in AD
                    </span>
                    <span className="px-2 py-0.5 text-xs font-bold uppercase rounded bg-green-200 text-green-800">
                      {state.data.details?.object_class?.includes("user") ||
                      state.data.details?.object_class?.includes("person")
                        ? "Utenza"
                        : "Gruppo"}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-gray-700 mb-4">
                    <div>
                      <span className="font-semibold text-gray-500 block uppercase tracking-wider text-[10px]">
                        sAMAccountName
                      </span>
                      <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200 text-gray-900 inline-block mt-0.5">
                        {state.data.details?.sam_account_name || "N/D"}
                      </span>
                    </div>

                    <div>
                      <span className="font-semibold text-gray-500 block uppercase tracking-wider text-[10px]">
                        Distinguished Name (DN)
                      </span>
                      <span className="font-mono text-gray-600 block break-all bg-gray-50 p-1.5 rounded border border-gray-100 mt-0.5">
                        {state.data.details?.dn}
                      </span>
                    </div>
                  </div>

                  {/* SEZIONE ASSOCIAZIONI */}
                  <div className="border-t border-green-100 pt-3">
                    <span className="font-semibold text-gray-600 block uppercase tracking-wider text-[10px] mb-2">
                      {state.data.details?.object_class?.includes("user") ||
                      state.data.details?.object_class?.includes("person")
                        ? "Gruppi di Appartenenza Utenza"
                        : "Membri Associati al Gruppo"}
                    </span>

                    {state.data.details?.associations && state.data.details.associations.length > 0 ? (
                      <div className="max-h-44 overflow-y-auto bg-white border border-gray-200 rounded-lg p-2 space-y-1 shadow-inner">
                        {state.data.details.associations.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1.5 text-xs text-gray-800 font-medium py-0.5 px-1 hover:bg-gray-50 rounded"
                          >
                            <span className="text-gray-400">•</span>
                            <span className="font-mono">{item}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs italic text-gray-400 block bg-gray-50 p-2 rounded text-center border border-dashed">
                        Nessuna associazione trovata per questo oggetto.
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className={`p-3 rounded-lg text-sm text-center font-medium whitespace-pre-line ${
                    state.success && state.data?.present === false
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "bg-red-100 text-red-800 border border-red-200"
                  }`}
                >
                  {state.message}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default VerifyADUser;