import { useState } from "react";
import { FaStar } from "react-icons/fa";

type StarRatingProps = {
    max?: number;
    value?: number;
    onChange?: (rating: number) => void;
};

export default function StarRating({max = 10, value = 0, onChange}: StarRatingProps) {
    const [hover, setHover] = useState<number | null>(null);
    const [rating, setRating] = useState(value);

    const handleClick = (index: number) => {
        setRating(index);
        onChange?.(index);
    };

    return (
        <div className="star-container">
            {[...Array(max)].map((_, i) => {
                const starValue = i + 1;

                return (
                    <span
                        key={starValue}
                        className={
                            starValue <= (hover ?? rating) ? "star active" : "star"
                        }
                        onClick={() => handleClick(starValue)}
                        onMouseEnter={() => setHover(starValue)}
                        onMouseLeave={() => setHover(null)}
                    >
            <FaStar />
          </span>
                );
            })}
        </div>
    );
}