import React, {memo, useState} from "react";
import {Button, Form, Input} from "antd";
import styles from "./ResetPasswordPage.module.sass";
import {useNavigate} from "react-router-dom";

interface ResetPasswordPageProps {}

const ResetPasswordPage = memo<ResetPasswordPageProps>(({}) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleResetSubmit = () => {
        setLoading(true);

        return new Promise(() => {
            window.setTimeout(() => {
                setLoading(false);
            }, 3000)
        })
    }

    const handleLogin = () => {
        navigate('/auth/login')
    }

    return (
        <Form
            form={form}
            className={styles['reset']}
            name="reset"
            onFinish={handleResetSubmit}
        >
            <div className={styles['container']}>
                <div className={styles['form']}>
                    <span className={styles['caption']}>Сброс пароля</span>
                    <Form.Item
                        name="email"
                        className={styles['form-item']}
                    >
                        <label className={styles['label']}>Email</label>
                        <Input
                            allowClear
                            size="large"
                            onChange={(e) => setEmail(e.target.value)}
                            type='email'
                            required
                        />
                    </Form.Item>
                    <Button
                        type="primary"
                        size="large"
                        className={styles['submit-button']}
                        htmlType="submit"
                        loading={loading}
                    >
                        Отправить Email
                    </Button>
                    <Button
                        type="link"
                        color="primary"
                        className={styles['login-button']}
                        onClick={handleLogin}
                    >
                        Войти
                    </Button>
                </div>
            </div>
        </Form>
    )
})

export default ResetPasswordPage;