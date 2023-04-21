import React from "react";
import styled from "styled-components";
import PostCategory from "./postComponent/PostCategory";
import PostImage from "./postComponent/PostImage";
import PostInfo from "./postComponent/PostInfo";
import PostTitle from "./postComponent/PostTitle";
const PostNewestLargeStyles = styled.div`
  .post {
    &-image {
      display: block;
      margin-bottom: 16px;
      height: 433px;
      border-radius: 16px;
    }
  }
  .post-category1 {
    margin-bottom: 10px;
  }
  .post-title {
    margin-bottom: 10px;
  }
`;

const PostNewestLarge = () => {
  return (
    <PostNewestLargeStyles>
      <PostImage url="https://images.unsplash.com/photo-1510519138101-570d1dca3d66?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2294&q=80"></PostImage>
      <PostCategory className="post-category1">Kiến thức</PostCategory>
      <PostTitle size="big" className="post-title">
        Hướng dẫn setup phòng cực chill dành cho người mới toàn tập
      </PostTitle>
      <PostInfo></PostInfo>
    </PostNewestLargeStyles>
  );
};

export default PostNewestLarge;
