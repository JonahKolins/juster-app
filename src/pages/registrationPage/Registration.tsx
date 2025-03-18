import React, {useCallback, useEffect, useState} from "react";
import styles from "./Registration.module.sass";
import {Button, Checkbox, Form, Input, message} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {ValidateStatus} from "antd/es/form/FormItem";
import {requestCreateAccount} from "../../cmd/network/registration/methods/createAccount";
import {useSessionInfo} from "../../app/hooks/useSessionInfo";
import { browserUtils } from "core/utils";
import { ICreateAccountResponse } from "cmd/network/registration/requests/CreateAccountRequest";
import { Session } from "classes/session/Session";

export enum InputType {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
}

interface IRegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    checkbox: boolean;
}

const AGREEMENT_TEXT = 'Я подтверждаю, что ознакомлен с правилами и даю свое согласие на обработку персональных данных ООО «Тест».'

const Registration = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    // inputs values
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    // pwds statuses
    const [passwordValidStatus, setPasswordValidStatus] = useState<ValidateStatus>('');
    const [confirmPasswordValidStatus, setConfirmPasswordValidStatus] = useState<ValidateStatus>('');
    // checkbox
    const [checkboxValue, setCheckboxValue] = useState<boolean>(false);
    // errors
    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const {isAuth} = useSessionInfo();

    useEffect(() => {
        if (isAuth) {
            console.log('useEffect -> isAuth -> navigate')
            navigate('/mySpace/dashboard');
        }
    }, [isAuth])


    const onSubmitForm = async (values: IRegisterFormData) => {

        let isValid: boolean = false;

        if (
            !!firstName &&
            !!lastName &&
            !!email &&
            passwordValidStatus == 'success' &&
            confirmPasswordValidStatus == 'success' &&
            checkboxValue
        ) {
            isValid = true
        } else {
            isValid = false
        }

        if (!isValid) {
            setError(true);
            if (!firstName) {
                setErrorMessage('Не заполнено имя')
                return;
            }
            if (!lastName) {
                setErrorMessage('Не заполнена фамилия')
                return;
            }
            if (!email) {
                setErrorMessage('Не заполнен email')
                return;
            }
            if (passwordValidStatus !== 'success') {
                setErrorMessage('Пароль не соответствует требованиям безопасности')
                return;
            }
            if (confirmPasswordValidStatus !== 'success') {
                setErrorMessage('Пароли не совпадают')
                return;
            }
            if (!checkboxValue) {
                setErrorMessage('Нет согласия с условиями')
                return;
            }
            return;
        }

        try {
            const response = await Session.instance.register({
                name: `${firstName} ${lastName}`,
                email: email,
                password: password,
                confirmPassword: confirmPassword,
                hasCheckbox: checkboxValue
            })

            if (response) {
                messageApi.open({
                    type: "success",
                    content: "Аккаунт успешно создан"
                }).then(() => navigate('/auth/login'))
            }
        } catch (err) {
            console.log('Regisration, e:', err)
            setError(true);
            setErrorMessage(err.message);
        }
    };

    const handleInputChange = (type: InputType, value: string) => {
        switch (type) {
            case InputType.firstName: {
                setFirstName(value);
                break;
            }
            case InputType.lastName: {
                setLastName(value);
                break;
            }
            case InputType.email: {
                setEmail(value);
                break;
            }
            case InputType.password: {
                setPassword(value);
                validatePassword(value);
                break;
            }
            case InputType.confirmPassword: {
                setConfirmPassword(value);
                validateConfirmPassword(value);
                break;
            }
        }

        if (error) {
            setError(false);
            setErrorMessage('');
        }
    }

    const handleCheckboxChange = useCallback((value: boolean) => {
        setCheckboxValue(value);
        if (error) {
            setError(false);
            setErrorMessage('');
        }
    }, [error])

    // проверка требований к паролю
    const validatePassword = useCallback((value: string) => {
        // пароль меньше 8 символов
        if (value.length < 8) {
            setPasswordValidStatus('');
            return;
        }
        // пароль имеет цифры
        const hasNumbers = checkNumbers(value);
        // пароль имеет буквы
        const hasLetters = checkLetters(value);
        if (!hasNumbers || !hasLetters) {
            setPasswordValidStatus('error');
            return;
        }
        // хороший пароль
        setPasswordValidStatus('success');
        //
        window.setTimeout(() => {
            // меняем пароль когда уже есть подтвержденный пароль
            if (confirmPassword.length) {
                // проверим соответствие паролей
                handleConfirmPasswordBlur(confirmPassword);
            }
        }, 10)
    }, [confirmPassword, password])

    // проверка требований к повтору пароля
    const validateConfirmPassword = useCallback((value: string) => {
        // пароль меньше 8 символов
        if (value.length < 8) {
            setConfirmPasswordValidStatus('');
            return;
        }
        // пароли не совпадают
        if (value !== password) {
            setConfirmPasswordValidStatus('error');
            return;
        }
        // пароли совпадают
        setConfirmPasswordValidStatus('success');
    }, [password])

    const handlePasswordBlur = (value: string) => {
        // пароль меньше 8 символов
        if (value.length < 8) {
            setPasswordValidStatus('error');
            return;
        }
        // пароль имеет цифры
        const hasNumbers = checkNumbers(value);
        // пароль имеет буквы
        const hasLetters = checkLetters(value);
        if (!hasNumbers || !hasLetters) {
            setPasswordValidStatus('error');
            return;
        }
    }

    const handleConfirmPasswordBlur = (value: string) => {
        // пароль меньше 8 или пароли не совпадают
        if (value.length < 8 || value !== password) {
            setConfirmPasswordValidStatus('error');
            return;
        }
    }

    // проверка на буквы
    const checkLetters = (password: string): boolean => {
        const pwdArray = password.split('');
        return pwdArray.some((letter) => letter.toUpperCase() !== letter.toLowerCase())
    }

    const checkNumbers = (password: string): boolean => {
        const pwdArray = password.split('');
        const numbers: number[] = [];

        for (let i = 0; i < pwdArray.length; i++) {
            const curEl = pwdArray[i];
            if (!isNaN(Number(curEl))) {
                numbers.push(Number(curEl));
            }
        }

        return numbers.length > 0;
    }

    return (
        <Form
            form={form}
            className={styles.registration}
            name="register"
            onFinish={onSubmitForm}
        >
            <div className={styles.container}>
                <div className={styles.info_container}>
                    <span className={styles.reg_icon} />
                </div>
                <div className={styles.inputs_container}>
                    <div className={styles.caption}>Регистрация</div>
                    <Form.Item
                        name="firstName"
                        className={styles.form_item}
                    >
                        <label className={styles.label}>Имя</label>
                        <Input
                            allowClear
                            size="large"
                            onChange={(e) => handleInputChange(InputType.firstName, e.target.value)}
                            required
                        />
                    </Form.Item>
                    <Form.Item
                        name="lastName"
                        className={styles.form_item}
                    >
                        <label className={styles.label}>Фамилия</label>
                        <Input
                            allowClear
                            size="large"
                            onChange={(e) => handleInputChange(InputType.lastName, e.target.value)}
                            required
                        />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        className={styles.form_item}
                    >
                        <label className={styles.label}>Email</label>
                        <Input
                            allowClear
                            size="large"
                            onChange={(e) => handleInputChange(InputType.email, e.target.value)}
                            type='email'
                            required
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        hasFeedback={true}
                        validateStatus={passwordValidStatus}
                        className={styles.form_item}
                    >
                        <label className={styles.label}>Пароль</label>
                        <Input.Password
                            size="large"
                            onChange={(e) => handleInputChange(InputType.password, e.target.value)}
                            required
                            onBlur={(e) => handlePasswordBlur(e.target.value)}
                        />
                        <span className={styles.title}>Мин. 8 символов: цифры и латинские буквы</span>
                    </Form.Item>
                    <Form.Item
                        name="confirm"
                        hasFeedback={true}
                        validateStatus={confirmPasswordValidStatus}
                        dependencies={['password']}
                        className={styles.form_item}
                    >
                        <label className={styles.label}>Подтвердите пароль</label>
                        <Input.Password
                            size="large"
                            onChange={(e) => handleInputChange(InputType.confirmPassword, e.target.value)}
                            required
                            onBlur={(e) => handleConfirmPasswordBlur(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item
                        name="agreement"
                        valuePropName="checked"
                    >
                        <div className={styles.checkbox_block}>
                            <Checkbox
                                value={checkboxValue}
                                onChange={(e) => handleCheckboxChange(e.target.checked)}
                                required
                            >
                                {AGREEMENT_TEXT}
                            </Checkbox>
                        </div>
                    </Form.Item>
                    <div className={styles.pwd_description}>
                        {error && !!errorMessage && <span>{errorMessage}</span>}
                    </div>
                    <Button
                        type="primary"
                        size="large"
                        className={styles.button_body}
                        htmlType="submit"
                    >
                        Создать аккаунт
                    </Button>
                </div>
            </div>
            <div className={styles.has_account}>
                <span>Уже есть аккаунт?</span>
                <Link to={'/auth/login'} className={styles.link}>Войти</Link>
            </div>
            {contextHolder}
        </Form>
    )
}

export default Registration;