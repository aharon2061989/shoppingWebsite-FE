import React from "react";
import "./Header.css";

function Header() {
    return (
        <div className="header">
            <img src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D" alt="logo"/>
            <img className="left" src="https://cdn.broadbandtvnews.com/wp-content/uploads/2018/08/14113659/LaLiga.jpg" alt="logo"/>
            <h1 className="h1">All-Star Football</h1>
            <h2>Shipping Wroldwide</h2>
            <img className="right" src="https://cdnuploads.aa.com.tr/uploads/Contents/2022/08/27/thumbs_b_c_928abfa2353ad9248b638f3430ec8581.jpg?v=195647" alt="logo"/>
        </div>
    )
}
export default Header;