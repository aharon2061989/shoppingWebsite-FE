import React, { useContext, useState} from "react";
import classes from "./Navbar.module.css";
import SearchBar from "./SearchBar";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";


function Navbar({handleSearchResultInApp, userSearchNotificationApp}) {

  const {auth, setAuth} = useContext(AuthContext);
  const [searchResult, setSearchResult] = useState([]);
  const [userSearch, setUserSearch] = useState(false);
  const [clearSearch, setClearSearch] = useState(false);  

  const handleLogOut = () => {
    if (auth.token) {
      setAuth({ username: null, token: null, isLoggedIn: false });
    }
  }

  const userSearchNotificationNavbar = (userSearch) => {
    userSearchNotificationApp(userSearch)
  }

  const handleSearchResult = (result) => {
    setSearchResult(result);
    handleSearchResultInApp(result);
  };

  const clearUserSearch = () => {
    setClearSearch(true);
  };
  

  return (
    <nav className={classes.nav}>
      <ul>
        <img
          className={classes.img}
          src="https://img.freepik.com/free-vector/retro-football-badge-with-wings_1176-119.jpg?size=626&ext=jpg&ga=GA1.1.1947403898.1700946299&semt=ais"
          alt="logo"
        ></img>
        <CustomLink to="/" onClick={clearUserSearch}>
          Main Page
        </CustomLink>
        <CustomLink to={auth && auth.token ? "/OrderList": "/Login"}>
          Order List
        </CustomLink>
        <CustomLink to={auth && auth.token ? "/FavoriteItems": "/Login"}>
          Favorite Items
        </CustomLink>
        <SearchBar userSearchNotificationNavbar={userSearchNotificationNavbar} handleSearchResult={handleSearchResult} />       
        <CustomLink to="/login" className={classes.login} hidden={auth.isLoggedIn}>
          Login
        </CustomLink>
        <CustomLink to="/register" className={classes.register} hidden={auth.isLoggedIn} >
          Register
        </CustomLink>
        <CustomLink to="/" className={classes.logout} onClick={handleLogOut} hidden={!auth.isLoggedIn}>
          Log Out
        </CustomLink>
        <CustomLink to="OrderDetails" className={classes.cartLink}>
          <FontAwesomeIcon icon={faShoppingCart}/>
          <p className={classes.cartMessage}>Go To Cart</p>
        </CustomLink>
      </ul>
    </nav>
  );
}

function CustomLink({ to, children, hidden, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
      <li className={isActive ? classes.active : ""} style={{ display: hidden ? 'none' : 'block' }}>
          <Link to={to} {...props}>
              {children}
          </Link>
      </li>
  )
}

export default Navbar; 