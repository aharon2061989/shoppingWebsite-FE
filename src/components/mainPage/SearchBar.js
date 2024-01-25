import React, { useState } from "react";
import "../mainPage/SearchBar.css";
import { searchItems } from "../../services/api";

function SearchBar({handleSearchResult, userSearchNotificationNavbar}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [userSearch, setUserSearch] = useState(false)

  const handleSearch = async () => {
    try {
      const capitalizedSearchTerm = capitalizeFirstLetter(searchTerm);
      const result = await searchItems(capitalizedSearchTerm);
      setSearchResults(result);
      handleSearchResult(result);
    } catch (error) {
      console.error("Error searching items:", error);
      setSearchResults([]);
      handleSearchResult([])
    }
    finally {
      setUserSearch(false);
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const userSearchNotification = () => {
    setUserSearch(true);
    userSearchNotificationNavbar(true);
  }

  return (
    <div className="search-bar-container">
      <input
        type="text"
        className="search-input"
        placeholder="    Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className="search-button" onClick={() => { handleSearch(); userSearchNotification(); }}>
        Search
      </button>
    </div>
  );
}

export default SearchBar;
