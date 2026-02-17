import type {Movie} from "../types/Movie.ts";
import axios from "axios";

type MovieCardProps = {
    movie: Movie
}

export default function MovieCard({movie}:MovieCardProps) {
    function addToWatchlist() {
        axios.post(`/api/watchlist/ee5647e1-1f2a-4a09-a1c6-d65f2d6d455e/movie/${movie.id}`)
    }
    return(
            <div>
                <h3>{movie.title}</h3>
                <p>{movie.id}</p>
                <p>{movie.release_date}</p>
                <p>{movie.vote_average}</p>
                {movie.poster_path && (
                    <img
                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                        alt={movie.title}
                    />
                )}
                <button onClick={addToWatchlist}>Add to Watchlist</button>
            </div>

    )
}