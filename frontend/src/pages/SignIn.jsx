import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import {useState} from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios"

export const SignIn = () => {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [responseG,setresponseG] = useState("");
  const navigate = useNavigate()
  localStorage.removeItem("token");
    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-4 h-max px-4">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        <InputBox placeholder="jondeo@gmail.com" label={"Email"} onChange={e => {
            setusername(e.target.value);
        }}/>
        <InputBox placeholder="******" label={"Password"} onChange={e => {
            setpassword(e.target.value);
        }}/>
        <div className="pt-4">
          <Button label={"Sign In"} onClick={async ()=>{

            try{
              const response = await axios.post("http://localhost:3000/api/v1/user/signin", {
                  username,
                  password
              })
              if(response.data.message){
                const error_list = response.data.message;
                setresponseG(error_list);
                
              }
              else{
                localStorage.setItem("token",response.data.token); 
                navigate("/dashboard")
              }
            }
            catch(error){
              if(error.response && error.response.data && error.response.data.message){
                const error_list = error.response.data.message;
                  setresponseG(error_list);
              }
              else{
                setresponseG("An unexpected error occurred.");
              }
            }
          }}/>
          <div className="text-red-500 text-sm">{responseG}</div>
        </div>
        <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
      </div>
    </div>
  </div>
}