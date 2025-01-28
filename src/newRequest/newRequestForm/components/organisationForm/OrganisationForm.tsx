import React, {memo} from "react";
import styles from "./OrganisationForm.module.sass";
import {IoClose} from "react-icons/io5";
import { BsBuildings } from "react-icons/bs";
import { IMinRespondentData } from "classes/claim/Claim.Types";

interface OrganisationFormProps {
    data: IMinRespondentData;
    onClose?: () => void;
}

const OrganisationForm = memo<OrganisationFormProps>(({data, onClose}) => {

    if (!data) return null;
    return (
        <div className={styles['organisation-form']}>
            {onClose && (
                <div
                    onClick={onClose}
                    className={styles['close-btn-container']}
                >
                    <IoClose size={18} />
                </div>
            )}
            <div className={styles['organisation-icon']}>
                <BsBuildings size={56} />
            </div>
            <div className={styles['organisation-data']}>
                <div className={styles['name']}>{data.name}</div>
                <div>Адресс: {data.address}</div>
                <div>Инн: {data.inn}</div>
                {/* <div>КПП: {data.data.kpp}</div> */}
                {/* {data.data.ogrn && <div>Огрн: {data.data.ogrn}</div>} */}
            </div>
        </div>
    )
})

export default OrganisationForm;