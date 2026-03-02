import { useState } from "react";
import axios from "axios";

type CreateWatchlistModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCreated?: () => void;
};

export default function CreateWatchlistModal({isOpen, onClose, onCreated,}: CreateWatchlistModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!name.trim()) {
            setError("Name cant be empty");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await axios.post(
                "/api/watchlist",
                {
                    name: name.trim(),
                    description: description.trim()
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
            setError("Error creating watchlist\n");
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>Create new Watchlist!</h2>

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
    );
}