import React, { useEffect, useState, useContext } from "react";
import { getListOfItems, getAllFavoriteItems, FindUserByUserName, addToFavoriteItems, addItemToOrder } from "../../services/api";
import "./AvailableItems.css";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";

function AvailableItems({ onAddToOrder, searchResult, userSearch}) {
  const [items, setItems] = useState([]);
  const { auth } = useContext(AuthContext);
  const [orderResponse, setOrderResponse] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isUserSearch, setIsUserSearch] = useState(false);

  useEffect(() => {
    setSearchResults(searchResult)
    setIsUserSearch(userSearch);
    console.log(isUserSearch, "in available!!!")
  }, [searchResult, userSearch])

  useEffect(() => {
    const getItems = async () => {
      try {
        const response = await getListOfItems();
        setItems(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    getItems();
  });

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

  const clearSearch = () => {
    setSearchResults([]);
    setIsUserSearch(false);
  }

  if(userSearch && searchResults.length === 0 && isUserSearch === true) {
    return(
      <div>
        <h1>no results found on your search!</h1>
        <button className="clear-search" onClick={clearSearch}>Clear Search</button>
      </div>
    )
  };


  return (
    <div>
      <div className="grid-container-search">
        {searchResults.length > 0 && userSearch === true ? (
          searchResults.map((result) => (
            <div
              key={result.itemId}
              className="grid-item"
              style={{ gridTemplateColumns: "1fr 1fr" }}
            >
              <img src={result.photoUrl} alt={result.itemTitle} />
              <div>
                <h3>{result.itemTitle}</h3>
                <p>Price: {result.itemPrice} $</p>
                <p>Available Stock: {result.stockQuantity}</p>
                <label htmlFor={`quantity-${result.itemId}`}>Quantity:</label>
                <input
                  type="number"
                  id={`quantity-${result.itemId}`}
                  name={`quantity-${result.itemId}`}
                  min="1"
                  max={result.stockQuantity}
                  defaultValue="1"
                />
  
                {result.stockQuantity > 0 ? (
                  <Link
                    to={auth && auth.token ? "/OrderDetails" : "/login"}
                    className={`order-link`}
                    onClick={() => {
                      const selectedQuantity = parseInt(document.getElementById(`quantity-${result.itemId}`).value, 10);
                      handleAddToOrderClick(result, selectedQuantity);
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
                  icon={isFavorite(result.itemId) ? faHeartSolid : faHeart}
                  size="xl"
                  className={`heart-icon ${isFavorite(result.itemId) ? "active" : ""}`}
                  onClick={() => {
                    handleHeartIconClick(result);
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          items.length > 0 && items.map((item) => (
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
        )}
      </div>
  
      {userSearch && isUserSearch && (
        <button className="clear-search" onClick={clearSearch}>Clear Search</button>
      )}
    </div>
  );
  
}

export default AvailableItems;
