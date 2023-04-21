import React from "react";
import { css } from "styled-components";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

const PostCategoryStyled = styled.div`
  display: inline-block;
  padding: 8px 12px;
  border-radius: 8px;
  color: #6b6b6b;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 5px;
  a {
    display: block;
  }
  ${(props) =>
    props.type === "primary" &&
    css`
      background-color: #f3edff;
    `};
  ${(props) =>
    props.type === "secondary" &&
    css`
      background-color: white;
    `};
`;
const PostCategory = ({ children, type = "primary", to = "/", ...props }) => {
  return (
    <PostCategoryStyled type={type} {...props}>
      <NavLink to={to}>
        <div title={props.title}>{children}</div>
      </NavLink>
    </PostCategoryStyled>
  );
};

export default PostCategory;
