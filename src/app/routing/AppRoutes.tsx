import React, {FC, useEffect, useState} from "react";
import {Route, Routes} from "react-router-dom";
import {useLocation} from "react-router";
import DashboardPage from "../../pages/mySpacePages/dashboardPage/DashboardPage";
import MyRequests from "../../pages/mySpacePages/myClaimsPage/MyClaimsPage";
import NewRequests from "../../newRequest/NewRequest";
import Notifications from "../../pages/notificationsPage/Notifications";
import Categories from "../../pages/mySpacePages/categoriesPage/Categories";
import RequestItem from "../../requestItem/RequestItem";
import HomePage from "../../pages/homePage/HomePage";
import UseCasesPage from "../../pages/useCasesPage/UseCasesPage";
import CategoriesPage from "../../pages/categoriesPage/CategoriesPage";
import ContactsPage from "../../pages/contactsPage/ContactsPage";
import SupportPage from "../../pages/supportPage/SupportPage";
import MySpacePage from "../../pages/mySpacePages/mySpacePage/MySpacePage";
import MySpaceNewRequestPage from "../../pages/mySpacePages/newRequestPage/MySpaceNewRequestPage";
import AccountPage from "../../pages/mySpacePages/accountPage/AccountPage";
import SettingsAccountPage from "../../pages/accountPages/settings/SettingsAccountPage";
import Registration from "../../pages/registrationPage/Registration";
import Login from "../../pages/loginPages/Login";
import Missing from "./Missing";
import ProtectedRoute, {ProtectedRouteProps} from "./ProtectedRoute";
import ResetPasswordPage from "../../pages/resetPasswordPage/ResetPasswordPage";
import NewMyClaimsPage from "pages/mySpacePages/myClaimsPage/NewMyClaimsPage";

const AppRoutes: FC = () => {
    const currentLocation = useLocation();
    // TODO save in context https://github.com/openscript/react-router-private-protected-routes/blob/react-router-6/src/contexts/SessionContext.tsx
    const [lastPathToRedirect, setLastPathToRedirect] = useState('');

    useEffect(() => {
        if (!lastPathToRedirect) setLastPathToRedirect('/mySpace/dashboard')
    }, [lastPathToRedirect])

    const setRedirectPath = (path: string) => {
        setLastPathToRedirect(path);
        // updateSessionContext({...sessionContext, redirectPath: path});
    }

    const defaultProtectedRouteProps: Omit<ProtectedRouteProps, 'outlet'> = {
        authenticationPath: '/auth/login',
        redirectPath: currentLocation.pathname,
        setRedirectPath: setRedirectPath
    };

    return (
        <Routes>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/use-cases' element={<UseCasesPage />} />
            <Route path='/categories' element={<CategoriesPage />} />
            <Route path='/support' element={<SupportPage />} />
            <Route path='/contacts' element={<ContactsPage />} />
            <Route path='/mySpace' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<MySpacePage/>} />} />
            <Route path='/mySpace/dashboard' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<DashboardPage/>} />} />
            <Route path='/mySpace/category' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Categories/>} />} />
            <Route path='/mySpace/myRequests' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<NewMyClaimsPage/>} />} />
            <Route path='/mySpace/myRequests/:id' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<RequestItem/>} />} />
            <Route path='/mySpace/newRequest' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<MySpaceNewRequestPage/>} />} />
            <Route path='/mySpace/notifications' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Notifications/>} />} />
            <Route path='/newRequest' element={<NewRequests/>} />
            <Route path='/account' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<AccountPage/>} />} />
            <Route path='/account/settings' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<SettingsAccountPage/>} />} />
            {/* логин и рега */}
            <Route path="/auth/login" element={<Login/>} />
            <Route path="/auth/reset" element={<ResetPasswordPage/>} />
            <Route path="/auth/register" element={<Registration />}/>
            <Route path="*" element={<Missing/>}/>
        </Routes>
    )
}

export default AppRoutes;