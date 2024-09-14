import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";


export const Appbar = ({ firstname }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const handleIconClick = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleOptionClick = (option) => {
        if (option === "logout") {
            console.log("Log Out Clicked");
            // Add logout logic here
            localStorage.removeItem("token");
            console.log("Token Cleared");
            navigate("/signin");

        } else if (option === "updateProfile") {
            console.log("Update Profile Clicked");
            // Add update profile logic here
            navigate("/update");
        }
        setDropdownOpen(false); // Close the dropdown after an option is clicked
    };

    

    return (
        <div className="box-shadow h-14 flex justify-between bg-slate-200 shadow-md">
            <div className="flex flex-col items-center h-full font-bold text-3xl bg-slate-200 p-3 ">
                TransferLy
            </div>
            <div className="relative flex">
                <div className="flex flex-col justify-center h-full mr-4">
                    Hello {firstname}!
                </div>
                <div
                    className="rounded-full h-12 w-12 bg-gray-800 flex justify-center mt-1 mr-4 cursor-pointer"
                    onClick={handleIconClick}
                >
                    <div className="flex flex-col justify-center h-full text-xl text-white font-semi-bold">
                        {firstname[0]}
                    </div>
                </div>
                {dropdownOpen && (
                    <div className="absolute right-0 mt-14 bg-white shadow-md rounded-lg p-2 w-48 text-sm ">
                        <div
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleOptionClick("logout")}
                        >
                            Log Out
                        </div>
                        <div
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleOptionClick("updateProfile")}
                        >
                            Update Profile
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
