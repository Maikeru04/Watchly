import axios from "axios";
import {useState} from "react";
import type {Watchlist} from "../types/Watchlist.ts";

type CreateEditWatchlistModal = {
    isOpen: boolean;
    onClose: () => void;
    onCreated?: () => void;
    watchlist:Watchlist;
};

export default function CreateEditWatchlistModal({isOpen, onClose, onCreated, watchlist}:CreateEditWatchlistModal) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newName, setnewName] = useState<string>(watchlist.name);
    const [newDescription, setnewDescription] = useState<string>(watchlist.description);

    if (!isOpen) return null;

    const handleSave = async () => {

        try {
            await axios.put(`/api/watchlist/${watchlist.id}`, {
                    "name": `${newName}`,
                    "description": `${newDescription}`,
                    "type": ""
                },
                { withCredentials: true }
            );

            setnewName("");
            setnewDescription("");
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
            <div className="modal-overlay" onClick={onClose}>
                <div className={"modal"} onClick={(e) => e.stopPropagation()}>
                    <input
                        className={"model-items"}
                        type="text"
                        placeholder="Enter new watchlist name"
                        value={newName}
                        onChange={(e) => setnewName(e.target.value)}

                    />

                    <textarea
                        className={"model-items"}
                        placeholder="Enter new description..."
                        value={newDescription}
                        onChange={(e) => setnewDescription(e.target.value)}
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
    )
}