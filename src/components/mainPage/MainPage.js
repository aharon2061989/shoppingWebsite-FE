import React, { useEffect, useState } from "react";
import AvailableItems from "./AvailableItems";
import Header from "./Header";

function MainPage({ onAddToOrder, searchResults, userSearch}) {
  const [orderData, setOrderData] = useState({});
  const [searchResult, setSearchResult] = useState([]);
  const [clearSearch, setClearSearch] = useState(false);

  useEffect(() => {
    setSearchResult(searchResults)
  }, [searchResults, userSearch])

  const handleAddToOrder = (orderData) => {
    onAddToOrder(orderData);
    setOrderData(orderData);
  };

  const clearUserSearch = () => {
    setSearchResult([])
    setClearSearch(true);
  }

  return (
    <div>
      <Header />
      <AvailableItems
        onAddToOrder={handleAddToOrder}
        searchResult={searchResult}
        userSearch={userSearch}
        clearUserSearch = {clearUserSearch}
      />
    </div>
  );
}

export default MainPage;
