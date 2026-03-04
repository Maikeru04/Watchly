import axios from "axios";
import {useEffect, useState} from "react";
import type {Watchlist} from "./types/Watchlist.ts";
import WatchlistCard from "./components/WatchlistCard.tsx";
import CreateWatchlistModal from "./components/CreateWatchlistModal.tsx";
import {useNavigate} from "react-router-dom";

export default function Watchlists() {

    const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const nav = useNavigate();

    const loadWatchlists = () => {
        axios.get("/api/watchlist/user", { withCredentials: true })
            .then(res => setWatchlists(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        loadWatchlists();
    }, []);

    const completed = watchlists.find(w => w.id === "Completed" && w.items.length > 0);

    return(
        <>
            {watchlists.filter(w => w.id !== "Completed").length === 0 ? (
                <div className={"create-first-watchlist"}>
                    <button className="btn-secondary" onClick={() => setModalOpen(true)}>Create your first Watchlist!</button>
                </div>
            ) : (
                <div className={"watchlist-grid"}>
                    {watchlists
                        .filter(w => w.id !== "Completed")
                        .map((watchlist) => (
                            <WatchlistCard key={watchlist.id} watchlist={watchlist} onUpdate={loadWatchlists}/>
                        ))}
                    {completed ? (
                        <WatchlistCard key="Completed" watchlist={watchlists.find(w => w.id === "Completed")!} onUpdate={loadWatchlists}/>
                    ) : null
                    }
                </div>
            )}

            <CreateWatchlistModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onCreated={() => {
                    if(globalThis.location.pathname === "/watchlist") {
                        globalThis.location.reload()
                    } else {
                        nav("/watchlist")
                    }
                }}
            />
        </>
    )
}