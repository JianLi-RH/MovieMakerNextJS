import React, { useContext } from "react";
import {
    SubmitButton,
} from "./common";
import { AccountContext } from './accountContext';

export function LogoutForm({ updateLogin, updateAlert }) {
    const { switchToSignin } = useContext(AccountContext);

    // 登出
    const logout = async () => {
        if (sessionStorage.token) {
            const response = await fetch("/api/auth/logout", {
                headers: { Authorization: sessionStorage.token },
            })
            const res = await response.json();
            if (res.code === 200) {
                sessionStorage.removeItem("token");
                updateAlert({
                    display: "flex",
                    severity: "success",
                    message: res.msg,
                });
                updateLogin(false);
                switchToSignin();
            } else {
                updateAlert({
                    display: "flex",
                    severity: "error",
                    message: res.msg,
                });
            }
        }
    };

    return (
        <SubmitButton onClick={logout}>退出</SubmitButton>
    );
}