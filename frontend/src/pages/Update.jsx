import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"

export const UpdateProfile = () => {

    const [firstname, setfirstname] = useState("");
    const [lastname, setlastname] = useState("");
    const [password, setpassword] = useState("");
    const navigate = useNavigate()

    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-280 text-center p-2 h-max px-4">
        <Heading label={"Update Profile"} />
        <SubHeading label={"Enter the information to update your account"} />
        <InputBox placeholder="John" label={"First Name"} onChange={e => {
            setfirstname(e.target.value);
        }}  />
        <InputBox placeholder="Doe" label={"Last Name"} onChange={e => {
            setlastname(e.target.value);
        }} />
        <InputBox placeholder="******" label={"Password"} onChange={e => {
            setpassword(e.target.value);
        }}/>
        <div className="pt-4">
          <Button label={"Update"} onClick={async ()=>{
            const response = await axios.put("http://localhost:3000/api/v1/user/", {
                firstname,
                lastname,
                password
            },{
                headers : {
                    Authorization : "Bearer " + localStorage.getItem("token")
                }
            })
            navigate("/dashboard")
          }}/>
        </div>
      </div>
    </div>
  </div>
}
