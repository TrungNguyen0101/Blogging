import { signOut } from 'firebase/auth';
import React from 'react';
import { auth } from '../firebase/fire-config';
import styled from "styled-components"
import Header from '../component/layout/Header';
import HomeBanner from '../component/layout/home/HomeBanner';
import HomeFeature from '../component/layout/home/HomeFeature';
import HomeNewest from '../component/layout/home/HomeNewest ';
import { Checkbox, Radio } from '../component/checkbox';
import { useForm } from 'react-hook-form';

const HomePageStyled = styled.div`

`
const HomePage = () => {
    const handleSignOut = () => {
        signOut(auth);
    }
    const { control } = useForm();
    return (
        <HomePageStyled>
            {/* <button onClick={handleSignOut}>Sign Out</button> */}
            <Header></Header>
            <HomeBanner></HomeBanner>
            <HomeFeature></HomeFeature>
            {/* <HomeNewest></HomeNewest> */}
        </HomePageStyled>
    );
};

export default HomePage;