import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../../../firebase/fire-config";
import PostCategory from "./postComponent/PostCategory";
import PostImage from "./postComponent/PostImage";
import PostInfo from "./postComponent/PostInfo";
import PostTitle from "./postComponent/PostTitle";
const PostItemStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .post {
    &-image {
      height: 202px;
      margin-bottom: 20px;
      display: block;
      width: 100%;
      border-radius: 16px;
    }
  }
  .post-category {
    margin-bottom: 10px;
  }
  .post-title {
    margin-bottom: 8px;
  }
`;

const PostItem = ({ post }) => {
  console.log(post?.userID)
  const [user, setUser] = useState()
  console.log("🚀 ~ file: PostItem.js ~ line 33 ~ PostItem ~ user", user)
  useEffect(() => {
    async function fetchUser() {
      if (!post?.userId) return;
      const colRef = doc(db, "users", post?.userId);
      const result = await getDoc(colRef);
      setUser(result.data())
      console.log(result.data())
    }
    fetchUser()
  }, [post?.userId])
  // console.log("🚀 ~ file: PostItem.js ~ line 29 ~ PostItem ~ post", post)
  const date = new Date(post?.createAt?.seconds * 1000).toLocaleDateString("vi")
  return (
    <PostItemStyles>
      <PostImage to={`/${post?.slug}`}
        url={post?.image}
      ></PostImage>
      <PostCategory className="post-category">{post?.category?.name}</PostCategory>
      <PostTitle to={`/${post?.slug}`} className="post-title">
        {post?.title}
      </PostTitle>
      <PostInfo date={date} author={user?.fullname}></PostInfo>
    </PostItemStyles>
  );
};

export default PostItem;
