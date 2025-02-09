import { Route, Routes } from "react-router-dom";
import "./App.css";
import CustomerRoutes from "./Routers/CustomerRoutes";
import AdminPannel from "./Admin/AdminPannel";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUser } from "./Redux/Auth/Action";
import AboutUs from "./Pages/AboutUs/AboutUs";
import Stores from "./Pages/Stores/Stores";
import ScrollToTopButton from "./components/ScrollToTopButton/ScrollToTopButton";

function App() {
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  useEffect(() => {
    if (jwt) {
      dispatch(getUser(jwt));
    }
  }, [jwt]);
  return (
    <div className="">
      <Routes>
        <Route path="/*" element={<CustomerRoutes />} />
        {auth.user?.role === "ROLE_ADMIN" && (
          <Route path="/admin/*" element={<AdminPannel />} />
        )}
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/stores" element={<Stores />} />
      </Routes>
      <ScrollToTopButton />
    </div>
  );
}

export default App;
