import type { Movie } from "../types/Movie";
import type { Series } from "../types/Series";
import type { MultiSearchResponse } from "../types/MultiSearchResponse";

export async function movieService(query: string, page: number = 1): Promise<{ results: (Movie | Series)[]; page: number; total_pages: number }> {

    if (!query) {
        return { results: [], page: 1, total_pages: 1 };
    }

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/search/multi?query=${encodeURIComponent(query)}&page=${page}`,
        {
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            },
        }
    );

    const data: MultiSearchResponse = await response.json();

    const filteredResults = data.results.filter(
        (item): item is Movie | Series =>
            item.media_type === "movie" || item.media_type === "tv"
    );

    return {results: filteredResults, page: data.page, total_pages: data.total_pages};
}