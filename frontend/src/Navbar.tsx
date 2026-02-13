import { useState } from "react";
import { movieService } from "./api/MovieService.ts";
import type { Movie } from "./types/Movie.ts";
import {useNavigate} from "react-router-dom";

type NavbarProps = {
    setMovies: (movies: Movie[]) => void;
    setLoading: (loading: boolean) => void;
};

export default function Navbar({ setMovies, setLoading }: NavbarProps) {
    const [inputValue, setInputValue] = useState("");
    const nav = useNavigate()

    function login() {
        const host =
            window.location.host === "localhost:5173"
                ? "http://localhost:8080"
                : window.location.origin;
        window.open(host + "/oauth2/authorization/github", "_self");
    }

    function logout() {
        const host =
            window.location.host === "localhost:5173"
                ? "http://localhost:8080"
                : window.location.origin;
        window.open(host + "/logout", "_self");
    }

    const handleSubmit = async () => {
        setLoading(true);
        const results = await movieService(inputValue);
        setMovies(results);
        setLoading(false);
    };

    function navWatchlist() {
        nav("/watchlist")
    }
    function navHome() {
        nav("/")
    }

    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Filmtitel eingeben..."
                />
                <button type="submit">Suchen</button>
            </form>
            <button onClick={navWatchlist}>Watchlist</button>
            <button onClick={navHome}>Home</button>
            <button onClick={login}>Login</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
}