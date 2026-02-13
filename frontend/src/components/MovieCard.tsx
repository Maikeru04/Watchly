import type {Movie} from "../types/Movie.ts";

type MovieCardProps = {
    movie: Movie
}

export default function MovieCard({movie}:MovieCardProps) {
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
            </div>

    )
}