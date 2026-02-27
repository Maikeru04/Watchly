import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Homepage from "./Homepage.tsx";
import Watchlists from "./Watchlists.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import Navbar from "./Navbar.tsx";
import axios from "axios";
import Landingpage from "./Landingpage.tsx";

function App() {
    const [user, setUser] = useState<string | undefined | null>(undefined);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        axios
            .get("/api/auth/me", { withCredentials: true })
            .then((r) => setUser(r.data))
            .catch(() => setUser(null));
    }, []);

    return (
        <>
            <Navbar setSearchQuery={setSearchQuery} />

            <Routes>

                <Route path="/search" element={
                    <Homepage searchQuery={searchQuery} />
                }/>

                <Route path="/" element={
                    <Landingpage/>
                }/>
                <Route element={<ProtectedRoute user={user} />}>
                    <Route path="/watchlist" element={<Watchlists />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;