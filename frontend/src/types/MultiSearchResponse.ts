import type { Movie } from "./Movie";
import type { Series } from "./Series";

export type MultiSearchResponse = {
    page: number;
    total_pages: number;
    results: (Movie | Series | { media_type: "person" })[];
};