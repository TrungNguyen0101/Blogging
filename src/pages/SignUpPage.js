import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Input, InputPasswordInput } from "../component/input";
import { Label } from "../component/label";
import { useForm } from "react-hook-form";
import { Field } from "../component/field";
import { Button } from "../component/button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth, db } from "../firebase/fire-config";
import { NavLink, useNavigate } from "react-router-dom";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { userRole, userStatus } from "../utils/constants";
const SignUpPageStyled = styled.div`
  min-height: 100vh;
  padding-bottom: 4rem;
  .logo {
    margin: 20px auto;
  }
  .heading {
    text-align: center;
    color: ${(props) => props.theme.primaryColor};
    font-weight: bold;
  }
  .form {
    max-width: 600px;
    margin: 0 auto;
  }
  .have-account{
    margin-bottom: 20px;
    a{
      display: inline-block;
      color: ${props => props.theme.primaryColor};
      font-weight: 500;
    }
  }
`;
const SignUpPage = () => {
  const navigate = useNavigate()
  //-------- Validation
  const schema = yup
    .object({
      fullname: yup.string().required("Please enter your fullname"),
      email: yup
        .string()
        .email("Please enter valid email address")
        .required("Please enter your email address"),
      password: yup
        .string()
        .min(8, "Your password must be at least 8 characters")
        .required("Please enter your password"),
    })
    .required();
  //-------- react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watch,
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  //--------Submit form
  const handleSignUp = async (values) => {
    if (!isValid) return;
    console.log(values);
    // * create user
    const user = await createUserWithEmailAndPassword(auth, values.email, values.password);
    await updateProfile(auth.currentUser, {
      displayName: values.fullname
    })
    console.log(auth)
    // * add vao firebase (set ID user = uid của gmail)
    const colRef = collection(db, "users")
    await setDoc(doc(db, "users", auth.currentUser.uid), {
      fullname: values.fullname,
      email: values.email,
      password: values.password,
      avatar: "",
      status: userStatus.ACTIVE,
      role: userRole.USER,
      createAt: serverTimestamp(),
    })
    // await addDoc(colRef, {
    //   fullname: values.fullname,
    //   email: values.email,
    //   password: values.password
    // })
    // * show notify
    toast.success("Create user successfully !!!");
    navigate("/")
    // xet tg isSubmitting
    // return new Promise((resolve) => {
    //   if (!isValid) return;
    //   setTimeout(() => {
    //     resolve();
    //   }, 2000);
    // });
  };
  // console.log(Object.values(errors));
  ///-------- React-toastify : show notify`
  useEffect(() => {
    const arrErrors = Object.values(errors);
    if (arrErrors.length > 0) {
      toast.error(arrErrors[0]?.message, {
        pauseOnHover: false,
        delay: 0,
      })
    }
  }, [errors]);
  useEffect(() => {
    document.title = "Register Page"
  }, [])
  return (
    <SignUpPageStyled>
      <div className="container">
        <NavLink to="/">
          <img srcSet="./monkey.png 2x" alt="monkey-blogging" className="logo" />
        </NavLink>
        <h1 className="heading">Monkey Blogging</h1>
        <form
          onSubmit={handleSubmit(handleSignUp)}
          autoComplete="off"
          className="form"
        >
          {/* fullname */}
          <Field className="field">
            <Label htmlFor="fullname" className="label">
              Fullname
            </Label>
            <Input
              type="text"
              name="fullname"
              control={control}
              placeholder="Enter your fullname"
            ></Input>
          </Field>
          {/* email */}
          <Field className="field">
            <Label htmlFor="email" className="label">
              Email address
            </Label>
            <Input
              type="email"
              name="email"
              control={control}
              placeholder="Enter your Email address"
            ></Input>
          </Field>
          {/* password */}
          <Field className="field">
            <Label htmlFor="password" className="label">
              Password
            </Label>
            <InputPasswordInput control={control}></InputPasswordInput>
          </Field>
          <div className="have-account">You have already an account ? <NavLink to="/sign-in">Login</NavLink> </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            style={{
              width: 350,
            }}
          >
            Sign Up
          </Button>
        </form>
      </div>
    </SignUpPageStyled>
  );
};

export default SignUpPage;
