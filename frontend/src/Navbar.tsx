import { useEffect, useState } from "react";
import { movieService } from "./api/MovieService.ts";
import type { Movie } from "./types/Movie.ts";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type NavbarProps = {
    setMovies: (movies: Movie[]) => void;
    setLoading: (loading: boolean) => void;
};

export default function Navbar({ setMovies, setLoading }: NavbarProps) {
    const [inputValue, setInputValue] = useState("");
    const [user, setUser] = useState<{ name: string } | null>(null);
    const nav = useNavigate();

    const host = window.location.host === "localhost:5173"
        ? "http://localhost:8080"
        : window.location.origin;

    function login() {
        const host = window.location.host === "localhost:5173"
            ? "http://localhost:8080"
            : window.location.origin;
        window.location.href = host + "/oauth2/authorization/github";
    }

    function logout() {
        const host = window.location.host === "localhost:5173"
            ? "http://localhost:8080"
            : window.location.origin;
        window.location.href = host + "/logout";
    }


    const handleSubmit = async () => {
        setLoading(true);
        const results = await movieService(inputValue);
        setMovies(results);
        setLoading(false);
    };

    const fetchUser = async () => {
        try {
            const res = await axios.get(host + "/api/auth/me", { withCredentials: true });
            setUser(res.data);
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div className={"navbar"}>
            <div className="navbar-left">
                <button onClick={() => nav("/")}>Home</button>
            </div>
            <div className={"navbar-center"}>
                <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        placeholder="Filmtitel eingeben..."
                    />
                    <button type="submit">Suchen</button>
                </form>
            </div>
            <div className={"navbar-right"}>
                {user && <button onClick={() => nav("/watchlist")}>Watchlist</button>}
                {!user && <button onClick={login}>Login</button>}
                {user && <button onClick={logout}>Logout</button>}
            </div>
        </div>
    );
}
