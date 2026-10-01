import { useState } from "react";
import "./App.css";
import Home from "./components/Home";

function App() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [register, setRegister] = useState(false);

    const login = async () => {
        if (email === "" || password === "") {
            alert("Please enter all details");
            return;
        }

        const response = await fetch("http://localhost:8000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (data.message === "Login successful") {
            setLoggedIn(true);
        } else {
            alert(data.message);
        }
    };

    const registerUser = async () => {
        if (email === "" || password === "") {
            alert("Please enter all details");
            return;
        }

        const response = await fetch("http://localhost:8000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        alert(data.message);

        setRegister(false);
    };

    const logout = () => {
        setLoggedIn(false);
        setEmail("");
        setPassword("");
    };

    if (loggedIn) {
        return <Home email={email} logout={logout} />;
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Student Expense Tracker</h1>

                {register ? <h2>Register</h2> : <h2>Login</h2>}

                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {register ? (
                    <button onClick={registerUser}>Register</button>
                ) : (
                    <button onClick={login}>Login</button>
                )}

                {register ? (
                    <p onClick={() => setRegister(false)}>
                        Already have an account? Login
                    </p>
                ) : (
                    <p onClick={() => setRegister(true)}>
                        Don't have an account? Register
                    </p>
                )}
            </div>
        </div>
    );
}

export default App;