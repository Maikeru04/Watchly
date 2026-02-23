import axios from "axios";
import {useEffect, useState} from "react";
import type {Watchlist} from "./types/Watchlist.ts";
import WatchlistCard from "./components/WatchlistCard.tsx";

export default function Watchlists() {

    const [watchlists, setWatchlists] = useState<Watchlist[]>([]);

    useEffect(() => {
        axios.get("/api/watchlist/user", { withCredentials: true })
            .then(res => setWatchlists(res.data))
            .catch(err => console.error(err));
    }, []);

    return(
        <>
            <div className={"watchlist-grid"}>
                {watchlists.map((watchlist) => (
                    <WatchlistCard key={watchlist.id} watchlist={watchlist} />
                ))}
            </div>
        </>
    )
}