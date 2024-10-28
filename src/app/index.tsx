import React, {FC, useEffect} from "react";
import {AuthProvider} from "./Layers/AuthProvider";
import {ConfigProvider} from "antd";
import {HashRouter} from "react-router-dom";
import Header from "../components/header/Header";
import AppRoutes from "./routing/AppRoutes";
import {Session} from "../classes/session/Session";
import {Profile} from "../classes/profile/Profile";

enum Roles {
    User = "USER",
    Editor = "EDITOR",
    Admin = "ADMIN"
}

const App: FC = () => {

    useEffect(() => {
        Profile.instance.init();
        Session.instance.restore()
            .then(() => {
                console.log('== App: restore success ==')
            })
            .catch((err) => {
                console.log('== App: restore error ==', err)
            })
    }, [])

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: 'rgb(100, 78, 215)',
                },
            }}
        >
            <HashRouter>
                <Header />
                <AppRoutes />
            </HashRouter>
        </ConfigProvider>
    )
}

export default App;