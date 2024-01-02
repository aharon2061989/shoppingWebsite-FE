import {axiosInstance as axios} from './axiosInstance'

const CREATE_NEW_USER = () => `api/public/CustomUser/create`;
const AUTHENTICATE = () => `api/public/authenticate`;
const AVAILABEL_ITEMS = () => 'item/all-items';
const ADD_ITEM_TO_ORDER = () => `order/add-to-order`;
const FIND_USER = (username) => `api/public/CustomUser/findUser/${username}`;
const REMOVE_ITEM_FROM_ORDER = () => `order/remove-from-order`;
const ADD_TO_FAVORITE = () => `favorite-item/create`;
const GET_ALL_FAVORITE_ITEMS = (userId) => `favorite-item/all-favorite-items/${userId}`;
const DELETE_FAVORITE_ITEM = (favoriteItemId) => `favorite-item/delete/${favoriteItemId}`;
const PLACE_ORDER = () => `order/place-order`;
const DELETE_ORDER = (orderId) => `order/delete/${orderId}`;
const GET_ALL_ORDERS = (userId) => `order/full-order-list/${userId}`;

export const createNewUser = (userBody) => {
    return axios.post(CREATE_NEW_USER(), userBody);
};

export const authenticate = (userBody) => {
    return axios.post(AUTHENTICATE(), userBody);
};

export const getListOfItems = async () => {
    try {
        const response = await axios.get(AVAILABEL_ITEMS());
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

export const addItemToOrder = async (requestBody, queryParams) => {
    try {
      const response = await axios.post(ADD_ITEM_TO_ORDER() + queryParams, requestBody);
      return response.data;
    } catch (error) {
      console.error("Error adding item to order: ", error);
      throw error;
    }
};

export const removeItemFromOrder = async (requestBody, queryParams) => {
    try {
        const response = await axios.post(REMOVE_ITEM_FROM_ORDER() + queryParams, requestBody);
        return response.data;
    } catch (error) {
        console.log("Error remove item from order: ", error);
        throw error;
    }
};
  

export const FindUserByUserName = async (username) => {
    try {
        const response =  await axios.get(FIND_USER(username));
        return response.data;
    }
    catch (error) {
        console.log("Error Get User Id : " + error);
        throw error;
    }
};

export const addToFavoriteItems = async (requestBody, queryParams) => {
    try {
        const response = await axios.post(ADD_TO_FAVORITE() + queryParams, requestBody);
        return response.data;
    } catch (error) {
        console.log("Error Add Item To Favorites : " + error);
        throw error;
    }
};

export const getAllFavoriteItems = async (userId, queryParams) => {
    try {
        const response = await axios.get(GET_ALL_FAVORITE_ITEMS(userId) + queryParams);
        return response.data;
    } catch (error) {
        console.log("error get al favorite items " + error);
        throw error;
    }
};

export const deleteFevoriteItem = async (favoriteItemId, queryParams) => {
    return axios.delete(DELETE_FAVORITE_ITEM(favoriteItemId) + queryParams);
};

export const placeOrder = async (requestBody, queryParams) => {
    try {
        const orderResponse = await axios.post(PLACE_ORDER() + queryParams, requestBody);
        return orderResponse.data;
    } catch (error) {
        console.log("error place order " + error);
        throw error;
    }
};

export const deleteOrder = async (orderId, queryParams) => {
    return axios.delete(DELETE_ORDER(orderId) + queryParams);
}

export const userAllOrders = async (userId, queryParams) => {
    try {
        const response = await axios.get(GET_ALL_ORDERS(userId) + queryParams);
        return response.data; 
    } catch (error) {
        console.error("Error getting all orders: " + error);
        throw error;
    }
};

