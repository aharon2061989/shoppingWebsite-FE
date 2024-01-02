import React, { useState } from "react";
import {Route, Routes } from "react-router-dom";
import Navbar from "./components/mainPage/Navbar";
import MainPage from "./components/mainPage/MainPage";
import Register from "./components/registration/Register";
import Login from "./components/registration/Login";
import OrderDetails from "./components/order/OrderDetails";
import FavoriteItems from "./components/mainPage/FavoriteItems";
import "./App.css";
import { AuthProvider } from "./components/context/AuthProvider";
import OrderList from "./components/order/OrderList";

function App() {
  const [orderData, setOrderData] = useState();
  
  const handleAddToOrder = (orderData) => {
    setOrderData(orderData);
  }

  return (
    <div>
      <AuthProvider>
        <Navbar orderData={orderData} />
          <Routes>
            <Route path="/" element={<MainPage onAddToOrder={handleAddToOrder}/>}/>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/OrderDetails" element={<OrderDetails orderData={orderData} setOrderData={setOrderData}/>} />
            <Route path="/FavoriteItems" element={<FavoriteItems />} />
            <Route path="/OrderList" element={<OrderList/>} />
          </Routes>
      </AuthProvider>
    </div>
    
  );
}

export default App;
