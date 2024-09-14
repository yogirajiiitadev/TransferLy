import { useState, useEffect } from "react"
import { Button } from "./Button"
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Users = () => {
    const [users, setUsers] = useState([]);
    const [filter, setfilter] = useState("");
    useEffect(()=>{
        axios.get("http://localhost:3000/api/v1/user/bulk?filter=" + filter.toLowerCase()
        ,{
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        .then(response => {
            setUsers(response.data.user)
        })
    },[filter]);

    return <>
        <div className="font-bold mt-2 text-lg px-6">
            Users
        </div>
        <div className="my-2 px-6">
            <input onChange={(e)=>setfilter(e.target.value)} type="text" placeholder="Search users..." className="w-full px-2 py-1 border rounded border-slate-200"></input>
        </div>
        <div className="px-6 pt-4">
            {users.map(user => <User user={user} />)}
        </div>
    </>
}

function User({user}) {
    const navigate = useNavigate();
    return <div className="flex justify-between hover:bg-gray-100">
        <div className="flex">
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {user.firstName[0]}
                </div>
            </div>
            <div className="flex flex-col justify-center h-ful">
                <div>
                    {user.firstName} {user.lastName}
                </div>
            </div>
        </div>
        <div  className="flex justify-end">
            <div className="mr-2">
                <Button onClick={(e)=>{
                    navigate("/send?id=" + user._id + "&name=" + user.firstName)
                }} label={"Send Money"} />
            </div>
            <div className="ml-2">
                <Button onClick={(e)=>{
                    navigate("/request?id=" + user._id + "&name=" + user.firstName)
                }} label={"Request Money"} />
            </div>
        </div>
    </div>
}