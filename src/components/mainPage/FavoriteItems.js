import React, {useContext, useEffect, useState} from "react";
import "../mainPage/FavoriteItems.css";
import AuthContext from "../context/AuthProvider";
import { getAllFavoriteItems, FindUserByUserName, deleteFevoriteItem } from "../../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faTrashCan } from "@fortawesome/free-regular-svg-icons";

function FavoriteItems() {
    const {auth} = useContext(AuthContext);
    const [favoriteItems, setFavoriteItems] = useState([]);

    

    useEffect(() => {
        if(auth.token!== undefined){
            getFavoriteItems();
        }
    });
    
    const getFavoriteItems = async () => {
    try {
        const user = await FindUserByUserName(auth.username);
        const userId = user.userId;
        const items = await getAllFavoriteItems(userId);
        setFavoriteItems(items);
    } catch (error) {
        console.error('Error fetching favorite items:', error);
    }
    };

    const handleDelete = async (favoriteItemId) => {
        const queryParams = `?Authorization=Bearer ${auth.token}`;
        try {
          await deleteFevoriteItem(favoriteItemId, queryParams);
          await getFavoriteItems();
        } catch (error) {
          console.error("Error deleting favorite item:", error);
        }
      };

    return(
        <div>
        {favoriteItems.length === 0 ? <h2>I Am Empty, Add Some Item</h2> : <h2>Your Favorite Items</h2>}
        <div className="favorite-items-container">
            {favoriteItems.map(item => (
                <div key={item.id} className="favorite-item">
                    <img src={item.favoriteItem.photoUrl} alt={item.favoriteItem.itemTitle} />
                    <h3>{item.favoriteItem.itemTitle}</h3>
                    <p>Price: {item.favoriteItem.itemPrice}$</p>
                    <p>Stock Quantity: {item.favoriteItem.stockQuantity}</p>
                    <FontAwesomeIcon icon={faTrashCan} size="xl" className="icon"
                        onClick={() => handleDelete(item.favoriteItem.itemId)}
                    />
                </div>
            ))}
        </div>
    </div>
    )
}

export default FavoriteItems;