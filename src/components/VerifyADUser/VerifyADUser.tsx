import { Link } from "react-router-dom";
import { useActionState, useState, useEffect, useRef } from "react";

interface ActionState {
  success: boolean | null;
  message: string | null;
}

const initialState: ActionState = {
  success: null,
  message: null,
};

function VerifyADUser() {
  const [userType, setUserType] = useState("");
  // Ref per resettare nativamente il form in modo sicuro se necessario
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    async (
      _prevState: ActionState,
      formData: FormData,
    ): Promise<ActionState> => {
      const tax_code = formData
        .get("tax_code")
        ?.toString()
        .trim()
        .toUpperCase();
      try {
        const response = await fetch("/api/verify_user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tax_code,
          }),
        });

        if (!response.ok) {
          try {
            const errorData = await response.json();
            const errorMsg =
              errorData.error || "Errore durante la verifica dell'utente.";
            const dettaglioMsg = errorData.dettaglio
              ? `\nDettaglio: ${errorData.dettaglio}`
              : "";

            return {
              success: false,
              message: `${errorMsg}${dettaglioMsg}`,
            };
          } catch {
            return {
              success: false,
              message:
                "Errore durante la verifica dell'utente (Risposta server non valida).",
            };
          }
        }

        const data = await response.json();

        return {
          success: true,
          message: ``,
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
            Verifica Esistenza Utente o Gruppo Active Directory
          </h1>
          <form ref={formRef} action={formAction} className="space-y-4">
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Nome
            </label>
            <input
              name="tax_code"
              type="text"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-hidden disabled:bg-slate-100"
              placeholder="es. TXACDE80A01D612W"
              required
              disabled={isPending}
            />
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-blue-600 mt-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isPending ? "Creazione in corso..." : "Verifica"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default VerifyADUser;
