import React, { useState, useEffect, useContext } from "react";
import "./OrderList.css";
import { userAllOrders, FindUserByUserName } from "../../services/api";
import AuthContext from "../context/AuthProvider";
import { Link } from "react-router-dom";

function OrderList() {
  const { auth } = useContext(AuthContext);
  const [listOfOrders, setListOfOrders] = useState([]);

  useEffect(() => {
    getAllOrders();
  }, []);

  const getAllOrders = async () => {
    try {
      const response = await FindUserByUserName(auth.username);
      const userId = response.userId;
      const queryParams = `?Authorization=Bearer ${auth.token}`;
      const ordersResponse = await userAllOrders(userId, queryParams);
      setListOfOrders(ordersResponse);
    } catch (error) {
      console.log("error getting list of orders: " + error);
    }
  };

  return (
    <div>
      <h1>Your Orders</h1>
      {listOfOrders.map((order) => (
        <div key={order.order.orderId} className="order-container">
          <div className="order-details">
            <div>
              <h3>Order No: {order.order.orderId}</h3>
              <h3>Date: {displayDate(order.order.orderDate)}</h3>
              <h3>Shipping Address: {`${order.order.shippingCountry}, ${order.order.shippingCity}, ${order.order.shippingAddress}`}</h3>
              <h3>Status: {order.order.orderStatus}</h3>
              <h3 className="price">Total Price: {calculateTotalPrice(order.orderItems)} $</h3>
            </div>
            <div className="item-container">
              {order.orderItems.map((item) => (
                <div key={item.itemId} className="item">
                  <p>Product: {item.itemResponse.itemTitle}</p>
                  <p>Price: {item.itemResponse.itemPrice} $</p>
                  <p>Quantity: {item.quantity}</p>
                  <img src={item.itemResponse.photoUrl} alt="item" />
                </div>
                ))}
                {order.order.orderStatus === 'TEMP' && (
                    <Link to="/OrderDetails">
                        <button className="edit-button">Edit</button>
                    </Link>     
                )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
  
}

function calculateTotalPrice(items) {
    let totalPrice = 0;
  
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      totalPrice += item.itemResponse.itemPrice * item.quantity;
    }
  
    return totalPrice; 
  }

function displayDate(date) {
  const formattedDate = new Date(date);
  return formattedDate.toLocaleDateString();
}

export default OrderList;
