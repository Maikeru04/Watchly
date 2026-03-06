import type {Item} from "./Item.ts";

export type Watchlist = {
    id: string,
    userId: string,
    name: string,
    description: string,
    items: Item[],
    type: string
}