import type {Movie} from "../types/Movie.ts";
import axios from "axios";

type MovieCardProps = {
    movie: Movie
}

export default function MovieCard({movie}:MovieCardProps) {
    function addToWatchlist() {
        axios.post(`/api/watchlist/b3f1a6c2-1e4b-4a9d-8c21-7f0e12345678/movie/${movie.id}`)
    }
    return(
        <div className="movie-card"
            style={{
                backgroundImage: movie.poster_path
                    ? `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`
                    : `url(/image_not_found.jpg)`
            }}
        >
            <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>
                    Release: {movie.release_date ? `${movie.release_date.split("-")[2]}.${movie.release_date.split("-")[1]}.${movie.release_date.split("-")[0]}` : ""}
                </p>
                <p>Rating: {Math.round(movie.vote_average * 10) / 10} / 10⭐</p>
                <button onClick={addToWatchlist}>Add to Watchlist</button>
            </div>
        </div>
    )
}