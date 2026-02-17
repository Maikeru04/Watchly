import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

type NavbarProps = {
    theme: string;
    toggleTheme: () => void;
    inputValue: string;
    setInputValue: (v: string) => void;
    onSearch: () => void;
};

export default function Navbar({theme, toggleTheme, inputValue, setInputValue, onSearch}: NavbarProps) {
    const [user, setUser] = useState<{ name: string } | null>(null);
    const nav = useNavigate();

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
                <form onSubmit={(e) => {e.preventDefault(); onSearch();}}>
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
