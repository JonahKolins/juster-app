import React, {FC, useEffect, useState} from "react";
import styles from './Navbar.module.sass';
import {useLocation} from "react-router-dom";
import Tab from "./tab/Tab";
import NavbarAccount from "./account/NavbarAccount";
import { RxDashboard } from "react-icons/rx";
import { BsBoxes } from "react-icons/bs";
import { IoDocumentOutline, IoAnalyticsOutline } from "react-icons/io5";
import { HiOutlineDocumentPlus, HiOutlineInbox } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io"
import { AccessControl } from "classes/role/AccessControl";
import { IMenuLink, MySpaceMenuPathname } from "classes/role/menuLinks";

const Navbar: FC = () => {
    const menuLinks = AccessControl.instance.menuLinks;
    //
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState<MySpaceMenuPathname>(MySpaceMenuPathname.Home);

    useEffect(() => {
        // если загрузились на странице 
        if (currentPage !== location.pathname) {
            setCurrentPage(location.pathname as MySpaceMenuPathname)
        }
    }, [location])

    const handleTabClick = (path: MySpaceMenuPathname) => {
        setCurrentPage(path);
    }

    const getMenuItemIcon = (path: MySpaceMenuPathname): React.JSX.Element => {
        switch (path) {
            case MySpaceMenuPathname.Home: return <RxDashboard size={16} />;
            case MySpaceMenuPathname.Category: return <BsBoxes size={16} />;
            case MySpaceMenuPathname.AllClaims: return <BsBoxes size={16} />;
            case MySpaceMenuPathname.MyClaims: return <IoDocumentOutline size={16} />;
            case MySpaceMenuPathname.NewClaim: return <HiOutlineDocumentPlus size={16} />;
            case MySpaceMenuPathname.Notifications: return <IoIosNotificationsOutline size={19} />;
            case MySpaceMenuPathname.Inbox: return <HiOutlineInbox size={16} />;
            case MySpaceMenuPathname.Analytics: return <IoAnalyticsOutline size={16} />;
            default: return <BsBoxes size={16} />;
        }
    }

    if (!menuLinks?.length) return null;

    return (
        <aside className={styles['navbar']}>
            <NavbarAccount onClick={() => {}} />
            <div className={styles['tabs-container']}>
                {menuLinks.map((menuItem: IMenuLink ) => (
                    <Tab
                        path={menuItem.pathName}
                        name={menuItem.caption}
                        disabled={false}
                        icon={getMenuItemIcon(menuItem.pathName)}
                        isActive={currentPage === menuItem.pathName}
                        onClick={() => handleTabClick(menuItem.pathName)}
                    />
                ))}
            </div>
        </aside>
    );
}

export default Navbar;