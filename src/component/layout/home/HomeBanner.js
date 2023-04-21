import React from "react";
import styled from "styled-components";
import { Button } from "../../button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const HomeBannerStyled = styled.div`
  padding-bottom: 40px;
  color: white;
  .banner {
    margin-top: 40px;
    height: 520px;
    background-image: linear-gradient(
      to right bottom,
      ${(props) => props.theme.primaryColor},
      ${(props) => props.theme.secondaryColor}
    );
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 40px;
  }
  .banner-content {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
  }
  .banner-heading {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 30px;
  }
  .banner-desc {
    max-width: 420px;
    margin-bottom: 50px;
    font-size: 14px;
    line-height: 28px;
    font-weight: 400;
  }
  .banner-button {
    background-color: white !important;
    background-image: none;
    color: ${(props) => props.theme.primaryColor};
    margin: 0;
    width: 230px;
  }
  .banner-image {
    img {
      width: 450px;
      height: 370px;
      object-fit: cover;
      display: inline-block;
    }
  }
`;
const HomeBanner = () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Home Page"
  })
  return (
    <HomeBannerStyled>
      <div className="container">
        <div className="banner">
          <div className="banner-content">
            <h1 className="banner-heading">Monkey Blogging</h1>
            <p className="banner-desc">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi.
            </p>
            <Button
              className="banner-button"
              onClick={() => {
                navigate("/sign-up");
              }}
            >
              Get Started
            </Button>
          </div>
          <div className="banner-image">
            <img srcSet="/banner.png 2x" alt="" />
          </div>
        </div>
      </div>
    </HomeBannerStyled>
  );
};

export default HomeBanner;
