import React, {memo, useCallback} from "react";
import styles from "./SubmitForm.module.sass";
import {Button} from "antd";
import {requestCreateNewClaim} from "../api/methods/requestCreateNewClaim";
import {CreateNewClaimParams} from "../api/requests/PostCreateNewClaimRequest";
import { ClaimCreator } from "classes/claim/ClaimCreator";

interface SubmitFormProps {
    error: string
}

const SubmitForm = memo<SubmitFormProps>(({error}) => {
    const claimData = ClaimCreator.instance.claimInfo;

    const submitFullForm = useCallback(async () => {
        const sessionId = localStorage.getItem('id');

        const params: CreateNewClaimParams = {
            claimName: claimData?.name,
            claimText: claimData?.text,
            contentSum: "1500000",
            contentType: "Appeal",
            recipientAddress: 'claimData.organisationData.address',
            recipientEmail: "",
            recipientInn: 'claimData.organisationData.inn',
            recipientName: 'claimData.organisationData.name',
            sessionId: sessionId,
            file: null
        }
        const response = await requestCreateNewClaim(params);

        console.log('requestCreateNewClaim response', response)
    }, [])

    return (
        <div className={styles.sendForm}>
            <div className={styles.subTitle}>Ваше обращение будет рассмотрено нашими специалистами в ближайшее время.</div>
            <div className={styles.subTitle}>Вы будете получать уведомления о любых изменениях.</div>
            <div className={styles.buttonContainer}>
                <div className={styles.error}>{error}</div>
                <Button
                    type="primary"
                    onClick={submitFullForm}
                >
                    Отправить
                </Button>
            </div>
        </div>
    )
})

export default SubmitForm;