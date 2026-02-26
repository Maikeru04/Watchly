import type {Movie} from "../types/Movie.ts";
import axios from "axios";

type MovieWatchlistCardProps = {
    movie: Movie
    watchlistID:string
}

export default function MovieWatchlistCard({movie, watchlistID}:MovieWatchlistCardProps) {
    function removeFromWatchlist() {
        axios.delete(`/api/watchlist/${watchlistID}/movie/${movie.id}`)
        window.location.reload()
    }

    return(
        <div className="watchlist-card-movies"
             draggable
             onDragStart={(e) => {
                 e.dataTransfer.setData("movieId", `${movie.id}`);
                 e.dataTransfer.setData("fromWatchlist", watchlistID);
             }}>
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
                    <button className="btn" onClick={removeFromWatchlist}>Remove from Watchlist</button>
                </div>
        </div>
    )
}