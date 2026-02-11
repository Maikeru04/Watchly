import axios from "axios";
import {useEffect, useState} from "react";
import {Route, Routes} from "react-router-dom";
import Homepage from "./Homepage.tsx";
import Watchlists from "./Watchlists.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import Navbar from "./Navbar.tsx";

function App() {


    const [user, setUser] = useState<string | undefined | null>(undefined)

    function login() {
        const host:string = window.location.host === "localhost:5173" ? "http://localhost:8080" : window.location.origin
        window.open(host + "/oauth2/authorization/github", "_self")
    }

    function logout() {
        const host:string = window.location.host === "localhost:5173" ? "http://localhost:8080" : window.location.origin
        window.open(host + "/logout", "_self")
    }

    function loadUser() {
        axios.get("/api/auth")
            .then(r => {
                setUser(r.data)
                console.log(r.data)
            })
            .catch(() => setUser(null))

    }

    useEffect(() => {
        loadUser()
    }, [user]);

    return (
    <>
        <Navbar/>
        <button onClick={login}>Login</button>
        <button onClick={logout}>Logout</button>
        <Routes>
            <Route path={"/"} element={<Homepage/>}/>
            <Route element={<ProtectedRoute user={user}/>}>
                <Route path={"/watchlist"} element={<Watchlists/>}/>
            </Route>
        </Routes>
    </>
  )
}

export default App
