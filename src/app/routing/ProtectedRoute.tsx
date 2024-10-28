import React, {useEffect} from 'react';
import { Navigate, useLocation } from 'react-router';
import Navbar from "../../components/navbar/Navbar";
import ContentBody from "../../components/contentBody/ContentBody";
import {LoaderCircle} from "../../designSystem/loader/Loader.Circle";
import {useSessionInfo} from "../hooks/useSessionInfo";

export type ProtectedRouteProps = {
    authenticationPath: string;
    redirectPath: string;
    setRedirectPath: (path: string) => void;
    outlet: React.JSX.Element;
};

export default function ProtectedRoute({authenticationPath, redirectPath, setRedirectPath, outlet}: ProtectedRouteProps) {
    const currentLocation = useLocation();
    const {isAuth, authInProgress} = useSessionInfo();

    useEffect(() => {
        if (!isAuth) {
            setRedirectPath(currentLocation.pathname);
        }
    }, [isAuth, setRedirectPath, currentLocation]);

    if (authInProgress && !isAuth) {
        console.log('ProtectedRoute -> AUTH IN PROGRESS')
        return (
            <ContentBody>
                <LoaderCircle />
            </ContentBody>
        )
    }

    if (isAuth && redirectPath === currentLocation.pathname) {
        return (
            <ContentBody>
                <Navbar/>
                {outlet}
            </ContentBody>
        );
    } else {
        return <Navigate to={{ pathname: isAuth ? redirectPath : authenticationPath }} />;
    }
};