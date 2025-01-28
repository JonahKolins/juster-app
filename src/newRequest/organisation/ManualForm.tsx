import React, {FC, useCallback, useEffect, useState} from "react";
import styles from "./ManualForm.module.sass";
import {Button, Input} from "antd";
import {ISuggestions} from "../api/requests/GetOrganisationSuggestionsRequest";
import {AiOutlineRest} from "react-icons/ai";
import {FaStarOfLife} from "react-icons/fa";
import { ClaimCreator } from "classes/claim/ClaimCreator";

enum InputID {
    name,
    inn,
    kpp,
    address
}

interface SaveData {
    name: string;
    inn: string;
    kpp: string;
    address: string;
}

interface ManualFormProps {
    selectedOrganisation?: ISuggestions
    saveOrganisationData: (data: SaveData) => void
}

const ManualForm: FC<ManualFormProps> = ({selectedOrganisation, saveOrganisationData}) => {
    const [name, setName] = useState<string>(selectedOrganisation ? selectedOrganisation.value : '');
    const [inn, setInn] = useState<string>(selectedOrganisation ? selectedOrganisation.data.inn : '');
    const [kpp, setKpp] = useState<string>(selectedOrganisation ? selectedOrganisation.data.kpp : '');
    const [address, setAddress] = useState<string>(selectedOrganisation ? selectedOrganisation.data.address.value :'');
    const [error, setError] = useState<boolean>(false);
    const [message, setMessage] = useState<string>(null);

    useEffect(() => {
        setName(selectedOrganisation ? selectedOrganisation.value : '');
        setInn(selectedOrganisation ? selectedOrganisation.data.inn : '');
        setKpp(selectedOrganisation ? selectedOrganisation.data.kpp : '');
        setAddress(selectedOrganisation ? selectedOrganisation.data.address.value : '');
    }, [selectedOrganisation])

    const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, id: InputID) => {
        setError(false);
        const value = e.target.value;
        switch (id) {
            case InputID.name: {
                setName(value);
                break;
            }
            case InputID.inn: {
                setInn(value);
                break;
            }
            case InputID.kpp: {
                setKpp(value);
                break;
            }
            case InputID.address: {
                setAddress(value);
                break;
            }
        }
    }, [])

    // очистка всех полей
    const clearHandle = useCallback(() => {
        setName('');
        setInn('');
        setKpp('');
        setAddress('');
    }, [])

    const isValidData = (data: string): boolean => {
        return !(!data || !data.length);
    }

    const validateSubmitData = (): boolean => {
        const noValidData =  [name, inn, address].filter((item) => !isValidData(item))
        if (noValidData.length) {
            setError(true)
            setMessage('Пожалуйста заполните все обязательные поля')
            return false;
        }
        setError(false);
        setMessage(null);
        return true
    }

    const submitHandle = useCallback(() => {
        const isValid = validateSubmitData();
        if (isValid) {
            saveOrganisationData({name, inn, kpp, address});
            ClaimCreator.instance.setRespondent({name, inn, address});
            setError(false);
        }
    }, [address, inn, kpp, name, saveOrganisationData, validateSubmitData])

    const setInputName = (name: string, isRequired: boolean) => {
        return (
            <div className={styles['addonBefore']}>
                {isRequired &&
                    <div className={styles['icon']}>
                        <FaStarOfLife size="8" color="var(--base-color__grey300)" />
                    </div>
                }
                {name}
            </div>
        )
    }

    return (
        <div className={styles.manualContainer}>
            <Input onChange={(e) => onInputChange(e, InputID.name)} value={name} addonBefore={setInputName("Название", true)} allowClear />
            <div className={styles.manualRow}>
                <Input onChange={(e) => onInputChange(e, InputID.inn)} value={inn} addonBefore={setInputName("ИНН", true)} allowClear />
                <Input onChange={(e) => onInputChange(e, InputID.kpp)} value={kpp} addonBefore={setInputName("КПП", false)} allowClear />
            </div>
            <Input onChange={(e) => onInputChange(e, InputID.address)} value={address} addonBefore={setInputName("Юр. адрес", true)} allowClear />
            <div className={styles.buttonsContainer}>
                {message && error && <div className={styles.message}>{message}</div>}
                <Button icon={<AiOutlineRest size="20" />} onClick={clearHandle} />
                <Button type="primary" onClick={submitHandle}>Подтвердить</Button>
            </div>
        </div>
    )
}

export default ManualForm;