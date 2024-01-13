import React, { useContext, useEffect, useState } from "react";
import "./OrderDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import AuthContext from "../context/AuthProvider";
import { addToFavoriteItems, placeOrder, removeItemFromOrder } from "../../services/api";
import { Link } from "react-router-dom";

function OrderDetails({ orderData, setOrderData }) {
  const { auth } = useContext(AuthContext);
  const [favoriteItemResponse, setFavoriteItemResponse] = useState();
  const [addedToFavoritesStatus, setAddedToFavoritesStatus] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [itemNotAvailable, setItemNotAvailable] = useState(false);
  const [canProceedWithPayment, setCanProceedWithPayment] = useState(true);

  useEffect(() => {
    if (orderData) {
      const initialStatus = orderData.orderItems.map(() => false);
      setAddedToFavoritesStatus(initialStatus);
    }
  }, [orderData]);

  const handleTrashIconClick = async (userId, itemId, quantity) => {
    const requestBody = {
      userId: userId,
      itemId: itemId,
      quantity: quantity,
    };

    const queryParams = `?Authorization=Bearer ${auth.token}`;
    const orderResponse = await removeItemFromOrder(requestBody, queryParams);
    setOrderData(orderResponse);
  };

  const handleHeartIconClick = async (userId, itemId, index) => {
    const requestBody = {
      userId: userId,
      itemId: itemId,
    };

    const queryParams = `?Authorization=Bearer ${auth.token}`;
    const favoriteItemResponse = await addToFavoriteItems(requestBody, queryParams);
    setFavoriteItemResponse(favoriteItemResponse);
    setAddedToFavoritesStatus((prevStatus) => {
      const newStatus = [...prevStatus];
      newStatus[index] = true;
      return newStatus;
    });
  };

  const handlePayment = async (order) => {
    const queryParams = `?Authorization=Bearer ${auth.token}`;
    const closedOrder = await placeOrder(order, queryParams);

    if (!closedOrder) {
      setItemNotAvailable(true);
      setCanProceedWithPayment(false);
    } else {
      setOrderPlaced(true);
    }
  };

  const handleToMainPage = () => {
    setOrderData(undefined);
  };

  if (!orderData) {
    return (
      <div>
        <h1>Your Cart Is Empty</h1>
        <h3>Add Something To Cart</h3>
      </div>
    );
  }

  let totalPrice = 0;
  const orderItemResponse = orderData.orderItems.map((orderItem, index) => {
    const itemTotalPrice = orderItem.quantity * orderItem.itemResponse.itemPrice;
    totalPrice += itemTotalPrice;

    return (
      <div key={orderItem.orderItemId} className="item-block">
        <div className="order-item">
          <div>
            <img className="img" src={orderItem.itemResponse.photoUrl} alt="item" />
          </div>
          <div className="order-item-info">
            <h3>{orderItem.itemResponse.itemTitle}</h3>
            <h4>Quantity: {orderItem.quantity}</h4>
            <h4 className="price">Price: {orderItem.itemResponse.itemPrice} $</h4>
            <div className="icon-container">
              <FontAwesomeIcon
                className="icon"
                icon={faHeart}
                size="xl"
                style={{
                  color: addedToFavoritesStatus[index] ? "red" : "black",
                }}
                onClick={() =>
                  handleHeartIconClick(
                    orderData.order.orderUserId,
                    orderItem.itemResponse.itemId,
                    index
                  )
                }
              />
              <FontAwesomeIcon
                className="icon"
                icon={faTrashCan}
                size="xl"
                onClick={() =>
                  handleTrashIconClick(
                    orderData.order.orderUserId,
                    orderItem.itemResponse.itemId,
                    orderItem.quantity
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  });

  if (orderPlaced === true) {
    return (
      <div>
        <h3>Order Placed Successfully</h3>
        <h3>Thank you for placing your order with us. Your order details are as follows:</h3>
        <div className="placed-order">
          <h4>Shipping To : </h4>
          <h5>{orderData.order.shippingCountry}</h5>
          <h5>{orderData.order.shippingCity}</h5>
          <h5>{orderData.order.shippingAddress}</h5>
          <h5>Total Price: {totalPrice} $</h5>
        </div>
        <h3>Products:</h3>
        <div>
          {orderData.orderItems.map((orderItem) => (
            <div key={orderItem.orderItemId} className="ordered-product">
              <img className="img" src={orderItem.itemResponse.photoUrl} alt="item" />
              <div className="ordered-product-info">
                <h3>{orderItem.itemResponse.itemTitle}</h3>
                <p>Quantity: {orderItem.quantity}</p>
                <p className="price">Price: {orderItem.itemResponse.itemPrice} $</p>
              </div>
            </div>
          ))}
        </div>
        <Link to="/">
          <button className="toMainPage" onClick={handleToMainPage}>
            To Main Page
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="head">Shopping Cart</h1>
      <div className="container">
        <div className="order-block">
          <h1>Order Summary</h1>
          <h3>Shipping</h3>
          <h3>Country: {orderData.order.shippingCountry}</h3>
          <h3>City: {orderData.order.shippingCity}</h3>
          <h3>Address: {orderData.order.shippingAddress}</h3>
          <h3 className="price">Total Price: {totalPrice}$</h3>
          <br />
          {canProceedWithPayment ? (
            <button className="pay-button" onClick={() => handlePayment(orderData.order)}>
              Payment
            </button>
          ) : (
            <p>Sorry, one or more items in your order are currently not available.</p>
          )}
          <br />
          <Link to="/">
            <button className="continue-shopping">Continue Shopping</button>
          </Link>
        </div>
        <div>
          <h1 className="item-header">My Products</h1>
          {orderItemResponse}
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
