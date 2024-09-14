import { Button } from "./Button"
import { useNavigate } from "react-router-dom";

export const Balance = ({ value }) => {
    const navigate = useNavigate();
    return <div className="flex justify-start p-6">
        <div className="font-bold text-2xl mt-4">
            Your balance
        </div>
        <div className="font-semibold ml-4 mt-4 text-2xl">
            ₹ {value}
        </div>
        <div className="mt-4 ml-4">
            <Button label="Settle" onClick={()=>{ navigate("/settle") }}></Button>
        </div>
    </div>
}