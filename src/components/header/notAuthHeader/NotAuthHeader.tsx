import React, {memo, useCallback} from "react";
import styles from "./NotAuthHeader.module.sass";
import Button from "../../../designSystem/button/Button";
import {Link, useNavigate} from "react-router-dom";
import { BsBoxes } from "react-icons/bs";
import { IoAccessibilityOutline } from "react-icons/io5";
import {useSessionInfo} from "../../../app/hooks/useSessionInfo";

interface NotAuthHeaderProps {}

const NotAuthHeader = memo<NotAuthHeaderProps>(() => {
    const {isAuth} = useSessionInfo();
    const navigate = useNavigate();

    const handleSignIn = useCallback(() => {
        navigate('/auth/login')
    }, [])

    const handleRegister = useCallback(() => {
        navigate('/auth/register')
    }, [])

    return (
        <div className={styles['header-no-auth']}>
            <div className={styles['header-container']}>
                <div className={styles['header-body']}>
                    <div className={styles['content']}>
                        <Link to={'/'} className={styles['logo']}>
                            <BsBoxes size={22} className={styles['company-icon']} />
                        </Link>
                        <div className={styles['auth-container']}>
                            {isAuth ? (
                                <div className={styles['avatar']}>
                                    <IoAccessibilityOutline size={18} />
                                </div>
                            ) : (
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
                            )}
                        </div>
                    </div>
                    <div className={styles['navigation']}>
                        {isAuth && <Link to={'/mySpace/dashboard'} className={styles['item']}>Мое пространство</Link>}
                        <Link to={'/use-cases'} className={styles['item']}>Возможности</Link>
                        <Link to={'/support'} className={styles['item']}>Поддержка</Link>
                        <Link to={'/contacts'} className={styles['item']}>Контакты</Link>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default NotAuthHeader;