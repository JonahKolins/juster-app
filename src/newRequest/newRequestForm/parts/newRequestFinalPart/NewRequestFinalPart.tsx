import React, {memo, useState} from "react";
import styles from "./NewRequestFinalPart.module.sass";
import Button from "../../../../designSystem/button/Button";
import {IOrganisationData, useSafeNewRequestDataLayerContext} from "../../../NewRequestDataLayer";
import {ISuggestions} from "../../../api/requests/GetOrganisationSuggestionsRequest";
import OrganisationForm from "../../components/organisationForm/OrganisationForm";
import {Modal} from "antd";
import {LoaderCircle} from "../../../../designSystem/loader/Loader.Circle";
import {useNavigate} from "react-router-dom";
import {formats} from "../../../../requestItem/textEditor/EditorToolbar";
import ReactQuill from "react-quill";
import {useProfile} from "../../../../app/hooks/useProfile";
import {stringUtils} from "../../../../core/utils";
import {IClaimActionType, IClaimsItemResponse, IClaimStatus} from "../../../../classes/claim/Claim.Types";
import NBSP = stringUtils.NBSP;
import {datetimeUtils} from "../../../../core/utils/datetimeUtils";

interface NewRequestFinalPartProps {
    onPrevPageClick: () => void;
}

const CAPTION = 'Ваше обращение';

const NewRequestFinalPart = memo<NewRequestFinalPartProps>(({onPrevPageClick}) => {
    const {reason, organisationData, claimText, files} = useSafeNewRequestDataLayerContext();
    const {clientInfo} = useProfile();
    const navigate = useNavigate();

    const [createdId, setCreatedId] = useState<string>('');
    const [successDialogOpened, setSuccessDialogOpened] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const isSuggestion = (info: IOrganisationData): info is ISuggestions => {
        return info && Boolean((info as ISuggestions).data) && Boolean((info as ISuggestions).value)
    }

    const renderOrganisation = () => {

        if (isSuggestion(organisationData)) {
            return (
                <OrganisationForm data={organisationData} />
            )
        }

        return (
            <div>
                <div>{organisationData.name}</div>
                <div>{organisationData.inn}</div>
                <div>{organisationData.address}</div>
            </div>
        )
    }

    const handleSendClaimRequest = () => {
        const newClaimId = String(Math.floor(1000 + Math.random() * 9000));
        const initialActionId = String(Math.floor(1000 + Math.random() * 9000));

        const createdAt = new Date().getTime();

        const formatDate = datetimeUtils.formatTime(createdAt, 'DD MMM YYYY в hh:mm')

        const payload: IClaimsItemResponse = {
            id: newClaimId,
            name: reason.text,
            status: IClaimStatus.created,
            text: claimText,
            reason: reason,
            files: files,
            createdDate: createdAt,
            organisation: organisationData,
            actions: [
                {
                    type: 'action',
                    actionType: IClaimActionType.claimCreated,
                    id: initialActionId,
                    createdAt: createdAt,
                    text: `Обращение создано`,
                    user: {
                        firstName: clientInfo.firstName,
                        lastName: clientInfo.lastName,
                        title: {
                            id: 'iam',
                            value: 'Вы'
                        }
                    }
                }
            ]
        }

        setIsLoading(true);
        sendClaim(payload)
            .then((data) => {
                if (data) {
                    setCreatedId(data.id);
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

    const sendClaim = (payload: IClaimsItemResponse): Promise<IClaimsItemResponse> => {
        return new Promise((resolve, reject) => {
            if (!reason || !organisationData || !claimText || !clientInfo) {
                reject();
                return;
            }

            const existedRequestsString = localStorage.getItem('user_requests');

            let existedRequestsArray: IClaimsItemResponse[] = [];

            try {
                if (existedRequestsString) {
                    const parsedRegUsers: IClaimsItemResponse[] = JSON.parse(existedRequestsString) || [];

                    if (parsedRegUsers?.length) {
                        existedRequestsArray.push(...parsedRegUsers);
                    }
                }
            } catch (e) {
                console.error('Cannot parse user_requests in FinalPArt -> existedRequestsString', existedRequestsString);
            }

            existedRequestsArray.push(payload);

            const requestsToSend = JSON.stringify(existedRequestsArray);

            localStorage.setItem('user_requests', requestsToSend);

            window.setTimeout(() => {
                resolve(payload);
            }, 600)
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
                        {files && <div>files are here</div>}
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