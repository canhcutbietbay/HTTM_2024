import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Container, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Navbar.css";
import axios from "axios";

function Nav({ userImage, onSearch, searchChange }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchHistoryVisible, setSearchHistoryVisible] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const accountMenuRef = useRef(null);
  const accountBtnRef = useRef(null);
  const searchBoxRef = useRef(null);
  const searchHistoryRef = useRef(null);
  const [isHome, setIsHome] = useState(true);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    if (!menuVisible) {
      const btnRect = accountBtnRef.current.getBoundingClientRect();
      accountMenuRef.current.style.top = `${btnRect.bottom + 20}px`;
      accountMenuRef.current.style.left = `${btnRect.left}px`;
    }
  };

  const handleSearchBoxClick = () => {
    setSearchHistoryVisible(true);
    if (searchBoxRef.current && searchHistoryRef.current) {
      searchHistoryRef.current.style.width = `${searchBoxRef.current.offsetWidth}px`;
    }
  };

  const handleSearchHistoryClick = (item) => {
    setSearchQuery(item);
    setSearchHistoryVisible(false);
    searchRecipes(item); // Tìm kiếm với từ khóa đã chọn từ lịch sử tìm kiếm
  };

  const clearSearchHistory = async () => {
    setSearchHistory([]);
    try {
      await axios.delete("https://26.216.17.44:3000/api/history", {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error clearing search history:", error);
    }
  };

  const handleClickOutside = (event) => {
    if (
      accountMenuRef.current &&
      accountBtnRef.current &&
      !accountMenuRef.current.contains(event.target) &&
      !accountBtnRef.current.contains(event.target)
    ) {
      setMenuVisible(false);
    }
    if (
      searchHistoryRef.current &&
      searchBoxRef.current &&
      !searchHistoryRef.current.contains(event.target) &&
      !searchBoxRef.current.contains(event.target)
    ) {
      setSearchHistoryVisible(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchHistory.map((history) => {
      if (history.Text === searchQuery.trim()) {
        setSearched(true);
      }
    });
    if (!searched) {
      //fetch api
      axios
        .post("https://26.216.17.44:3000/api/history", null, {
          params: {
            search_term: searchQuery.trim(),
          },
          withCredentials: true,
        })
        .then(() => console.log("new search: ", searchQuery.trim()));
    }
    searchRecipes(searchQuery.trim());
    setSearchHistoryVisible(false);
  };

  const searchRecipes = async (query) => {
    try {
      onSearch(query);

      // console.log(query);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const fetchSearchHistory = async () => {
    try {
      const response = await axios.get(
        "https://26.216.17.44:3000/api/history",
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      setSearchHistory(data);
    } catch (error) {
      console.error("Error fetching search history:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get("https://26.216.17.44:3000/api/logout", {
        withCredentials: true,
      });
      localStorage.removeItem("userEmail");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    setIsHome(typeof onSearch === "function");
    if (isHome) {
      fetchSearchHistory();
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [searchChange]);

  return (
    <Navbar fixed="top" expand="lg" className="navbar w-100">
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="navbar-brand"
          // onClick={onBrandClick}
        >
          <img
            src={`${process.env.PUBLIC_URL}/logo.png`}
            alt="Logo"
            className="mb-3"
            style={{ width: "50px", height: "50px" }}
          />
          WhatEat!
        </Navbar.Brand>
        {isHome && (
          <div className="search-box mx-5" ref={searchBoxRef}>
            <Form className="w-100" onSubmit={handleSearchSubmit}>
              <Form.Control
                type="text"
                placeholder="Explore recipes"
                id="searchInput"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchBoxClick}
              />
              {searchHistoryVisible && searchHistory.length > 0 && (
                <div
                  className="search-history"
                  id="searchHistory"
                  ref={searchHistoryRef}
                >
                  {searchHistory.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleSearchHistoryClick(item.Text)}
                    >
                      {item.Text}
                    </div>
                  ))}
                  <div className="clear-history" onClick={clearSearchHistory}>
                    Clear all history
                  </div>
                </div>
              )}
            </Form>
          </div>
        )}
        <Button
          variant="outline-secondary"
          className="account-btn"
          onClick={(event) => {
            event.stopPropagation();
            toggleMenu();
          }}
          ref={accountBtnRef}
        >
          <img src={userImage} alt="User Avatar" />
        </Button>
        <div
          className={`account-menu ${menuVisible ? "show" : ""}`}
          ref={accountMenuRef}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <p>
            <b>{localStorage.getItem("userEmail")}</b>
          </p>
          {isHome ? <Link to="/profile">My Recipes</Link> : <span></span>}
          <a onClick={handleLogout} style={{ cursor: "pointer", color: "red" }}>
            Log out
          </a>
        </div>
      </Container>
    </Navbar>
  );
}

export default Nav;
