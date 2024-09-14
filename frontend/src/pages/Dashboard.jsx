import { Appbar } from "../components/AppBar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Dashboard(){
    const [firstname, setFirstname] = useState("");
    const [balance, setBalance] = useState(0);
    const navigate = useNavigate();
    // redirects to signin
    useEffect(() => {
        const token = localStorage.getItem('token'); 
        if (!token || token === "") {
            navigate("/signin");
        }
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token'); 
                const userResponse = await axios.get("http://localhost:3000/api/v1/user/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setFirstname(userResponse.data.firstname);
            const balanceResponse = await axios.get("http://localhost:3000/api/v1/accounts/balance", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setBalance(balanceResponse.data.balance);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            console.log("firstname:", firstname);
            console.log("balance:", balance);
        };

        fetchData(); 
    }, [balance]); 

    

    return(
        <div>
            <Appbar firstname={firstname}></Appbar>
            <Balance value={balance}></Balance>
            <Users></Users>
        </div>
    )
}