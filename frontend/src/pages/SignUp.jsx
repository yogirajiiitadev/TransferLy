import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"

export const SignUp = () => {

    const [firstname, setfirstname] = useState("");
    const [lastname, setlastname] = useState("");
    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    const [responseG,setresponseG] = useState([]);
    const navigate = useNavigate()
    localStorage.removeItem("token");
    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign up"} />
        <SubHeading label={"Enter your information to create an account"} />
        <InputBox placeholder="John" label={"First Name"} onChange={e => {
            setfirstname(e.target.value);
        }}  />
        <InputBox placeholder="Doe" label={"Last Name"} onChange={e => {
            setlastname(e.target.value);
        }} />
        <InputBox placeholder="jondeo@gmail.com" label={"Email"} onChange={e => {
            setusername(e.target.value);
        }}/>
        <InputBox placeholder="******" label={"Password"} onChange={e => {
            setpassword(e.target.value);
        }}/>
        <div className="pt-4">
          <Button label={"Sign up"} onClick={async ()=>{
            let list_of_errors = [];
            try {
              const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
                username,
                firstname,
                lastname,
                password,
              });
              if (response.data.errors) {
                const list_of_errors = response.data.errors;
                list_of_errors.forEach((e) => {
                  setresponseG((prevResponseG) => [...prevResponseG, e.message]);
                });
              } else {
                localStorage.setItem("token", response.data.token);
                navigate("/dashboard");
              }
            } 
            catch (error) {
              if (error.response && error.response.data && error.response.data.errors) {
                const list_of_errors = error.response.data.errors;
                list_of_errors.forEach((e) => {
                  setresponseG((prevResponseG) => [...prevResponseG, e.message]);
                });
              } else {
                setresponseG((prevResponseG) => [...prevResponseG, "An unexpected error occurred."]);
              }
            }
          }}/>
          {responseG.map((message, index) => (
              <div key={index} className="text-red-500 text-sm">{message}</div>
            ))}          
        </div>
        <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
      </div>
    </div>
  </div>
}
