import axios from "axios";
import {useState} from "react";
import type {Watchlist} from "../types/Watchlist.ts";

type CreateAddToWatchlistModal = {
    isOpen: boolean;
    onClose: () => void;
    onCreated?: () => void;
    watchlist:Watchlist;
};

export default function CreateEditWatchlistModal({isOpen, onClose, onCreated, watchlist}:CreateAddToWatchlistModal) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [name, setName] = useState<string>(watchlist.name);
    const [description, setDescription] = useState<string>(watchlist.description);

    if (!isOpen) return null;

    const handleSave = async () => {

        try {
            await axios.put(`/api/watchlist/${watchlist.id}`, {
                    "name": `${name}`,
                    "description": `${description}`,
                    "type": ""
                },
                { withCredentials: true }
            );

            setName("");
            setDescription("");
            setLoading(false);
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

    return (
        <>
            <div className="modal-overlay" onClick={onClose}>
                <div className={"modal"} onClick={(e) => e.stopPropagation()}>
                    <input
                        className={"model-items"}
                        type="text"
                        placeholder="Watchlist name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}

                    />

                    <textarea
                        className={"model-items"}
                        placeholder="Description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    {error && <p style={{ color: "white" }}>{error}</p>}

                    <div className={"modal-bottom"}>
                        <button className={"btn"} onClick={onClose} disabled={loading}>
                            Exit
                        </button>
                        <button className={"btn"} onClick={handleSave} disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}