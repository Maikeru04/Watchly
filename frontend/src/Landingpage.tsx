import {useEffect, useState} from "react";
import type {Movie} from "./types/Movie.ts";
import MovieCard from "./components/MovieCard.tsx";
import axios from "axios";
import type {Series} from "./types/Series.ts";

export default function Landingpage() {
    const [movies, setTrendingMovies] = useState<Movie[]>([]);
    const [series, setTrendingSeries] = useState<Series[]>([]);

    const [moviesTop, setTopMovies] = useState<Movie[]>([]);
    const [seriesTop, setTopSeries] = useState<Series[]>([]);

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_URL}/trending/movie/day`, {
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
                },
            })
            .then((res) => setTrendingMovies(res.data.results))
            .catch(console.error);
    }, []);

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_URL}/trending/tv/day`, {
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
                },
            })
            .then((res) => setTrendingSeries(res.data.results))
            .catch(console.error);
    }, []);

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_URL}/movie/top_rated`, {
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
                },
            })
            .then((res) => setTopMovies(res.data.results))
            .catch(console.error);
    }, []);

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_URL}/tv/top_rated`, {
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
                },
            })
            .then((res) => setTopSeries(res.data.results))
            .catch(console.error);
    }, []);

    return(
        <>
            <div className={"landing-row"}>
                <h1 className={"landing-row-heading"}>Trending Movies of the Day</h1>
                <div className={"media-row"}>
                    {movies?.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </div>
            <div className={"landing-row"}>
                <h1 className={"landing-row-heading"}>Trending Series of the Day</h1>
                <div className={"media-row"}>
                    {series?.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </div>
            <div className={"landing-row"}>
                <h1 className={"landing-row-heading"}>Top Rated Movies</h1>
                <div className={"media-row"}>
                    {moviesTop?.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </div>
            <div className={"landing-row"}>
                <h1 className={"landing-row-heading"}>Top Rated Series</h1>
                <div className={"media-row"}>
                    {seriesTop?.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </div>
        </>
    )
}