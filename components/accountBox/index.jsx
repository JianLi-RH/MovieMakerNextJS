"use client";

import { React, useState, useEffect } from 'react';
import styled from 'styled-components';
import { LoginForm } from './loginForm';
import { LogoutForm } from './logoutForm';
import { SignupForm } from './signupForm';
import { motion } from 'framer-motion';
import { AccountContext } from './accountContext'

const BoxContainer = styled.div`
  width: 240px;
  min-height: 350px;
  display: flex;
  flex-direction: column;
  border-radius: 19px;
  background-color: #fff;
  box-shadow: 0 0 2px rgba(15, 15, 15, 0.28);
  position: relative;
  overflow: hidden;
  padding-left:10px;
`;

const TopContainer = styled.div`
  width: 100%;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 1.8em;
  padding-bottom: 5em;
`;

const BackDrop = styled(motion.div)`
  position: absolute;
  width: 160%;
  height: {active === "signout" && 300px || 550px};
  display: flex;
  flex-direction: column;
  border-radius: 50%;
  top: -290px;
  left: -70px;
  transform: rotate(60deg);
  background: linear-gradient(
    58deg, rgba(243,172,18,1) 20%, rgba(241,196,15,1) 100%
  );
`;

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const HeaderText = styled.div`
  font-size: 30px;
  font-weight: 600;
  line-height: 1;
  color: #fff;
  margin-bottom: 25px;
  z-index: 10;
`;

const SmallText = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: #fff;
  margin-top: 7px;
  z-index: 10;
`;

const InnerContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0px;
`;

const backdropVariants = {
    expanded: {
        width: "233%",
        height: "1050px",
        borderRadius: "20%",
        transform: "rotate(60deg)"
    },
    collapsed: {
        width: "160%",
        height: "600px",
        borderRadius: "50%",
        transform: "rotate(60deg)"
    }
}

const expandingTransition = {
    type: "spring",
    duration: 2.3,
    stiffness: 30,
}

export default function AccountBox({ initstatus, username, updateLogin, updateAlert }) {
    const [isExpanded, setExpanded] = useState(false);
    const [active, setActive] = useState('signin');

    useEffect(() => {
        if (initstatus) {
            setActive('signout')
        } else {
            setActive('signin')
        }
    }, [initstatus]);

    const playExpandingAnimation = () => {
        setExpanded(true);
        setTimeout(() => {
            setExpanded(false);
        }, expandingTransition.duration * 1000 - 1500);
    }

    const switchToSignup = () => {
        playExpandingAnimation();
        setTimeout(() => {
            setActive("signup");
        }, 400);
    }

    const switchToSignin = () => {
        playExpandingAnimation();
        setTimeout(() => {
            setActive("signin");
        }, 400);
    }

    const switchToSignout = () => {
        playExpandingAnimation();
        setTimeout(() => {
            setActive("signout");
        }, 400);
    }

    const contextValue = { switchToSignup, switchToSignin, switchToSignout };

    return (
        <AccountContext.Provider value={contextValue}>
            <BoxContainer>
                <TopContainer>
                    <BackDrop
                        initial={false}
                        animate={isExpanded ? "expanded" : "collapsed"}
                        variants={backdropVariants}
                        transition={expandingTransition}
                    />
                    {active === "signin" && <HeaderContainer>
                        <HeaderText>欢迎</HeaderText>
                        <HeaderText>回来</HeaderText>
                    </HeaderContainer>}
                    {active === "signout" && <HeaderContainer>
                        <HeaderText>欢迎</HeaderText>
                        <HeaderText>{username}</HeaderText>
                    </HeaderContainer>}
                    {active === "signup" && <HeaderContainer>
                        <HeaderText>创建账号</HeaderText>
                        <SmallText>创建账号,</SmallText>
                        <SmallText>以便继续使用MovieMaker!</SmallText>
                    </HeaderContainer>}
                </TopContainer>
                <InnerContainer>
                    {active === "signin" && <LoginForm updateLogin={(status, username) => {
                        updateLogin(status, username)
                    }} updateAlert={updateAlert} />}
                    {active === "signout" && <LogoutForm updateLogin={(status, username) => {
                        updateLogin(status, username)
                    }} updateAlert={updateAlert} />}
                    {active === "signup" && <SignupForm updateAlert={updateAlert} />}
                </InnerContainer>
            </BoxContainer>
        </AccountContext.Provider>
    );
}