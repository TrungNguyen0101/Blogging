

import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../../contexts/auth-context";

import { Button } from "../../button";
const DashboardHeaderStyles = styled.div`
  background-color: white;
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  .header-avatar {
    width: 52px;
    height: 52px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 100rem;
    }
  }
  .header-button{
    margin: 0;
  }
`;

const DashboardHeader = () => {
  const { userInfo, user } = useAuth();
  // console.log("🚀 ~ file: DashboardHeader.js ~ line 33 ~ DashboardHeader ~ userInfo", userInfo)
  return (
    <DashboardHeaderStyles>
      <div className="right-auto flex flex-1">
        <NavLink to="/">
          <img srcSet="/monkey.png 2x" alt="" className="logo w-[60px] block " />
        </NavLink>
      </div>
      <Button to="/manage/add-post" className="header-button" height="52px">
        Write new post
      </Button>
      <div className="header-avatar">
        <NavLink to="manage/add-user">
          <img
            src={user?.avatar}
            alt=""
          />
        </NavLink>
      </div>
    </DashboardHeaderStyles>
  );
};

export default DashboardHeader;
