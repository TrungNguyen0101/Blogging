import { signOut } from "firebase/auth";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../contexts/auth-context";
import { auth } from "../../firebase/fire-config";
import { Button } from "../button";

const HeaderStyled = styled.header`
  padding-top: 2rem;
  .header-main {
    display: flex;
    align-items: center;
  }
  .logo {
    max-width: 50px;
    object-fit: cover;
    display: block;
  }
  .menu {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-left: 40px;
    list-style: none;
  }
  .header-right {
    flex: 1;
    display: flex;
    align-items: center;
  }
  .search {
    margin-left: auto;
    max-width: 350px;
    display: flex;
    align-items: center;
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 8px;
    position: relative;
    margin-right: 2rem;
  }
  .search-icon {
    svg {
      width: 2rem;
      height: 2rem;
    }
    width: 2rem;
    height: 2rem;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 15px;
    cursor: pointer;
  }
  .search-input {
    width: 100%;
    padding-right: 40px;
  }
  .button-signUp {
    padding: 10px 40px;
    border-radius: 10px;
    background-image: linear-gradient(
      to right bottom,
      ${(props) => props.theme.primaryColor},
      ${(props) => props.theme.secondaryColor}
    );
    color: white;
    font-weight: 500;
    cursor: pointer;
    margin: 0;
  }
  
`;
const menuLinks = [
  {
    url: "/",
    title: "Home",
  },
  {
    url: "/dashboard",
    title: "Dashboard",
  },
  /*  {
     url: "/contact",
     title: "Contact",
   }, */
];
const Header = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  console.log("🚀 ~ file: Header.js ~ line 84 ~ Header ~ userInfo", userInfo);
  return (
    <HeaderStyled>
      <div className="container">
        <div className="header-main">
          <NavLink to="/">
            <img srcSet="/monkey.png 2x" alt="" className="logo" />
          </NavLink>
          <ul className="menu">
            {menuLinks.length > 0 &&
              menuLinks.map((item) => (
                <li className="menu-item" key={item.title}>
                  <NavLink to={item.url} className="menu-link">
                    {item.title}
                  </NavLink>
                </li>
              ))}
          </ul>
          <div className="header-right">
            <div className="search">
              <input
                type="text"
                className="search-input"
                placeholder="Search posts..."
              />
              <span className="search-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
            </div>
            {!userInfo ? (
              <Button
                className="button-signUp"
                onClick={() => {
                  navigate("/sign-up");
                }}
              >
                Sign Up
              </Button>
            ) : (
              <div>
                <div className="header-auth">
                  <span>Welcome back,</span>
                  <strong className="text-primary">{userInfo?.displayName}</strong>
                </div>
                <button className="p-3 bg-red-500 text-white rounded-lg" onClick={() => {
                  signOut(auth)
                }}>Log out</button>
              </div>
            )}

          </div>
        </div>
      </div>
    </HeaderStyled>
  );
};

export default Header;
