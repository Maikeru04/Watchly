import CustomDropdown from "./CustomDropdown.tsx";
import axios from "axios";
import {useEffect, useState} from "react";
import MovieCard from "./MovieCard.tsx";
import type {Movie} from "../types/Movie.ts";
import type {Watchlist} from "../types/Watchlist.ts";

type CreateAddToWatchlistModal = {
    isOpen: boolean;
    onClose: () => void;
    onCreated?: () => void;
    movie:Movie;
};

export default function CreateAddToWatchlistModal({isOpen, onClose, onCreated, movie}:CreateAddToWatchlistModal) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selected, setSelected] = useState("");
    const [watchlists, setWatchlists] = useState<Watchlist[]>([])

    const options:string[] = watchlists.map((watchlist) => (
            watchlist.name
        ))

    if (!isOpen) return null;

    useEffect(() => {
        axios.get("/api/watchlist/user", { withCredentials: true })
            .then(res => setWatchlists(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleSave = async () => {

        const watchlistToUpdate = watchlists.find(w => w.name === selected);
        try {
            await axios.post(`/api/watchlist/${watchlistToUpdate?.id}/movie/${movie.id}`,
                {

                },
                { withCredentials: true }
            );

            onClose();

            if (onCreated) {
                onCreated();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>

                <h2>Film zur Watchlist Hinzufügen:</h2>

                <MovieCard movie={movie}/>

                <CustomDropdown
                    options={options}
                    selected={selected}
                    onSelect={(value) => setSelected(value)}
                    placeholder="Bitte Watchlist wählen!"
                />

                {error && <p style={{ color: "red" }}>{error}</p>}

                <div className={"modal-bottom"}>
                    <button className={"btn"} onClick={onClose} disabled={loading}>
                        Abbrechen
                    </button>
                    <button className={"btn"} onClick={handleSave} disabled={loading}>
                        {loading ? "Speichern..." : "Speichern"}
                    </button>
                </div>
            </div>
        </div>
    )
}