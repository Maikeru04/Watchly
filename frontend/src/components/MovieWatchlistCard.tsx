import type {Movie} from "../types/Movie.ts";
import axios from "axios";

type MovieWatchlistCardProps = {
    movie: Movie
}

export default function MovieWatchlistCard({movie}:MovieWatchlistCardProps) {
    function removeFromWatchlist() {
        axios.delete(`/api/watchlist/c7d9e2f4-9a11-4b55-92aa-3b0f87654321/movie/${movie.id}`)
    }
    return(
        <div className="watchlist-card-movies">
            <div className="watchlist-card-content">

                <div className="watchlist-card-info">
                    <h3>{movie.title}</h3>
                    <p>
                        Release: {movie.release_date
                        ? `${movie.release_date.split("-")[2]}.${movie.release_date.split("-")[1]}.${movie.release_date.split("-")[0]}`
                        : ""}
                    </p>
                    <p>Rating: {Math.round(movie.vote_average * 10) / 10} / 10⭐</p>
                </div>

                <div className="watchlist-card-poster">
                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt="poster" />
                </div>
            </div>
                <div className={"watchlist-card-buttons"}>
                    <button className="btn" onClick={removeFromWatchlist}>Move to other Watchlist</button>
                    <button className="btn" onClick={removeFromWatchlist}>Remove from Watchlist</button>
                </div>
        </div>
    )
}