import type {Movie} from "./Movie.ts";

export type MovieSearchResponse = {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
};