import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CreateWatchlistModal from "./components/CreateWatchlistModal.tsx";

type NavbarProps = {
    setSearchQuery: (v: string) => void;
};

export default function Navbar({ setSearchQuery }: NavbarProps) {
    const [user, setUser] = useState<{ name: string } | null>(null);
    const nav = useNavigate();
    const [inputValue, setInputValue] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchQuery(inputValue.trim());
    };

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const [theme, setTheme] = useState<string>(
        localStorage.getItem("theme") || (prefersDark ? "dark" : "light")
    );

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === "light" ? "dark" : "light"));
    };

    const host =
        window.location.host === "localhost:5173"
            ? "http://localhost:8080"
            : window.location.origin;

    function login() {
        window.location.href = host + "/oauth2/authorization/github";
    }

    function logout() {
        window.location.href = host + "/logout";
    }

    useEffect(() => {
        axios
            .get(host + "/api/auth/me", { withCredentials: true })
            .then(res => setUser(res.data))
            .catch(() => setUser(null));
    }, []);

    return (
        <div className="navbar">
            <div className="navbar-left">
                <Link to="/">
                    {theme === "light" ? (
                        <img className="logo" src="/Watchly_white_1.png" alt="Watchly Logo" />
                    ) : (
                        <img className="logo" src="/Watchly_black_1.png" alt="Watchly Logo" />
                    )}
                </Link>
            </div>

            <div className="navbar-center">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Filmtitel eingeben..."
                    />
                    <button type="submit">Suchen</button>
                </form>
            </div>

            <div className="navbar-right">
                <button onClick={toggleTheme} className="theme-toggle">
                    {theme === "light" ? "🌙" : "☀️"}
                </button>

                {user && (
                    <button className="btn-secondary" onClick={() => setModalOpen(true)}>➕</button>
                )}

                <CreateWatchlistModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onCreated={() => {
                        window.location.reload()
                    }}
                />

                {user && (
                    <button className="btn" onClick={() => nav("/watchlist")}>
                        Watchlist
                    </button>
                )}

                {!user && (
                    <button className="btn-secondary" onClick={login}>
                        Login with Github
                    </button>
                )}

                {user && (
                    <button className="btn-secondary" onClick={logout}>
                        Logout
                    </button>
                )}

            </div>
        </div>
    );
}
