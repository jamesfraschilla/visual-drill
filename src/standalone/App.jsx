import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "../auth/AuthContext.js";
import VisualDrillGenerator from "../pages/VisualDrillGenerator.jsx";
import { readLocalStorage, writeLocalStorage } from "../storage.js";

const THEME_STORAGE_KEY = "visual-drill:theme";

export default function App() {
  const [theme, setTheme] = useState(() => readLocalStorage(THEME_STORAGE_KEY) || "dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    writeLocalStorage(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const authValue = useMemo(() => ({
    accountsEnabled: false,
    session: null,
    user: null,
    profile: null,
    loading: false,
    error: "",
    emailSentTo: "",
    requiresPasswordReset: false,
    featureFlags: [],
    clearError() {},
    async signInWithPassword() {
      throw new Error("Accounts are not enabled in this standalone app.");
    },
    async sendMagicLink() {
      throw new Error("Accounts are not enabled in this standalone app.");
    },
    async sendPasswordReset() {
      throw new Error("Accounts are not enabled in this standalone app.");
    },
    async signOut() {},
    async completePasswordReset() {
      throw new Error("Accounts are not enabled in this standalone app.");
    },
    hasFeature() {
      return false;
    },
    canUseMatchUps: false,
    isAdmin: false,
    isCoach: false,
  }), []);

  return (
    <AuthContext.Provider value={authValue}>
      <div className="standalone-shell">
        <header className="standalone-header">
          <div>
            <div className="standalone-eyebrow">Offline-ready</div>
            <h1>Visual Drill</h1>
          </div>
          <button
            type="button"
            className="theme-button"
            onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </header>
        <main>
          <VisualDrillGenerator showIntro={false} />
        </main>
      </div>
    </AuthContext.Provider>
  );
}
