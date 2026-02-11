import {useNavigate} from "react-router-dom";

export default function Navbar() {

    const nav = useNavigate()

    function navSeries() {
        nav("/watchlist")
    }


    return (
        <>
            <div>
                <button onClick={navSeries}>Watchlist</button>
            </div>
        </>
    )
}