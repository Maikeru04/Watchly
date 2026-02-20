import axios from "axios";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Homepage from "./Homepage.tsx";
import Watchlists from "./Watchlists.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import Navbar from "./Navbar.tsx";
import type { Movie } from "./types/Movie.ts";
import {movieService} from "./api/MovieService.ts";
import { useRef } from "react";

function App() {
    const [user, setUser] = useState<string | undefined | null>(undefined);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [inputValue, setInputValue] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const activeRequestRef = useRef(0);

    const handleSearch = async () => {
        const trimmed = inputValue.trim();
        setMovies([]);
        setCurrentPage(1);
        setTotalPages(1);
        setSearchQuery(trimmed);
        if (!trimmed) {
            return;
        }

        setLoading(true);

        const requestId = ++activeRequestRef.current;

        const { results, total_pages } = await movieService(trimmed, 1);

        if (requestId !== activeRequestRef.current) return;

        setMovies(results);
        setCurrentPage(1);
        setTotalPages(total_pages);

        setLoading(false);
    };

    useEffect(() => {
        axios
            .get("/api/auth/me", { withCredentials: true })
            .then((r) => setUser(r.data))
            .catch(() => setUser(null));
    }, []);

    const loadMore = async () => {
        const query = searchQuery;
        if (!query) return;
        if (currentPage >= totalPages) return;

        const nextPage = currentPage + 1;
        const requestId = ++activeRequestRef.current;
        const { results } = await movieService(query, nextPage);

        if (requestId !== activeRequestRef.current) return;

        setMovies(prev => [...prev, ...results]);
        setCurrentPage(nextPage);
    };

    return (
        <>
            <Navbar
                inputValue={inputValue}
                setInputValue={setInputValue}
                onSearch={handleSearch}
            />

            <Routes>
                <Route path="/" element={
                        <Homepage
                            movies={movies}
                            loading={loading}
                            loadMore={loadMore}
                            currentPage={currentPage}
                            totalPages={totalPages}
                        />
                }/>
                <Route element={<ProtectedRoute user={user} />}>
                    <Route path="/watchlist" element={<Watchlists />} />
                </Route>
            </Routes>
        </>
    );
}


export default App;