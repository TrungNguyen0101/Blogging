import { collection, doc, getDoc, query, where } from "firebase/firestore";
import React, { useState } from "react";
import { useEffect } from "react";
import slugify from "slugify";
import styled from "styled-components";
import { db } from "../../../firebase/fire-config";
import PostCategory from "./postComponent/PostCategory";
import PostImage from "./postComponent/PostImage";
import PostInfo from "./postComponent/PostInfo";
import PostTitle from "./postComponent/PostTitle";
const PostFeatureItemStyles = styled.div`
  width: 100%;
  border-radius: 16px;
  position: relative;
  height: 169px;
  .post {
    &-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 16px;
    }
    &-overlay {
      position: absolute;
      inset: 0;
      border-radius: 16px;
      background: linear-gradient(
        179.77deg,
        #6b6b6b 36.45%,
        rgba(163, 163, 163, 0.622265) 63.98%,
        rgba(255, 255, 255, 0) 99.8%
      );
      mix-blend-mode: multiply;
      opacity: 0.6;
    }
    &-content {
      position: absolute;
      inset: 0;
      z-index: 10;
      padding: 20px;
      color: white;
    }
    &-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
  }
  @media screen and (min-width: 1024px) {
    height: 272px;
  }
`;
const PostFeatureItem = ({ data }) => {
  const [category, setCategory] = useState();
  const [user, setUser] = useState();
  useEffect(() => {
    async function fetch() {
      const docRef = doc(db, "categories", data.categoryID);
      const docSnap = await getDoc(docRef);
      setCategory(docSnap.data());
    }
    async function fetchUser() {
      const docRef = doc(db, "users", data.userId);
      const docSnap = await getDoc(docRef);
      setUser(docSnap.data());
    }
    fetch();
    fetchUser();
  }, [data.categoryID, data.userId]);

  const date = data?.createAt?.seconds
    ? new Date(data?.createAt?.seconds * 1000)
    : new Date();
  const formatDate = new Date(date).toLocaleDateString("vi");

  if (!data) return null;
  return (
    <PostFeatureItemStyles>
      <PostImage url={data.image} alt="unsplash"></PostImage>
      <div className="post-overlay"></div>
      <div className="post-content">
        <div className="post-top">
          <PostCategory title={category?.name} to={category?.slug}>
            {category?.name.slice(0, 5)
              ? category?.name.slice(0, 5) + "..."
              : "FrontEnd"}
          </PostCategory>
          <PostInfo
            to={slugify(user?.fullname || "", { lower: true })}
            user={user}
            date={formatDate}
          ></PostInfo>
        </div>
        <PostTitle to={data?.slug} size="big">
          {data.title}
        </PostTitle>
      </div>
    </PostFeatureItemStyles>
  );
};

export default PostFeatureItem;
