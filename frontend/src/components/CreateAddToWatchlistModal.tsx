import CustomDropdown from "./CustomDropdown.tsx";
import axios from "axios";
import {useEffect, useState} from "react";
import type {Movie} from "../types/Movie.ts";
import type {Watchlist} from "../types/Watchlist.ts";
import type {Series} from "../types/Series.ts";

type CreateAddToWatchlistModal = {
    isOpen: boolean;
    onClose: () => void;
    onCreated?: () => void;
    movie:Movie | Series;
};

export default function CreateAddToWatchlistModal({isOpen, onClose, onCreated, movie}:CreateAddToWatchlistModal) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selected, setSelected] = useState("");
    const [watchlists, setWatchlists] = useState<Watchlist[]>([])
    const [user, setUser] = useState<{ name: string } | null>(null);

    const isMovie = movie.media_type === "movie";

    const options:string[] = watchlists.map((watchlist) => (
        watchlist.name
    ))

    const host =
        window.location.host === "localhost:5173"
            ? "http://localhost:8080"
            : window.location.origin;

    if (!isOpen) return null;

    const handleSave = async () => {

        if (!selected) {
            setError("Please choose a Watchlist.");
            return;
        }


        const watchlistToUpdate = watchlists.find(w => w.name === selected);

        if (!watchlistToUpdate) {
            setError("Watchlist not found.");
            return;
        }

        if(watchlistToUpdate.items.some(item => item.itemID === `${movie.id}`)) {
            setError("This Item is already in your selected Watchlist.")
            return;
        }

        const media_type = isMovie ? "movie" : "series";
        try {
            await axios.post(`/api/watchlist/${watchlistToUpdate?.id}/movie`, {
                    "itemID": `${movie.id}`,
                    "media_type": `${media_type}`,
                    "rating": 0
                },
                { withCredentials: true }
            );

            onClose();

            if (onCreated) {
                onCreated();
            }
        } catch (err) {
            console.error(err);
            setError("Error while saving.");
        } finally {
            setLoading(false);
        }
    };

    function login() {
        window.location.href = host + "/oauth2/authorization/github";
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        axios
            .get(host + "/api/auth/me", { withCredentials: true })
            .then(res => setUser(res.data))
            .catch(() => setUser(null));
    }, [host]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (!user) {
            setWatchlists([]);
            return;
        }

        axios.get("/api/watchlist/user", { withCredentials: true })
            .then(res => {
                console.log("Watchlists Data:", res.data);
                setWatchlists(res.data);
            })
            .catch(err => console.error(err));

    }, [user]);

    return (
        <>
        {user &&

        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-addwatchlist" onClick={(e) => e.stopPropagation()} style={{
                backgroundImage: movie.poster_path
                    ? `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`
                    : `url(/image_not_found.jpg)`
            }}>
                <div className="modal-footer-group">
                    <CustomDropdown
                        options={options}
                        selected={selected}
                        onSelect={(value) => setSelected(value)}
                        placeholder="Choose your Watchlist!"
                    />

                    {error && <p style={{ color: "white" }}>{error}</p>}

                    <div className={"modal-bottom"}>
                        <button className={"btn-secondary"} onClick={onClose} disabled={loading}>
                            Exit
                        </button>
                        <button className={"btn-secondary"} onClick={handleSave} disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        }

        {!user &&
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-login" onClick={(e) => e.stopPropagation()}>

                    <h2>Please Login!</h2>

                    <button className="btn-secondary" onClick={login}>
                        Login with Github
                    </button>
                </div>
            </div>
        }
        </>
    )
}