import React, {memo, useCallback} from "react";
import styles from "./NoAuthorized.module.sass";
import {useNavigate} from "react-router-dom";
import {RiStackFill} from "react-icons/ri";
import Button from "../../designSystem/button/Button";
import classNames from "classnames";

interface NoAuthorizedProps {
    className?: string;
}

const NoAuthorized = memo<NoAuthorizedProps>(({className}) => {
    const navigate = useNavigate();

    const onLoginClick = useCallback(() => {
        navigate('/auth/login')
    }, [navigate])

    return (
        <div className={classNames(styles.no_auth_container, className)}>
            <RiStackFill className={styles.icon} size={60} />
            <div className={styles.caption}>Войдите в личный кабинет</div>
            <div className={styles.title}>чтобы увидеть ваши обращения</div>
            <div className={styles.buttons_container}>
                <Button
                    className={styles.login_button}
                    onClick={onLoginClick}
                >
                    Войти
                </Button>
            </div>
        </div>
    )
})

export default NoAuthorized;
