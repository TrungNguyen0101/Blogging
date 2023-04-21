import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { isBuffer } from "lodash";
import parse from 'html-react-parser';
import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../component/layout/Header";
import Heading from "../component/layout/Heading";
import PostCategory from "../component/layout/post/postComponent/PostCategory";
import PostImage from "../component/layout/post/postComponent/PostImage";
import PostItem from "../component/layout/post/PostItem";
import PostMeta from "../component/layout/post/PostMeta";
import { db } from "../firebase/fire-config";
import NotFoundPage from "./NotFoundPage";
import PostRelate from "../component/layout/post/postComponent/PostRelate";
const PostDetailsPageStyles = styled.div`
  padding-bottom: 100px;
  .post {
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 40px;
      margin: 40px 0;
    }
    &-feature {
      width: 100%;
      max-width: 640px;
      height: 466px;
      border-radius: 20px;
    }
    &-heading {
      font-weight: bold;
      font-size: 36px;
      margin-bottom: 16px;
    }
    &-info {
      flex: 1;
    }
    &-content {
      max-width: 700px;
      margin: 80px auto;
    }
  }
  .author {
    margin-top: 40px;
    margin-bottom: 80px;
    display: flex;
    border-radius: 20px;
    background-color: ${(props) => props.theme.grayF3};
    &-image {
      width: 200px;
      height: 200px;
      flex-shrink: 0;
      border-radius: inherit;
    }
    &-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }
    &-content {
      flex: 1;
      padding: 20px;
    }
    &-name {
      font-weight: bold;
      margin-bottom: 10px;
      font-size: 20px;
    }
    &-desc {
      font-size: 14px;
      line-height: 2;
    }
  }
  @media screen and (max-width: 1023.98px) {
    padding-bottom: 40px;
    .post {
      &-header {
        flex-direction: column;
      }
      &-feature {
        height: auto;
      }
      &-heading {
        font-size: 26px;
      }
      &-content {
        margin: 40px 0;
      }
    }
    .author {
      flex-direction: column;
      &-image {
        width: 100%;
        height: auto;
      }
    }
  }
`;

const PostDetailsPage = () => {
  const { id } = useParams()
  const [postInfo, setPostInfo] = useState("")
  // console.log("🚀 ~ file: PostDetailsPage.js ~ line 106 ~ PostDetailsPage ~ postInfo", postInfo)
  const [user, setUser] = useState()
  // console.log("🚀 ~ file: PostDetailsPage.js ~ line 107 ~ PostDetailsPage ~ user", user)
  const userID = postInfo.userId
  // console.log("🚀 ~ file: PostDetailsPage.js ~ line 99 ~ PostDetailsPage ~ param", id);
  useEffect(() => {
    async function fetchData() {
      const q = query(collection(db, "posts"), where("slug", "==", id))

      onSnapshot(q, snapshot => {
        snapshot.forEach((doc) => {
          doc.data() && setPostInfo(doc.data())
        })
      })
    }
    fetchData()
  }, [id])
  useEffect(() => {
    async function fetchUser() {
      if (!userID) return;
      const colRef = doc(db, "users", userID);
      const result = await getDoc(colRef);
      // console.log("🚀 ~ file: PostUpdate.js ~ line 26 ~ PostUpdate ~ post", post)
      setUser(result.data())
    }
    fetchUser()
  }, [userID])
  useEffect(() => {
    document.body.scrollIntoView({ behavior: "smooth", block: "start" });
  })
  const date = new Date(postInfo?.createAt?.seconds * 1000).toLocaleDateString("vi")
  if (!id) return <NotFoundPage></NotFoundPage>
  if (!postInfo.title) return null;
  return (
    <PostDetailsPageStyles>
      <Header></Header>
      <div className="container">
        <div className="post-header">
          <PostImage
            url={postInfo.image}
            className="post-feature"
          ></PostImage>
          <div className="post-info">
            <PostCategory className="mb-6">{postInfo?.category?.name}</PostCategory>
            <h1 className="post-heading">
              {postInfo.title}
            </h1>
            <PostMeta date={date} authorName={user?.fullname}></PostMeta>
          </div>
        </div>
        <div className="post-content ">
          <div className="entry-content">
            {parse(postInfo?.content || "")}
          </div>
          <div className="author">
            <div className="author-image">
              <img
                src={user?.avatar}
                alt=""
              />
            </div>
            <div className="author-content">
              <h3 className="author-name">{user?.fullname}</h3>
              <p className="author-desc">
                {user?.desc}
              </p>
            </div>
          </div>
        </div>
        <PostRelate categoryID={postInfo.categoryID} ></PostRelate>
      </div>

    </PostDetailsPageStyles>
  );
};

export default PostDetailsPage;
