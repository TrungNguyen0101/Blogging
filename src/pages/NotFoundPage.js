import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

const NotFoundPageStyleds = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .logo{
    margin-bottom: 40px;
    display: inline-block;
  }
  .heading{
    font-size: 60px;
    font-weight: bold;
    margin-bottom: 40px;
  }
  .back{
    display: inline-block;
    padding: 15px 30px;
    background-color : ${props => props.theme.primaryColor};
    border-radius:12px;
    color:white;
    font-weight: 500;
  }
`;
const NotFoundPage = () => {
    return (
        <NotFoundPageStyleds>
            <NavLink to="/" className="logo">
                <img srcSet="/monkey.png 2x" alt="monkey-blog" />
            </NavLink>
            <h1 className="heading">Oops! Page not found</h1>
            <NavLink to="/" className="back">Back go home</NavLink>
        </NotFoundPageStyleds>
    );
};

export default NotFoundPage;
