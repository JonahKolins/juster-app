import React, {memo, useState} from "react";
import styles from "./NewRequestUserDataPart.module.sass";
import Button from "../../../../designSystem/button/Button";
import {Input, InputSize} from "../../../../designSystem/input";
import {LoaderCircle} from "../../../../designSystem/loader/Loader.Circle";
import {Checkbox, Segmented} from "antd";
import {CheckboxChangeEvent} from "antd/es/checkbox";
import NewRequestRegistrationForm from "../../components/newRequestRegistrationForm/NewRequestRegistrationForm";
import {Session} from "../../../../classes/session/Session";
import {useSessionInfo} from "../../../../app/hooks/useSessionInfo";
import {useProfile} from "../../../../app/hooks/useProfile";
import {stringUtils} from "../../../../core/utils";
import NBSP = stringUtils.NBSP;

interface NewRequestUserDataPartProps {
    onPrevPageClick: () => void;
    onNextPageClick: () => void;
}

type TPageId = 'login' | 'registration';

const pages = [
    {label: 'Логин', value: 'login'},
    {label: 'Регистрация', value: 'registration'},
]

const NewRequestUserDataPart = memo<NewRequestUserDataPartProps>(({onPrevPageClick, onNextPageClick}) => {
    const [currentPageId, setCurrentPageId] = useState<TPageId>('login');
    const {isAuth} = useSessionInfo();
    const {clientInfo} = useProfile();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [hasAgreement, setHasAgreement] = useState<boolean>(false);

    const handleEmailChange = (value: string, event?: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(value);
    }

    const handlePasswordChange = (value: string) => {
        setPassword(value);
    }

    const handleEmailClear = () => {
        setEmail('');
        setError('');
    }

    const handlePasswordClear = () => {
        setPassword('');
        setError('');
    }

    const handleLoginClick = () => {
        if (!email || !password) {
            setError('Введите email и пароль');
            return;
        }

        Session.instance.login(email, password)
            .then(() => {
                setError(null);
            })
            .catch((error) => {
                setError('Не верный email или пароль');
                console.log('error', error)
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    const handlePageChange = (value: any) => {
        setCurrentPageId(value);
    }

    const handleCheckbox = (e: CheckboxChangeEvent) => {
        setHasAgreement(e.target.checked);
    }

    const renderLoginForm = () => {
        return (
            <>
                <Input
                    type='email'
                    value={email}
                    placeholder={'Email'}
                    className={styles['login-item']}
                    tabIndex={0}
                    onChange={handleEmailChange}
                    error={null}
                    size={InputSize.Medium}
                    name={'client_email'}
                    onClear={handleEmailClear}
                />
                <Input
                    type='password'
                    value={password}
                    placeholder={'Пароль'}
                    className={styles['login-item']}
                    tabIndex={0}
                    onChange={handlePasswordChange}
                    error={null}
                    size={InputSize.Medium}
                    name={'client_password'}
                    onClear={handlePasswordClear}
                />
                <div className={styles['error']}>{error ? error : ''}</div>
                <Button disabled={email.length < 4 || password.length < 4} onClick={handleLoginClick}>Войти</Button>
            </>
        )
    }

    const handleSuccessRegister = () => {

    }

    const renderContentByCurrentId = () => {
        switch (currentPageId) {
            case "login": return renderLoginForm();
            case "registration": {
                return <NewRequestRegistrationForm onRegister={handleSuccessRegister} />
            }
        }
    }

    return (
        <div className={styles['user-data']}>
            {isLoading && <LoaderCircle />}
            {/*<h2 className={styles['caption']}>{CAPTION}</h2>*/}
            <div className={styles['login-container']}>
                {isAuth && clientInfo ? (
                    <div className={styles['login-user-data']}>
                        {/* TODO добавить address и phone в профиль */}
                        <div className={styles['name']}>{clientInfo.firstName}{NBSP}{clientInfo.lastName}</div>
                        {/*{clientInfo.address && <div className={styles['data-item']}>Адресс: {clientInfo.address}</div>}*/}
                        <div className={styles['data-item']}>Email: {clientInfo.email}</div>
                        {/*{clientInfo.phone && <div className={styles['data-item']}>Телефон: {clientInfo.phone}</div>}*/}
                    </div>
                ) : (
                    <div className={styles['login-form']}>
                        <Segmented
                            options={pages}
                            value={currentPageId}
                            onChange={handlePageChange}
                            className={styles['login-pages']}
                            block
                        />
                        {renderContentByCurrentId()}
                    </div>
                )}
            </div>
            {isAuth && (
                <>
                    <div>
                        <Checkbox onChange={handleCheckbox}>Настоящим подтверждаю, что мои данные верны</Checkbox>
                    </div>
                    <div className={styles['buttons']}>
                        <Button onClick={onPrevPageClick} className={styles['back-btn']}>Назад</Button>
                        <Button disabled={!hasAgreement} onClick={onNextPageClick} className={styles['next-btn']}>Далее</Button>
                    </div>
                </>
            )}
        </div>
    )
})

export default NewRequestUserDataPart;