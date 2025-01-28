import React, {FC, useCallback, useEffect, useState} from "react";
import styles from "./ManualForm.module.sass";
import {Input} from "antd";
import classNames from "classnames";
import { IMinRespondentData } from "classes/claim/Claim.Types";

enum InputID {
    name,
    inn,
    address
}

interface ManualFormProps {
    saveRespondentData: (data: IMinRespondentData) => void;
    data?: IMinRespondentData;
    disabled?: boolean
    clean?: boolean
}

const ManualForm: FC<ManualFormProps> = ({data, saveRespondentData, disabled, clean}) => {
    const [name, setName] = useState<string>(data ? data.name : '');
    const [inn, setInn] = useState<string>(data ? data.inn : '');
    const [address, setAddress] = useState<string>(data ? data.address :'');

    const [error, setError] = useState<boolean>(false);
    const [message, setMessage] = useState<string>(null);

    useEffect(() => {
        if (clean) {
            setName('');
            setInn('');
            setAddress('');
        }
    }, [clean])

    useEffect(() => {
        if (!name && !inn && !address) return;
        saveRespondentData({name, inn, address});
    }, [name, inn, address])

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
            case InputID.address: {
                setAddress(value);
                break;
            }
        }
    }, [])

    return (
        <div className={styles['organisation-data']}>
            <div className={styles['data-item']}>
                <div className={styles['inputs']}>
                    <div className={styles['key']}>Название</div>
                    <Input
                        value={name}
                        onChange={(e) => onInputChange(e, InputID.name)}
                        rootClassName={styles['value']}
                        size="middle"
                        placeholder="ООО <Название компании>"
                        allowClear
                        disabled={disabled}
                    />
                </div>
                <div className={classNames(
                    styles['inputs'],
                    styles['_second']
                )}>
                    <div className={styles['key']}>ИНН</div>
                    <Input
                        value={inn}
                        onChange={(e) => onInputChange(e, InputID.inn)}
                        rootClassName={styles['value']}
                        size="middle"
                        placeholder="1234567890"
                        allowClear
                        disabled={disabled}
                    />
                </div>
            </div>
            <div className={styles['data-item']}>
                <div className={styles['inputs']}>
                    <div className={styles['key']}>Адрес</div>
                    <Input
                        value={address}
                        onChange={(e) => onInputChange(e, InputID.address)}
                        rootClassName={styles['value']}
                        size="middle"
                        placeholder="Индекс, город, улица, номер дома, помещение"
                        allowClear
                        disabled={disabled}
                    />
                </div>
            </div>
        </div>
    )
}

export default ManualForm;