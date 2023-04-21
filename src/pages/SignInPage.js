import React from "react";
import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { Label } from "../component/label";
import { Input, InputPasswordInput } from "../component/input";
import { Field } from "../component/field";
import { Button } from "../component/button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from 'react-toastify';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/fire-config";


const SignInPageStyled = styled.div`
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
const SignInPage = () => {
	//-------- Validation
	const schema = yup
		.object({
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
	const { userInfo } = useAuth();
	const navigate = useNavigate();

	//-------- react-hook-form
	const {
		handleSubmit,
		control,
		formState: { isSubmitting, errors, isValid }
	} = useForm({
		mode: "onChange",
		resolver: yupResolver(schema)
	});
	// console.log(
	//     "🚀 ~ file: SignInPage.js ~ line 6 ~ SignInPage ~ userInfo",
	//     userInfo
	// );
	// ///-------- có user --> đi đến trang chủ
	useEffect(() => {
		document.title = "Login Page"
		if (userInfo?.email) navigate("/");

	}, [navigate, userInfo?.email])

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
	//--------Submit form
	const handleSignIn = async (values) => {
		if (!isValid) return;
		await signInWithEmailAndPassword(auth, values.email, values.password);
		navigate("/");
	};
	return (
		<SignInPageStyled>
			<div className="container">
				<NavLink to="/">
					<img srcSet="./monkey.png 2x" alt="monkey-blogging" className="logo" />
				</NavLink>
				<h1 className="heading">Monkey Blogging</h1>
				<form
					onSubmit={handleSubmit(handleSignIn)}
					autoComplete="off"
					className="form"
				>
					<Field>
						<Label htmlFor="email">Email address</Label>
						<Input
							name="email"
							control={control}
							type="email"
							placeholder="Please enter your email address"
						></Input>
					</Field>
					<Field>
						<Label htmlFor="password">Password</Label>
						<InputPasswordInput control={control}></InputPasswordInput>
					</Field>
					<div className="have-account">You haven't an account ? <NavLink to="/sign-up">Register an account</NavLink> </div>
					<Button
						type="submit"
						disabled={isSubmitting}
						isLoading={isSubmitting}
						style={{
							width: 350,
						}}
					>
						Sign In
					</Button>
				</form>
			</div>
		</SignInPageStyled>
	);
};

export default SignInPage;
