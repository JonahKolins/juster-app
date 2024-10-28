import React, {FC, useEffect, useState} from "react";
import styles from './Navbar.module.sass';
import {useLocation} from "react-router-dom";
import Tab from "./tab/Tab";
import NavbarAccount from "./account/NavbarAccount";
import { RxDashboard } from "react-icons/rx";
import { BsBoxes } from "react-icons/bs";
import { IoDocumentOutline } from "react-icons/io5";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io"

enum Pathname {
    Home = "/mySpace/dashboard",
    Category = '/mySpace/category',
    MyRequests = '/mySpace/myRequests',
    NewRequest = '/mySpace/newRequest',
    Notifications = '/mySpace/notifications'
}

const Navbar: FC = () => {
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState<Pathname>(Pathname.Home)

    useEffect(() => {
        setCurrentPage(location.pathname as Pathname)
    }, [location])

    return (
        <aside className={styles['navbar']}>
            <NavbarAccount onClick={() => {}} />
            <div className={styles['tabs-container']}>
                <Tab
                    path='/mySpace/dashboard'
                    name='Главная'
                    icon={<RxDashboard size={16} />}
                    isActive={currentPage === Pathname.Home}
                />
                <Tab
                    path='/mySpace/category'
                    name='Категории'
                    icon={<BsBoxes size={16} />}
                    isActive={currentPage === Pathname.Category}
                />
                <Tab
                    path='/mySpace/myRequests'
                    name='Мои&nbsp;обращения'
                    icon={<IoDocumentOutline size={16} />}
                    isActive={currentPage === Pathname.MyRequests}
                />
                <Tab
                    path='/mySpace/newRequest'
                    name='Новое&nbsp;обращение'
                    icon={<HiOutlineDocumentPlus size={16} />}
                    isActive={currentPage === Pathname.NewRequest}
                />
                <Tab
                    path={'/mySpace/notifications'}
                    name={'Уведомления'}
                    icon={<IoIosNotificationsOutline size={19} />}
                    isActive={currentPage === Pathname.Notifications}
                />
            </div>
        </aside>
    );
}

export default Navbar;