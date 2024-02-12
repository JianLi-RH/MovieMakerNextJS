import React, { useContext } from "react";
import { useFormik } from "formik";

import {
    BoldLink,
    BoxContainer,
    FormContainer,
    Input,
    LineText,
    SubmitButton,
} from "./common";
import { AccountContext } from './accountContext';
import { Marginer } from "../marginer";

export function SignupForm({ updateAlert }) {
    const { switchToSignin } = useContext(AccountContext);
    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
            confirmPassword: "",
        },
        onSubmit: async (values) => {
            if (values.password != values.confirmPassword) {
                updateAlert(
                    {
                        display: "flex",
                        severity: "error",
                        message: "密码不一致",
                    }
                )
                return;
            }
            const body = new FormData();
            body.append("username", values.username);
            body.append("password", values.password);
            const response = await fetch("/api/auth/register", {
                method: "POST",
                body,
            });
            const res = await response.json();
            if (res.code === 200) {
                switchToSignin()
            } else {
                updateAlert(
                    {
                        display: "flex",
                        severity: "error",
                        message: res.msg,
                    }
                )
            }
        },
    });

    return (
        <BoxContainer>
            <FormContainer onSubmit={formik.handleSubmit}>
                <Input id="username" type="text" placeholder="用户名" onChange={formik.handleChange}
                    value={formik.values.username} />
                <Input id="password" type="password" placeholder="密码" onChange={formik.handleChange}
                    value={formik.values.password} />
                <Input id="confirmPassword" type="password" placeholder="确认密码" onChange={formik.handleChange}
                    value={formik.values.confirmPassword} />

                <Marginer direction="vertical" margin="0px" />
                <SubmitButton type="submit">注册</SubmitButton>
            </FormContainer>
            <Marginer direction="vertical" margin="0px" />
            <LineText>
                已经注册过MovieMaker?{" "}
                <BoldLink onClick={switchToSignin} href="#">
                    请登录
                </BoldLink>
            </LineText>
        </BoxContainer>
    );
}