import React from "react";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";

const PostInfoStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 600;
  color:inherit;
  .post{
    &-dot {
      display: inline-block;
      width: 4px;
      height: 4px;
      background-color: currentColor;
      border-radius: 100rem;
    }
    &-time{
      margin-left: 10px;
    }
  }
`;
const PostInfo = ({ date, author = "Andiez Le", className, to = "/", user, }) => {
  const d = new Date().toLocaleDateString("vi");

  // console.log("🚀 ~ file: PostInfo.js ~ line 27 ~ PostInfo ~ x", d)
  // console.log("🚀 ~ file: PostInfo.js ~ line 22 ~ PostInfo ~ props", data)
  return (
    <PostInfoStyled className={className}>
      <span className="post-time">{date || d}</span>
      <span className="post-dot"></span>
      <Link to={to}>
        <span className="post-author">{author}</span>
      </Link>
    </PostInfoStyled>
  );
};

export default PostInfo;
