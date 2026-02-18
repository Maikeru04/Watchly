import axios from "axios";

export default function Watchlists() {
    function testIt() {
        axios.delete("/api/watchlist/ee5647e1-1f2a-4a09-a1c6-d65f2d6d455e/movie/20")
    }

    return(
        <>
            <h1>Watchlists</h1>
            <button onClick={testIt}>click ma</button>
        </>
    )
}