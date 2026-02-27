import { useState } from "react";
import axios from "axios";
import CustomDropdown from "./CustomDropdown.tsx";

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
    const [selected, setSelected] = useState("");

    const options = ["MOVIE", "SERIES", "ANIME"];

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!name.trim()) {
            setError("Name darf nicht leer sein");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await axios.post(
                "/api/watchlist",
                {
                    name: name.trim(),
                    description: description.trim(),
                    type: selected,
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
            setError("Fehler beim Erstellen der Watchlist");
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>Neue Watchlist erstellen</h2>

                <input
                    className={"model-items"}
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}

                />

                <textarea
                    className={"model-items"}
                    placeholder="Beschreibung"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <CustomDropdown
                    options={options}
                    selected={selected}
                    onSelect={(value) => setSelected(value)}
                    placeholder="Bitte Watchlist Typ wählen!"
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