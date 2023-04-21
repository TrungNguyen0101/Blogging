import React from "react";
import { css } from "styled-components";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

const PostTitleStyled = styled.h3`
  font-weight: bold;
  line-height: 1.5;
  a{
      display: block;
  }
  ${(props) =>
        (props.size === "normal") &&
        css`
      font-size: 18px;
    `};
  ${(props) =>
        (props.size === "big") &&
        css`
    font-size: 22px;
    `};
`;
const PostTitle = ({ children, size = "normal", to = "/", ...props }) => {
    return (
        <PostTitleStyled size={size} {...props}>
            <NavLink to={to}>
                {children}
            </NavLink>
        </PostTitleStyled>
    );
};

export default PostTitle;
