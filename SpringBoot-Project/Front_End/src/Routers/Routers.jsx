import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "../Pages/Homepage";
import About from "../Pages/About";
import PrivacyPolicy from "../Pages/PrivacyPolicy";
import TearmsCondition from "../Pages/TearmsCondition";
import Contact from "../Pages/Contact";
import Product from "../customer/Components/Product/Product/Product";
import ProductDetails from "../customer/Components/Product/ProductDetails/ProductDetails";
import Cart from "../customer/Components/Product/Cart/Cart";

import DemoAdmin from "../Admin/Views/DemoAdmin";
import AdminPannel from "../Admin/AdminPannel";
import Navigation from "../customer/Components/Navbar/Navigation";
import AboutUs from "../Pages/AboutUs/AboutUs";
import Stores from "../Pages/Stores/Stores";

const Routers = () => {
  return (
    <div>
      <div>
        <Navigation />
      </div>
      <div className="">
        <Routes>
          <Route path="/" element={<Homepage />}></Route>
          <Route path="/home" element={<Homepage />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/privaciy-policy" element={<PrivacyPolicy />}></Route>
          <Route path="/terms-condition" element={<TearmsCondition />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/men" element={<Product />}></Route>
          <Route
            path="/product/:productId"
            element={<ProductDetails />}
          ></Route>
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/admin" element={<AdminPannel />}></Route>
          <Route path="/demo" element={<DemoAdmin />}></Route>
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/stores" element={<Stores />} />
        </Routes>
      </div>
    </div>
  );
};

export default Routers;
