import {useEffect, useState} from "react";
import {Session} from "../../classes/session/Session";

interface IUseSessionInfo {
    isAuth: boolean;
    authInProgress: boolean;
}

export const useSessionInfo = (): IUseSessionInfo => {
    const [isAuth, setIsAuth] = useState<boolean>(Session.instance.loggedIn);
    const [authInProgress, setAuthInProgress] = useState<boolean>(true);

    useEffect(() => {
        const loginStateChangedHandle = Session.instance.loginStateChanged.subscribe(checkLogin);

        return () => {
            loginStateChangedHandle?.dispose();
        }
    }, [])

    const checkLogin = () => {
        setAuthInProgress(Session.instance.isLoading);
        setIsAuth(Session.instance.loggedIn);
    }

    return {isAuth, authInProgress}
}