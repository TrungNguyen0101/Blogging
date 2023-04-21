import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Button } from "../../button";
import { Radio } from "../../checkbox";
import Field from "../../field/Field";
import Input from "../../input/Input";
import Label from "../../label/Label";
import slugify from "slugify";
import { postStatus } from "../../../utils/constants";
import ImageUpload from "../../image/ImageUpload";
import useFirebaseImage from "../../../hooks/useFirebaseImage";
import Toggle from "../../toggle/Toggle";
import { db } from "../../../firebase/fire-config";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,

  where,
} from "firebase/firestore";
import { serverTimestamp } from 'firebase/firestore'
import useClickOutSide from "../../../hooks/useClickOutSide";
import { DropdownItem, DropdownNew } from "../../dropdown";
import { useAuth } from "../../../contexts/auth-context";
import { toast } from "react-toastify";
const PostAddNewStyles = styled.div``;

const PostAddNew = () => {
  const [loading, setLoading] = useState(false);
  const { userInfo } = useAuth();
  // console.log(
  //   "🚀 ~ file: PostAddNew.js ~ line 24 ~ PostAddNew ~ userInfo",
  //   userInfo
  // );
  const { control, watch, setValue, getValues, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      slug: "",
      status: 2,
      categoryID: "",
      hot: false,
      category: {}
    },
  });
  const watchStatus = watch("status"); // xem sự thay đổi của trường status
  console.log("🚀 ~ file: PostAddNew.js ~ line 51 ~ PostAddNew ~ watchStatus", watchStatus)
  const watchHot = watch("hot");
  const { image, progress, setImage, setProgress, handleDeleteImage, handleSelectImage } =
    useFirebaseImage(setValue, getValues);
  const [category, setCategory] = useState();
  const addPost = async (values) => {
    try {
      setLoading(true);
      const cloneValues = { ...values };
      // convert chữ sang dạng không dấu
      cloneValues.slug = slugify(values.slug || values.title, { lower: true });
      cloneValues.status = Number(values.status);
      const colRef = collection(db, "posts");
      await addDoc(colRef, {
        ...cloneValues,
        image: image,
        userId: userInfo.uid,
        createAt: serverTimestamp()
      });
      toast.success("Create new post successfully!");
      console.log(cloneValues);
      setImage("");
      setProgress(0);
      reset({
        title: "",
        slug: "",
        status: 2,
        categoryID: "",
        hot: false,
        image: "",
        category: {}
      })
    } catch (error) {
      setLoading(false);
    } finally {
      setSelect("Select")
      setLoading(false);
    }
  };

  useEffect(() => {
    async function getData(data) {
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
    getData();
  }, []);
  /* set Title */
  useEffect(() => {
    document.title = "Add Post"
  })

  const handleClickOption = async (item) => {
    const colRef = doc(db, "categories", item.id);
    const result = await getDoc(colRef);
    // console.log(result.data());
    // setSelect(result.data().name);
    setValue("category", {
      id: result.id,
      ...result.data(),
    });
    setValue("categoryID", item.id);
    setSelect(item.name);
    setShow(false);
    console.log(getValues("category"))
  }


  const { show, setShow, nodeRef } = useClickOutSide();
  const [select, setSelect] = useState("");
  return (
    <PostAddNewStyles>
      <h1 className="dashboard-heading">Add new post</h1>
      <form onSubmit={handleSubmit(addPost)}>
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
                      handleClickOption(item)
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


        </div>
        {/* feature post */}
        <div className="grid grid-cols-2 gap-x-10 mb-10">
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
        {/*button */}
        <Button type="submit" className="mx-auto w-[200px]" isLoading={loading} disabled={loading}>
          Add new post
        </Button>
      </form>
    </PostAddNewStyles>
  );
};

export default PostAddNew;
