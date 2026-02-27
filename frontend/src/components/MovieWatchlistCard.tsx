import type {Movie} from "../types/Movie.ts";
import axios from "axios";
import type {Series} from "../types/Series.ts";

type MovieWatchlistCardProps = {
    movie: Movie | Series
    watchlistID:string
}

export default function MovieWatchlistCard({movie, watchlistID}:MovieWatchlistCardProps) {
    const isMovie = movie.media_type === "movie";
    const date = isMovie ? movie.release_date : movie.first_air_date;

    function removeFromWatchlist() {
        axios.delete(`/api/watchlist/${watchlistID}/movie`, {
            data: {
                itemID: `${movie.id}`,
                media_type: isMovie ? "movie" : "series"
            }
        });
        window.location.reload()
    }

    return(
        <div className="watchlist-card-movies"
             draggable
             onDragStart={(e) => {
                 e.dataTransfer.setData("movieId", movie.id.toString());
                 e.dataTransfer.setData("fromWatchlist", watchlistID);
                 e.dataTransfer.setData("media_type", movie.media_type);
             }}>
            <div className="watchlist-card-content">

                <div className="watchlist-card-info">
                    <h3>{isMovie ? movie.title : movie.name}</h3>
                    <p>
                        {isMovie ? "Release:" : "First Air:"}{" "}
                        {date ? `${date.split("-")[2]}.${date.split("-")[1]}.${date.split("-")[0]}` : ""}
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