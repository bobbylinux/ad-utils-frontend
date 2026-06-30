import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex items-center justify-center min-h-11/12 bg-blue-300 gap-8 p-6">
      <div className="w-full max-w-sm">
        <div className="rounded-xl bg-white shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow cursor-pointer">
          <Link to="/create_ad_users">
            <h2 className="text-xl font-semibold text-slate-800">
              Creazione Utenti AD UC
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Gestione e creazione di nuovi utenti all'interno di Active
              Directory Users and Computers.
            </p>
          </Link>
        </div>
      </div>
      <div className="w-full max-w-sm">
        <div className="rounded-xl bg-white shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow cursor-pointer">
          <Link to="/create_ad_users">
            <h2 className="text-xl font-semibold text-slate-800">
              Verifica Censimento Utenti AD UC
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Gestione e creazione di nuovi utenti all'interno di Active
              Directory Users and Computers.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
