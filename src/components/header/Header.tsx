import React, {FC, useCallback, useState} from "react";
import styles from './Header.module.sass';
import classNames from "classnames";
import NotificationsModal from "./notificationsModal/NotificationsModal";
import {IoIosNotificationsOutline} from "react-icons/io";
import {Link, useNavigate} from "react-router-dom";
import { IoMenuOutline } from "react-icons/io5";
import BurgerMenu from "./burderMenu/BurgerMenu";
import {BsBoxes} from "react-icons/bs";
import Button from "../../designSystem/button/Button";
import {useSessionInfo} from "../../app/hooks/useSessionInfo";

const Header: FC = () => {
    const {isAuth} = useSessionInfo();
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openBurger, setOpenBurger] = useState<boolean>(false);

    const onChange = useCallback((value: any) => {
        console.log('searching', value)
    }, [])

    const onNotificationsClick = useCallback(() => {
        setOpenModal(!openModal)
    }, [openModal])

    const handleModal = useCallback((val: boolean) => {
        setOpenModal(val)
    },[])

    const handleBurger = useCallback(() => {
        setOpenBurger(!openBurger)
    },[openBurger])

    return (
        <header className={styles['header']}>
            <div className={styles['header-content']}>
                <Link to={'/'} className={styles['logo']}>
                    <BsBoxes size={22} className={styles['company-icon']} />
                </Link>
                <div
                    className={styles['burger-button']}
                    onClick={handleBurger}
                >
                    <IoMenuOutline size={24} />
                </div>
                <BurgerMenu open={openBurger} onClose={handleBurger} />
                <div className={styles['center-header-panel']}>
                    {/*<div className={styles['search']}>*/}
                    {/*    <IoSearchOutline size={16} />*/}
                    {/*    <Input*/}
                    {/*        placeholder="Поиск"*/}
                    {/*        bordered={false}*/}
                    {/*        onChange={onChange}*/}
                    {/*        style={{ width: 200 }}*/}
                    {/*    />*/}
                    {/*</div>*/}
                    <div className={styles['navigation']}>
                        {isAuth && <Link to={'/mySpace/dashboard'} className={styles['item']}>Мое пространство</Link>}
                        <Link to={'/use-cases'} className={styles['item']}>Возможности</Link>
                        <Link to={'/support'} className={styles['item']}>Поддержка</Link>
                        <Link to={'/contacts'} className={styles['item']}>Контакты</Link>
                    </div>
                </div>
                <div className={styles['right-header-panel']}>
                    {isAuth ? (
                        <>
                            <div
                                className={classNames(
                                    styles['notification-button'],
                                    openModal && styles['notification-button-active']
                                )}
                                onClick={onNotificationsClick}
                            >
                                <IoIosNotificationsOutline size={20} />
                            </div>
                            <NotificationsModal
                                setOpenModal={handleModal}
                                open={openModal}
                            />
                        </>
                    ) : (
                        <>
                            <Button
                                className={styles['sign-in-button']}
                                onClick={() => navigate('/auth/login')}
                            >
                                Войти
                            </Button>
                            <Button
                                className={styles['reg-button']}
                                onClick={() => navigate('/auth/register')}
                            >
                                Регистрация
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;