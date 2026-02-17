import axios from "axios";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Homepage from "./Homepage.tsx";
import Watchlists from "./Watchlists.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import Navbar from "./Navbar.tsx";
import type { Movie } from "./types/Movie.ts";

function App() {
    const [user, setUser] = useState<string | undefined | null>(undefined);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios
            .get("/api/auth/me", { withCredentials: true })
            .then((r) => setUser(r.data))
            .catch(() => setUser(null));
    }, []);

    return (
        <>
            <Navbar setMovies={setMovies} setLoading={setLoading} />
            <Routes>
                <Route path={"/"} element={<Homepage movies={movies} loading={loading} />} />
                <Route element={<ProtectedRoute user={user} />}>
                    <Route path={"/watchlist"} element={<Watchlists />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;