import type {MovieSearchResponse} from "../types/MovieSearchResponse.ts";
import type { Movie } from "../types/Movie";

export async function movieService(query: string): Promise<Movie[]> {
    if (!query) return [];

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/search/movie?query=${query}`,
        {
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            },
        });

        const data: MovieSearchResponse = await response.json();
        return data.results;
}