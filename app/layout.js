"use client";

import * as React from "react";
import { useState } from "react";

import Alert from "@mui/material/Alert";
import Header from "@/components/header";
import Menu from "@/components/menu";

export default function RootLayout({
  scripts,
  onSelectScript,
  updateMenuList,
  showSettingDialog,
  children,
}) {
  const [alert, setAlert] = useState({
    display: "none",
    severity: "info",
    message: "",
  });
  const updateAlert = (alert) => {
    setAlert(alert);

    setTimeout(() => {
      setAlert({ display: "none", severity: "info", message: "" });
    }, 1000);
  };
  return (
    <html lang="en">
      <body>
        <Header>
          <Alert style={{ display: alert.display }} severity={alert.severity}>
            {alert.message}
          </Alert>
        </Header>
        <Menu
          scripts={scripts}
          onSelectScript={(scriptName) => onSelectScript(scriptName)}
          updateMenuList={() => updateMenuList()}
          showSettingDialog={() => showSettingDialog()}
          updateAlert={(alert) => updateAlert(alert)}
        ></Menu>

        {children}
      </body>
    </html>
  );
}
