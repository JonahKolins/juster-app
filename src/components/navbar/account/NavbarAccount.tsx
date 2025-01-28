import React, {memo, useCallback, useState} from "react";
import styles from "./NavbarAccount.module.sass";
import { IoSettingsOutline } from "react-icons/io5";
import { BsChevronDown } from "react-icons/bs";
import {Link, useLocation, useNavigate} from "react-router-dom";
import classNames from "classnames";
import {Dropdown, MenuProps} from "antd";
import { IoLogOutOutline } from "react-icons/io5";
import { IoAccessibilityOutline } from "react-icons/io5";
import { BsBoxes } from "react-icons/bs";
import Button from "../../../designSystem/button/Button";
import {useProfile} from "../../../app/hooks/useProfile";
import {stringUtils} from "../../../core/utils";
import NBSP = stringUtils.NBSP;
import {Session} from "../../../classes/session/Session";

enum AccountMenuItems {
    account= 'account',
    logout = 'logout'
}

interface NavbarAccountProps {
    onClick: () => void;
}

const NavbarAccount = memo<NavbarAccountProps>(({onClick: propsOnClick}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const {clientInfo, isProfileLoading} = useProfile();
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    const items: MenuProps['items'] = [
        {
            icon: <IoAccessibilityOutline size={16} />,
            label: 'Аккаунт',
            key: AccountMenuItems.account,
        },
        {
            icon: <BsBoxes size={16} />,
            label: 'Что-то улетное',
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            icon: <IoLogOutOutline size={16} />,
            label: 'Выйти',
            key: AccountMenuItems.logout,
        },
    ];

    const handleClick: MenuProps['onClick'] = ({ key }) => {
        switch (key) {
            case AccountMenuItems.logout: {
                // --> logout
                Session.instance.logout();
                navigate('/');
                propsOnClick();
                return;
            }
            case AccountMenuItems.account: {
                navigate('/account');
                propsOnClick();
                return;
            }
        }
    };

    const handleOpenChange = useCallback((value: boolean) => {
        setIsDropdownOpen(value)
    }, [])

    const handleSignIn = useCallback(() => {
        navigate('/auth/login');
        propsOnClick();
    }, [navigate, propsOnClick])

    const handleRegister = useCallback(() => {
        navigate('/auth/register');
        propsOnClick();
    }, [navigate, propsOnClick])

    return (
        <div className={styles['navbar-account']}>
            {isProfileLoading
                ? <div>skeleton ... </div>
                : clientInfo
                    ? (
                        <>
                            <Dropdown onOpenChange={handleOpenChange} menu={{ items, onClick: handleClick }} trigger={['click']}>
                                <div className={classNames(styles['account-name'], isDropdownOpen && styles['_active'])}>
                                    {clientInfo.firstName || clientInfo.lastName
                                        ? <div>{clientInfo.firstName}{NBSP}{clientInfo.lastName ? clientInfo.lastName : ''}</div>
                                        : <div>{clientInfo.email}</div>
                                    }
                                    <BsChevronDown size={10} />
                                </div>
                            </Dropdown>
                            <Link
                                to={'/account/settings'}
                                className={classNames(
                                    styles['account-settings'],
                                    location.pathname === '/account/settings' && styles['_active']
                                )}
                                onClick={propsOnClick}
                            >
                                <IoSettingsOutline size={16} />
                            </Link>
                        </>
                    )
                    : (
                        <>
                            <Button
                                className={styles['sign-in-button']}
                                onClick={handleSignIn}
                            >
                                Войти
                            </Button>
                            <Button
                                className={styles['reg-button']}
                                onClick={handleRegister}
                            >
                                Регистрация
                            </Button>
                        </>
                    )
            }
        </div>
    )
})

export default NavbarAccount