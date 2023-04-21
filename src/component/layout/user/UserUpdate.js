import { async } from "@firebase/util";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { db } from "../../../firebase/fire-config";
import { Button } from "../../button";
import { Radio } from "../../checkbox";
import { Field, FieldCheckboxes } from "../../field";
import ImageUpload from "../../image/ImageUpload";
import { Input } from "../../input";
import { Label } from "../../label";
import { toast } from "react-toastify";
import DashboardHeading from "../dashboard/DashboardHeading";
import useFirebaseImage from "../../../hooks/useFirebaseImage";
import TextArea from "../../textarea/TextArea";

const UserUpdate = () => {
    const {
        control,
        handleSubmit,
        watch,
        reset,
        setValue,
        getValues,
        formState: { isValid, isSubmitting },
    } = useForm({
        mode: "onChange",
    });
    const watchStatus = watch("status");
    const watchRole = watch("role");
    const imageUpdate = getValues("avatar");
    const imageName = /%2F(\S+)\?/gm.exec(imageUpdate)
        ? /%2F(\S+)\?/gm.exec(imageUpdate)[1]
        : null;
    const {
        image,
        progress,
        setImage,
        setProgress,
        handleDeleteImage,
        handleSelectImage,
    } = useFirebaseImage(setValue, getValues, imageName, delAvatar);

    const [params] = useSearchParams();
    const userID = params.get("id");
    useEffect(() => {
        async function fetchData() {
            const colRef = doc(db, "users", userID);
            const result = await getDoc(colRef);
            reset(result.data());
            // console.log(result.data())
        }
        fetchData();
    }, [reset, userID]);
    const handleUpdate = async (values) => {
        console.log(values);
        const colRef = doc(db, "users", userID);
        await updateDoc(colRef, {
            ...values,
            avatar: image,
        });
        toast.success("Update user successfully!");
    };
    async function delAvatar() {
        const colRef = doc(db, "users", userID);
        await updateDoc(colRef, {
            avatar: "",
        });
    }
    useEffect(() => {
        setImage(imageUpdate);
    }, [imageUpdate, setImage]);

    if (!userID) return null;
    return (
        <div>
            <DashboardHeading
                title="Update user"
                desc="Update new user to system"
            ></DashboardHeading>
            <form onSubmit={handleSubmit(handleUpdate)} autoComplete="off">
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
                <div className="form-layout">
                    <Field>
                        <Label>Description</Label>
                        <TextArea name="desc" control={control}></TextArea>
                    </Field>
                </div>
                <Button
                    type="submit"
                    className="mx-auto w-[200px]"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                >
                    Update user
                </Button>
            </form>
        </div>
    );
};

export default UserUpdate;
