import React, { useState} from "react";
import AvailableItems from "./AvailableItems";
import Header from "./Header";

function MainPage({onAddToOrder}) {
    const [orderData, setOrderData] = useState({});
  
    const handleAddToOrder = (orderData) => {
        onAddToOrder(orderData);
        setOrderData(orderData);
    };

    return (
      <div>
        <Header />
        <AvailableItems onAddToOrder={handleAddToOrder} />
      </div>
    );
  }
  
  export default MainPage;