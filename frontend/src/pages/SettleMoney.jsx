import { useEffect, useState } from 'react';
import axios from 'axios';
import { Appbar } from '../components/AppBar';
import { Button } from '../components/Button';
import { Navigate, useNavigate } from 'react-router-dom';

export function SettleMoney() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [fname,setfname] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/v1/accounts/settle", {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                });
                setData(response.data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData2 = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/v1/user/me", {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                });
                setfname(response.data.firstname);
            } catch (err) {
                setError(err.message);
            }
        };



        fetchData2();
    }, []);

    if (error) {
        return <div className="text-center text-red-500 font-bold">Error: {error}</div>;
    }

    if (!data) {
        return <div className="text-center font-bold text-lg">Loading...</div>;
    }

    return (
        <div>
            <Appbar firstname={fname} />
            
            <div className="container mx-auto p-6">
                <h2 className="text-xl font-bold mb-6 text-center text-slate-800">Payments Owed to You</h2>
                <div className="overflow-x-auto shadow-lg rounded-lg">
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead>
                            <tr className="bg-slate-200 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left w-1/2">Name</th>
                                <th className="py-3 px-6 text-left w-1/2">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm">
                            {data.filter(obj => obj.amount > 0).map((obj) => (
                                <tr key={obj.id} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-6 text-left whitespace-nowrap">
                                        {obj.to_name}
                                    </td>
                                    <td className="py-3 px-6 text-left whitespace-nowrap flex justify-between">
                                        ₹{obj.amount}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
    
            <div className="container mx-auto p-6 mt-6">
                <h2 className="text-xl font-bold mb-6 text-center text-slate-800">Payments Owed by You</h2>
                <div className="overflow-x-auto shadow-lg rounded-lg">
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead>
                            <tr className="bg-slate-200 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left w-1/2">Name</th>
                                <th className="py-3 px-6 text-left w-1/2">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm">
                            {data.filter(obj => obj.amount < 0).map((obj) => (
                                <tr key={obj.id} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-6 text-left whitespace-nowrap">
                                        {obj.to_name}
                                    </td>
                                    <td className="py-3 px-6 text-left whitespace-nowrap flex justify-between items-center">
                                        <div className="mr-2 text-red-600 font-semibold">₹{-obj.amount}</div>
                                        <div><Button onClick={(e) => {
                                            const temp_firstname = obj.to_name.split(" ")[0];
                                            navigate("/send?id=" + obj.id + "&name=" + temp_firstname);
                                        }} label={"Send Money"} /></div>
                                        
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
    
}
