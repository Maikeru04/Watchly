import type {MovieSearchResponse} from "../types/MovieSearchResponse.ts";
import type { Movie } from "../types/Movie";

export async function movieService(
    query: string,
    page: number = 1
): Promise<{ results: Movie[]; page: number; total_pages: number }> {
    if (!query) return { results: [], page: 1, total_pages: 1 };

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`,
        {
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            },
        }
    );

    const data: MovieSearchResponse = await response.json();
    return {
        results: data.results,
        page: data.page,
        total_pages: data.total_pages
    };
}