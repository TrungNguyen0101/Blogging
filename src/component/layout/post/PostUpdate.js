import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { identity } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { db } from "../../../firebase/fire-config";
import useFirebaseImage from "../../../hooks/useFirebaseImage";
import { postStatus } from "../../../utils/constants";
import { Button } from "../../button";
import { Radio } from "../../checkbox";
import { DropdownItem, DropdownNew } from "../../dropdown";
import { Field } from "../../field";
import ImageUpload from "../../image/ImageUpload";
import { Input } from "../../input";
import { Label } from "../../label";
import Toggle from "../../toggle/Toggle";
import DashboardHeading from "../dashboard/DashboardHeading";
import { toast } from "react-toastify";
import useClickOutSide from "../../../hooks/useClickOutSide";
import ImageUploader from 'quill-image-uploader';
import ReactQuill, { Quill } from 'react-quill';
import "react-quill/dist/quill.snow.css";
import axios from "axios";

Quill.register('modules/imageUploader', ImageUploader);
const PostUpdate = () => {
    const [select, setSelect] = useState("");
    const [content, setContent] = useState("")
    const { show, setShow, nodeRef } = useClickOutSide();
    const [category, setCategory] = useState();
    const [post, setPost] = useState([])
    const [loading, setLoading] = useState(false);
    const [params] = useSearchParams();
    const postID = params.get("id");
    const imageName = null;
    const { handleSubmit, control, watch, setValue, getValues, reset } = useForm();
    const {
        image,
        progress,
        setImage,
        setProgress,
        handleDeleteImage,
        handleSelectImage,
    } = useFirebaseImage(setValue, getValues, imageName, delPostImage);
    const watchStatus = watch("status");
    const watchHot = watch("hot");
    const imageUser = getValues("image");
    const idCategory = post.categoryID;
    const updatePost = async (values) => {
        // console.log("🚀 ~ file: PostUpdate.js ~ line 44 ~ updatePost ~ values", values)
        const colRef = doc(db, "posts", postID);
        await updateDoc(colRef, {
            ...values,
            image: image,
            content: content
        });
        toast.success("Update user successfully!");
    };
    async function delPostImage() {
        const colRef = doc(db, "posts", postID);
        await updateDoc(colRef, {
            image: "",
            image_name: "",
        })
    }
    useEffect(() => {
        async function fetchData() {
            if (!postID) return;
            const colRef = doc(db, "posts", postID);
            const result = await getDoc(colRef);
            setPost(result.data());
            reset(result.data());
            setContent(result.data()?.content || "");
            console.log("🚀 ~ file: PostUpdate.js ~ line 64 ~ fetchData ~ result", result.data())
            // console.log("🚀 ~ file: PostUpdate.js ~ line 26 ~ PostUpdate ~ post", post)

        }
        async function getListCategory() {
            const colRef = collection(db, "categories");
            const q = query(colRef, where("status", "==", 1));
            let result = [];
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                result.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setCategory(result);
        }
        getListCategory()
        fetchData();
    }, [postID, reset]);
    useEffect(() => {
        async function getCategoryByID() {
            const colRef = doc(db, "categories", await idCategory);
            const result = await getDoc(colRef);
            // console.log(result.data());
            setSelect(result.data().name);
        }
        getCategoryByID()
    }, [idCategory])
    useEffect(() => {
        setImage(imageUser)
    }, [imageUser, setImage]);
    const modules = useMemo(() => ({
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote'],
            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['link', 'image']
        ],
        imageUploader: {
            upload: async (file) => {
                const bodyFormData = new FormData();
                bodyFormData.append("image", file);
                const response = await axios({
                    method: "post",
                    url: 'https://api.imgbb.com/1/upload?key=37fa41bb177a1ab971f9a4886e466dda',
                    data: bodyFormData,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                return response.data.data.url;
            }
        }
    }), [])
    if (!postID) return null;
    return (
        <div>
            <DashboardHeading
                title="Update post"
                desc="Update content post"
            ></DashboardHeading>
            <form onSubmit={handleSubmit(updatePost)}>
                {/* Title and Slug */}
                <div className="grid grid-cols-2 gap-x-10 mb-10">
                    {/* title */}
                    <Field>
                        <Label>Title</Label>
                        <Input
                            control={control}
                            placeholder="Enter your title"
                            name="title"
                            required
                        ></Input>
                    </Field>
                    {/* Slug */}
                    <Field>
                        <Label>Slug</Label>
                        <Input
                            control={control}
                            placeholder="Enter your slug"
                            name="slug"
                        ></Input>
                    </Field>
                </div>
                {/* image and author */}
                <div className="grid grid-cols-2 gap-x-10 mb-10">
                    {/* Author */}
                    {/* <Field>
            <Label>Author</Label>
            <Input control={control} placeholder="Find the author"></Input>
          </Field> */}
                    {/* Category */}
                    <Field>
                        <Label>Category</Label>
                        <DropdownNew
                            select={select}
                            show={show}
                            setShow={setShow}
                            nodeRef={nodeRef}
                        >
                            {category?.length > 0 &&
                                category.map((item) => (
                                    <DropdownItem
                                        show={show}
                                        key={item.id}
                                        onClick={() => {
                                            setValue("categoryID", item.id);
                                            setSelect(item.name);
                                            setShow(false);
                                        }}
                                    >
                                        {item.name}
                                    </DropdownItem>
                                ))}
                        </DropdownNew>
                    </Field>
                    {/* Status */}
                    <Field>
                        <Label>Status</Label>
                        <div className="flex items-center gap-x-5">
                            <Radio
                                name="status"
                                control={control}
                                checked={Number(watchStatus) === postStatus.APPROVED}
                                value={postStatus.APPROVED}
                            >
                                Approved
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={Number(watchStatus) === postStatus.PENDING}
                                value={postStatus.PENDING}
                            >
                                Pending
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={Number(watchStatus) === postStatus.REJECTED}
                                value={postStatus.REJECTED}
                            >
                                Reject
                            </Radio>
                        </div>
                    </Field>
                </div>
                {/* category and status */}
                <div className="grid grid-cols-2 gap-x-10 mb-10">
                    {/* Image */}
                    <Field>
                        <Label>Image</Label>
                        <ImageUpload
                            image={image}
                            progress={progress}
                            name="image"
                            handleDeleteImage={handleDeleteImage}
                            onChange={handleSelectImage}
                        ></ImageUpload>
                    </Field>
                    <Field>
                        <Label>Feature post</Label>
                        <Toggle
                            on={watchHot === true}
                            onClick={() => {
                                setValue("hot", !watchHot);
                            }}
                        ></Toggle>
                    </Field>

                </div>
                {/* feature post */}
                <div className="mb-10">
                    <Field>
                        <Label>Content</Label>
                        <div className="w-full entry-content ">
                            <ReactQuill modules={modules} theme="snow" value={content} onChange={setContent} />
                        </div>
                    </Field>
                </div>

                {/*button */}
                <Button
                    type="submit"
                    className="mx-auto w-[200px]"
                    isLoading={loading}
                    disabled={loading}
                >
                    Update post
                </Button>
            </form>
        </div>
    );
};

export default PostUpdate;
