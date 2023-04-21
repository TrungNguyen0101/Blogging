import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, serverTimestamp, setDoc } from "firebase/firestore";
import React from "react";
import { useForm } from "react-hook-form";
import { auth, db } from "../../../firebase/fire-config";
import useFirebaseImage from "../../../hooks/useFirebaseImage";
import { userRole, userStatus } from "../../../utils/constants";
import { toast } from 'react-toastify';
import { Button } from "../../button";
import { Radio } from "../../checkbox";
import { Field, FieldCheckboxes } from "../../field";
import ImageUpload from "../../image/ImageUpload";
import { Input } from "../../input";
import { Label } from "../../label";
import DashboardHeading from "../dashboard/DashboardHeading";

const UserAddNew = () => {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      avatar: "",
      status: 1,
      role: 1,
      createAt: new Date(),
    }
  });
  const {
    image,
    progress,
    setImage,
    setProgress,
    handleDeleteImage,
    handleSelectImage,
  } = useFirebaseImage(setValue, getValues);
  const handleCreateUser = async (values) => {
    if (!isValid) return;
    await createUserWithEmailAndPassword(auth, values.email, values.password)
    await addDoc(collection(db, "users"), {
      fullname: values.fullname,
      email: values.email,
      password: values.password,
      avatar: image,
      status: Number(values.status),
      role: Number(values.role),
      createAt: serverTimestamp(),
    })
    toast.success("Create user successfully !!!");
    reset({
      fullname: "",
      email: "",
      password: "",
      avatar: "",
      status: 1,
      role: 1,
      createAt: new Date(),
    })
    setImage("");
    setProgress(0);
  };
  const watchStatus = watch("status");
  const watchRole = watch("role");
  console.log(
    "🚀 ~ file: UserAddNew.js ~ line 19 ~ UserAddNew ~ watchStatus",
    watchStatus
  );
  return (
    <div>
      <DashboardHeading
        title="New user"
        desc="Add new user to system"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleCreateUser)} autoComplete="off">
        <div className="w-[200px] h-[200px] mx-auto mb-[10px]">
          <ImageUpload
            className="!rounded-full h-full"
            image={image}
            progress={progress}
            name="image"
            handleDeleteImage={handleDeleteImage}
            onChange={handleSelectImage}
          ></ImageUpload>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Fullname</Label>
            <Input
              name="fullname"
              placeholder="Enter your fullname"
              control={control}
            ></Input>
          </Field>
          <Field>
            <Label>Email</Label>
            <Input
              name="email"
              placeholder="Enter your email"
              control={control}
              type="email"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Password</Label>
            <Input
              name="password"
              placeholder="Enter your password"
              control={control}
              type="password"
            ></Input>
          </Field>
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === 1}
                value={1}
              >
                Active
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === 2}
                value={2}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === 3}
                value={3}
              >
                Banned
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Role</Label>
            <FieldCheckboxes>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === 1}
                value={1}
              >
                Admin
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === 2}
                value={2}
              >
                Moderator
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === 3}
                value={3}
              >
                User
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>
        <Button
          type="submit"
          className="mx-auto w-[200px]"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Add new user
        </Button>
      </form>
    </div>
  );
};

export default UserAddNew;
