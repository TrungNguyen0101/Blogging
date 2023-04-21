import React from "react";
import PostFeatureItem from "../post/PostFeatureItem";
import styled from "styled-components";
import Heading from "../Heading";
import { useState } from "react";
import { useEffect } from "react";
import {
    collection,
    limit,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";
import { db } from "../../../firebase/fire-config";
const HomeFeatureStyles = styled.div`
  .grid-layout {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0 50px;
  }
`;

const HomeFeature = () => {
    const [post, setPost] = useState();
    // console.log("🚀 ~ file: HomeFeature.js ~ line 25 ~ HomeFeature ~ post", post)
    useEffect(() => {
        const colRef = collection(db, "posts");
        const q1 = query(
            colRef,
            where("status", "==", 1),
            where("hot", "==", true),
            limit(3)
        );
        onSnapshot(q1, (snapshot) => {
            // console.log(snapshot);
            const result = [];
            snapshot.forEach((doc) => {
                result.push({
                    id: doc.id,
                    ...doc.data(),
                });
            })
            setPost(result);
            // console.log(result)
        });
    }, []);
    if (!post) return null;
    return (
        <HomeFeatureStyles className="home-block">
            <div className="container">
                <Heading>Bài viết nổi bật</Heading>
                <div className="grid-layout">
                    {post.map((item) => (
                        <PostFeatureItem key={item.id} data={item}></PostFeatureItem>
                    ))}
                </div>
            </div>
        </HomeFeatureStyles>
    );
};

export default HomeFeature;
