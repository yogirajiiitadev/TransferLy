import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { SubHeading } from "../components/SubHeading";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const SendMoney = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const [amount, setAmount] = useState(0);
    const [responseMessage, setResponseMessage] = useState("");
    const navigate = useNavigate();

    const handleTransfer = async () => {
        try {
            const response = await axios.post(
                "http://localhost:3000/api/v1/accounts/transaction",
                {
                    to: id,
                    amount
                },
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                }
            );
            setResponseMessage(response.data.message || "Transfer successful!");
            setTimeout(() => {
                navigate("/dashboard");
            }, 3000); // Navigate after 3 seconds
        } catch (error) {
            setResponseMessage("Error initiating transfer.");
            setTimeout(() => {
                navigate("/dashboard");
            }, 3000); // Navigate after 3 seconds
        }
    };

    return (
        <div className="flex justify-center h-screen bg-gray-100">
            <div className="h-full flex flex-col justify-center">
                <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
                    <div className="flex flex-col space-y-1.5 p-2">
                        <h2 className="text-3xl font-bold text-center">Send Money</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center">
                                <span className="text-2xl text-white">{name[0]}</span>
                            </div>
                            <h3 className="text-xl font-semibold">{name}</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="amount"
                                >
                                    Amount (in Rs)
                                </label>
                                <input
                                    onChange={(e) => setAmount(e.target.value)}
                                    type="number"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    id="amount"
                                    placeholder="Enter amount"
                                />
                            </div>
                            <button
                                onClick={handleTransfer}
                                className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white"
                            >
                                Initiate Transfer
                            </button>
                        </div>
                        {responseMessage && (
                            <div className="mt-4 text-center text-green-600">
                                {responseMessage}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
