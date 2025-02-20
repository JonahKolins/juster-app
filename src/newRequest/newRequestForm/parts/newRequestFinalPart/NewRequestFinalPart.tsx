import React, {memo, useEffect, useState} from "react";
import styles from "./NewRequestFinalPart.module.sass";
import Button from "../../../../designSystem/button/Button";
import {Modal} from "antd";
import {LoaderCircle} from "../../../../designSystem/loader/Loader.Circle";
import {useNavigate} from "react-router-dom";
import {formats} from "../../../../requestItem/textEditor/EditorToolbar";
import ReactQuill from "react-quill";
import {useProfile} from "../../../../app/hooks/useProfile";
import {stringUtils} from "../../../../core/utils";
import {IClaimReason, IMinRespondentData} from "../../../../classes/claim/Claim.Types";
import NBSP = stringUtils.NBSP;
import { ClaimCreator } from "classes/claim/ClaimCreator";
import { ICreateNewClaimResponse } from "cmd/network/claims/requests/PostCreateNewClaimRequest";
import FilesUploader from "components/filesUploader/FilesUploader";

interface NewRequestFinalPartProps {
    onPrevPageClick: () => void;
}

const CAPTION = 'Ваше обращение';

const NewRequestFinalPart = memo<NewRequestFinalPartProps>(({onPrevPageClick}) => {
    const {clientInfo} = useProfile();
    const navigate = useNavigate();

    const [respondentData, setRespondentData] = useState<IMinRespondentData>(ClaimCreator.instance.minRespondentData);
    const [reason, setReason] = useState<IClaimReason>(ClaimCreator.instance.claimInfo.reason);
    const [claimText, setClaimText] = useState<string>(ClaimCreator.instance.claimInfo.text);
    const [files, setFiles] = useState<File[]>(ClaimCreator.instance.files);

    const [createdId, setCreatedId] = useState<string>('');
    const [successDialogOpened, setSuccessDialogOpened] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        ClaimCreator.instance.claimCreatorDataChanged.subscribe(handleClaimCreatorDataChanged);
        handleClaimCreatorDataChanged();
    }, [])

    const handleClaimCreatorDataChanged = () => {
        setRespondentData(ClaimCreator.instance.minRespondentData);
        setReason(ClaimCreator.instance.claimInfo.reason);
        setClaimText(ClaimCreator.instance.claimInfo.text);
        setFiles(ClaimCreator.instance.files);
    }

    const renderOrganisation = () => {
        if (!respondentData) return null;
        return (
            <div>
                <div>{respondentData.name}</div>
                <div>{respondentData.inn}</div>
                <div>{respondentData.address}</div>
            </div>
        )
    }

    const handleSendClaimRequest = () => {
        setIsLoading(true);
        //
        ClaimCreator.instance.createClaim()
            .then((data: ICreateNewClaimResponse) => {
                if (data) {
                    setCreatedId(data.claim.genId);
                    setSuccessDialogOpened(true);
                    setError('');
                } else {
                    setError('Что-то пошло не так :(')
                }
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                setError('Введены не все данные :(')
                console.log('handleSendClaimRequest -> error', error)
            })
    }

    const handleModalOk = () => {
        setSuccessDialogOpened(false);
        navigate(createdId ? `/mySpace/myRequests/${createdId}` : '/mySpace/myRequests');
    }

    const handleModalCancel = () => {
        setSuccessDialogOpened(false);
        navigate('/mySpace/myRequests');
    }

    return (
        <div className={styles['final']}>
            <h2 className={styles['caption']}>{CAPTION}</h2>
            <div className={styles['final-content']}>
                <div className={styles['content-block']}>
                    <div className={styles['block-caption']}>Причина</div>
                    <div className={styles['block-description']}>{reason.text}</div>
                </div>
                <div className={styles['content-block']}>
                    <div className={styles['block-caption']}>Организация</div>
                    <div className={styles['block-description']}>{renderOrganisation()}</div>
                </div>
                <div className={styles['content-block']}>
                    <div className={styles['block-caption']}>Обращение</div>
                    <div className={styles['block-description']}>
                        <ReactQuill
                            className={styles['editor-edit-text']}
                            theme="snow"
                            onChange={() => {}}
                            value={claimText || ''}
                            formats={formats}
                            modules={{toolbar: null}}
                            readOnly={true}
                        />
                        {files?.length 
                            ? <FilesUploader onChange={() => {}} viewMode={true} />
                            : null
                        }
                    </div>
                </div>
                <div className={styles['content-block']}>
                    <div className={styles['block-caption']}>Контакты</div>
                    {clientInfo && (
                        <div className={styles['block-description']}>
                            <div className={styles['login-user-data']}>
                                {/* TODO добавить address и phone в профиль */}
                                <div className={styles['name']}>{clientInfo.firstName}{NBSP}{clientInfo.lastName}</div>
                                {/*{clientInfo.address && <div className={styles['data-item']}>Адресс: {clientInfo.address}</div>}*/}
                                <div className={styles['data-item']}>Email: {clientInfo.email}</div>
                                {/*{clientInfo.phone && <div className={styles['data-item']}>Телефон: {clientInfo.phone}</div>}*/}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {error && <div>{error}</div>}
            <div className={styles['buttons']}>
                <Button onClick={onPrevPageClick} className={styles['back-btn']}>Назад</Button>
                <Button onClick={handleSendClaimRequest} className={styles['send-btn']}>Отправить</Button>
            </div>
            <Modal
                title={'Обращение отправлено'}
                open={successDialogOpened}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="К обращению"
                cancelText="Закрыть"
            >
                <div>{'Вы успешно создали обращение. Наши специалисты рассмотрят его в ближайшее время. Следить за статусом обращения можно в разделе "Мои обращения".' }</div>
            </Modal>
            {isLoading && <LoaderCircle />}
        </div>
    )
})

export default NewRequestFinalPart;