import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { db } from '../../../../firebase/fire-config';
import Heading from '../../Heading';
import PostItem from '../PostItem';

const PostRelate = ({ categoryID = "" }) => {
    // console.log("🚀 ~ file: PostRelate.js ~ line 5 ~ PostRelate ~ categoryID", categoryID)
    const [post, setPost] = useState("")
    const userID = post.userId;
    // console.log("🚀 ~ file: PostRelate.js ~ line 10 ~ PostRelate ~ post", post)
    useEffect(() => {
        const docRef = query(collection(db, "posts"), where("categoryID", "==", categoryID));
        onSnapshot(docRef, snapshot => {
            const result = []
            snapshot.forEach(doc => {
                result.push({
                    id: doc.id,
                    ...doc.data()
                })
            })
            setPost(result)
            // console.log(result)
        })
    }, [categoryID])
    if (!categoryID || post.length < 0) return null;
    return (
        <div className="post-related">
            <Heading>Bài viết liên quan</Heading>
            <div className="grid-layout grid-layout--primary">
                {post.length > 0 && post.map(item => (
                    <PostItem post={item} key={item.id}></PostItem>
                ))}
            </div>
        </div>
    );
};

export default PostRelate;