import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Button, Form, Input} from "antd";
import {Session} from "../../classes/session/Session";
import styles from './Login.module.sass';
import {useSessionInfo} from "../../app/hooks/useSessionInfo";

const Login = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    // data
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    // errors
    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    // loading
    const [loading, setLoading] = useState<boolean>(false);

    const {isAuth} = useSessionInfo();

    useEffect(() => {
        if (isAuth) {
            console.log('useEffect -> isAuth -> navigate')
            navigate('/mySpace/dashboard');
        }
    }, [isAuth])

    const handleLoginSubmit = async () => {
        setLoading(true);
        setError(false);
        setErrorMessage('');

        Session.instance.login(email, password)
            .then(() => {
                console.log('success login -> then')
                // navigate('/mySpace/dashboard');
            })
            .catch((err) => {
                console.log('handleLoginSubmit error', {err});
                if (!err?.response) {
                    setError(true);
                    setErrorMessage('Нет ответа от сервера');
                } else if (err.response?.status === 403) {
                    setError(true);
                    setErrorMessage('Неверный логин пользователя или пароль');
                } else {
                    setError(true);
                    setErrorMessage('Неуспешная попытка входа');
                }
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setError(false);
        setErrorMessage('');
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setError(false);
        setErrorMessage('');
    }

    const handleResetPassword = () => {
        navigate('/auth/reset')
    }

    return (
        <Form
            form={form}
            className={styles['login']}
            name="login"
            onFinish={handleLoginSubmit}
        >
            <div className={styles['container']}>
                <div className={styles['form']}>
                    <span className={styles['caption']}>Вход</span>
                    <Form.Item
                        name="email"
                        className={styles['form-item']}
                    >
                        <label className={styles['label']}>Email</label>
                        <Input
                            allowClear
                            size="large"
                            onChange={handleEmailChange}
                            type='email'
                            required
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        hasFeedback={true}
                        className={styles['form-item']}
                    >
                        <label className={styles['label']}>Пароль</label>
                        <Input.Password
                            size="large"
                            onChange={handlePasswordChange}
                            required
                        />
                    </Form.Item>
                    <div className={styles['error-container']}>
                        {error && !!errorMessage && <span>{errorMessage}</span>}
                    </div>
                    <Button
                        type="primary"
                        size="large"
                        className={styles['submit-button']}
                        htmlType="submit"
                        loading={loading}
                    >
                        Войти
                    </Button>
                    <Button
                        type="link"
                        color="primary"
                        className={styles['reset-button']}
                        onClick={handleResetPassword}
                    >
                        Сбросить пароль
                    </Button>
                </div>
            </div>
            <div className={styles['no-account']}>
                <span>Нет аккаунта?&nbsp;
                    <Link to={'/auth/register'} className={styles['link']}>Зарегистрироваться</Link>
                </span>
            </div>
        </Form>
    );
}

export default Login;