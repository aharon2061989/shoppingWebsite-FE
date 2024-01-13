import React, { useEffect, useState, useContext } from "react";
import { getListOfItems, getAllFavoriteItems, FindUserByUserName, addToFavoriteItems, addItemToOrder } from "../../services/api";
import "./AvailableItems.css";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";

function AvailableItems({ onAddToOrder }) {
  const [items, setItems] = useState([]);
  const { auth } = useContext(AuthContext);
  const [orderResponse, setOrderResponse] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const getItems = async () => {
      try {
        const response = await getListOfItems();
        setItems(response);

        const favoriteItems = await getFavoriteItems();
        setFavorites(favoriteItems);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getItems();
  }, [auth.token]);

  const getFavoriteItems = async () => {
    try {
      const response = await FindUserByUserName(auth.username);
      const userId = response.userId;
      const queryParams = `?Authorization=Bearer ${auth.token}`;
      const favoriteItems = await getAllFavoriteItems(userId, queryParams);
      return favoriteItems;
    } catch (error) {
      console.error("Error fetching favorite items:", error);
      throw error;
    }
  };

  const handleAddToOrderClick = async (item, quantity) => {
    try {
      const response = await FindUserByUserName(auth.username);
      const userId = response.userId;

      if (auth && auth.token) {
        const requestBody = {
          userId: userId,
          itemId: item.itemId,
          quantity: quantity,
        };

        const queryParams = `?Authorization=Bearer ${auth.token}`;
        try {
          const response = await addItemToOrder(requestBody, queryParams);

          const orderData = {
            order: response.order,
            orderItems: response.orderItems,
          };

          onAddToOrder(orderData);
          setOrderResponse(orderData);
        } catch (error) {
          console.log("Error adding item to order:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleHeartIconClick = async (item) => {
    try {
      const response = await FindUserByUserName(auth.username);
      const userId = response.userId;

      const queryParams = `?Authorization=Bearer ${auth.token}`;

      const requestBody = {
        userId: userId,
        itemId: item.itemId,
      };

      await addToFavoriteItems(requestBody, queryParams);
      const updatedFavorites = await getFavoriteItems();
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error("Error updating favorite items:", error);
    }
  };

  const isFavorite = (itemId) => favorites.some((fav) => fav.favoriteItem.itemId === itemId);

  return (
    <div>
      <div className="grid-container">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.itemId}
              className="grid-item"
              style={{ gridTemplateColumns: "1fr 1fr" }}
            >
              <img src={item.photoUrl} alt={item.itemTitle} />
              <div>
                <h3>{item.itemTitle}</h3>
                <p>Price: {item.itemPrice} $</p>
                <p>Available Stock: {item.stockQuantity}</p>
                <label htmlFor={`quantity-${item.itemId}`}>Quantity:</label>
                <input
                  type="number"
                  id={`quantity-${item.itemId}`}
                  name={`quantity-${item.itemId}`}
                  min="1"
                  max={item.stockQuantity}
                  defaultValue="1"
                />

                {item.stockQuantity > 0 ? (
                  <Link
                    to={auth && auth.token ? "/OrderDetails" : "/login"}
                    className={`order-link`}
                    onClick={() => {
                      const selectedQuantity = parseInt(document.getElementById(`quantity-${item.itemId}`).value, 10);
                      handleAddToOrderClick(item, selectedQuantity);
                    }}
                  >
                    Add To Cart
                  </Link>
                ) : (
                  <p><b>Out of Stock</b></p>
                )}
                <br />
                <br />
                <FontAwesomeIcon
                  icon={isFavorite(item.itemId) ? faHeartSolid : faHeart}
                  size="xl"
                  className={`heart-icon ${isFavorite(item.itemId) ? "active" : ""}`}
                  onClick={() => {
                    handleHeartIconClick(item);
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default AvailableItems;
