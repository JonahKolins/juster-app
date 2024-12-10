import React, {memo, useMemo, useState} from "react";
import styles from "./NewRequestRegistrationForm.module.sass";
import {Input, InputSize} from "../../../../designSystem/input";
import Button from "../../../../designSystem/button/Button";
import {LoaderCircle} from "../../../../designSystem/loader/Loader.Circle";
import {IUserRegistrationResponse} from "../../../../app/auth/methods/testUserRegistration";
import {requestCreateAccount} from "../../../../cmd/network/registration/methods/createAccount";
import {CreateAccountParams} from "../../../../cmd/network/registration/requests/CreateAccountRequest";

interface NewRequestRegistrationFormProps {
    onRegister: () => void;
}

const NewRequestRegistrationForm = memo<NewRequestRegistrationFormProps>(({onRegister}) => {
    // credentials - page
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    //
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const handleFirstNameChange = (value: string, event?: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(value);
    }
    const handleLastNameChange = (value: string, event?: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(value);
    }

    const handleEmailChange = (value: string, event?: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(value);
    }

    const handlePasswordChange = (value: string) => {
        setPassword(value);
    }

    const handleFirstNameClear = () => {
        setFirstName('');
        setError('');
    }

    const handleLastNameClear = () => {
        setLastName('');
        setError('');
    }

    const handleEmailClear = () => {
        setEmail('');
        setError('');
    }

    const handlePasswordClear = () => {
        setPassword('');
        setError('');
    }

    const isValidToRegister = useMemo<boolean>(() => {
        return !!firstName.length
            && !!lastName.length
            && email.length > 4
            && password.length > 4
    }, [firstName, lastName, email, password])

    const handleRegisterClick = () => {
        if (!isValidToRegister) {
            setError('Заполните все поля');
            return;
        }

        const payload: CreateAccountParams = {
            firstName,
            lastName,
            email,
            password,
            agreementCheckbox: true
        };

        requestCreateAccount(payload)
            .then((data: IUserRegistrationResponse) => {
                setIsLoading(false);
                setError('');
                onRegister();
            })
            .catch((error) => {
                setError('Ошибка регистрации');
                setIsLoading(false);
            })
    }

    const renderCredentialsPage = () => {
        return (
            <>
                <Input
                    value={firstName}
                    placeholder='Имя'
                    className={styles['item']}
                    tabIndex={0}
                    onChange={handleFirstNameChange}
                    error={null}
                    size={InputSize.Medium}
                    name='client_name'
                    onClear={handleFirstNameClear}
                />
                <Input
                    value={lastName}
                    placeholder='Фамилия'
                    className={styles['item']}
                    tabIndex={0}
                    onChange={handleLastNameChange}
                    error={null}
                    size={InputSize.Medium}
                    name='client_last_name'
                    onClear={handleLastNameClear}
                />
                <Input
                    type='email'
                    value={email}
                    placeholder='Email'
                    className={styles['item']}
                    tabIndex={0}
                    onChange={handleEmailChange}
                    error={null}
                    size={InputSize.Medium}
                    name='client_email'
                    onClear={handleEmailClear}
                />
                <Input
                    type='password'
                    value={password}
                    placeholder='Пароль'
                    className={styles['item']}
                    tabIndex={0}
                    onChange={handlePasswordChange}
                    error={null}
                    size={InputSize.Medium}
                    name='client_password'
                    onClear={handlePasswordClear}
                />
                <div className={styles['error']}>{error ? error : ''}</div>
                <Button disabled={!isValidToRegister} onClick={handleRegisterClick}>Зарегистрироваться</Button>
            </>
        )
    }

    return (
        <div className={styles['registration-form']}>
            {isLoading && <LoaderCircle />}
            {renderCredentialsPage()}
        </div>
    )
})

export default NewRequestRegistrationForm;