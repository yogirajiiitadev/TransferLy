import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import {SignUp} from "./pages/SignUp";
import {SignIn} from "./pages/SignIn";
import {Dashboard} from "./pages/Dashboard";
import {SendMoney} from "./pages/SendMoney";
import { UpdateProfile } from "./pages/Update";
import { RequestMoney } from "./pages/RequestMoney";
import { SettleMoney } from "./pages/SettleMoney";

function App() {

  return (
     <BrowserRouter>
      <Routes>
         <Route path="/signup" element={<SignUp/>}></Route>
         <Route path="/signin" element={<SignIn/>}></Route>
         <Route path="/dashboard" element={<Dashboard/>}></Route>
         <Route path="/send" element={<SendMoney/>}></Route>
         <Route path="/update" element={<UpdateProfile/>}></Route>
         <Route path="/request" element={<RequestMoney/>}></Route>
         <Route path="/settle" element={<SettleMoney/>}></Route>
      </Routes>
     </BrowserRouter>
  )
}

export default App
