import React from "react";
import {memo} from "react";
import styles from "./ClaimPreview.module.sass";
import {IClaimStatus, IClaimsItem} from "../../../classes/claim/Claim.Types";
import {datetimeUtils} from "../../../core/utils/datetimeUtils";
import Button from "../../../designSystem/button/Button";
import {useNavigate} from "react-router-dom";
import {RiMessage3Line} from "react-icons/ri";
import classNames from "classnames";
import {formats} from "../../../requestItem/textEditor/EditorToolbar";
import ReactQuill from "react-quill";

interface ClaimPreviewProps {
    claim: IClaimsItem;
    showExample?: boolean;
}

const ClaimPreview = memo<ClaimPreviewProps>(({claim, showExample}) => {

    const navigate = useNavigate();

    if (!claim) {
        return showExample
            ? (
                <div className={styles['claim-preview']}>
                    <div>Название жалобы</div>
                    <div>Описание</div>
                </div>
            ): null
    }

    const getStatusName = (status: IClaimStatus): string => {
        switch (status) {
            case IClaimStatus.draft: return 'Черновик';
            case IClaimStatus.new: return 'Создано';
            case IClaimStatus.open: return 'На рассмотрении';
            case IClaimStatus.inProgress: return 'В процессе';
            case IClaimStatus.needInfo: return 'Требуется действие';
            case IClaimStatus.resolved: return 'Решено';
            case IClaimStatus.declined: return 'Отклонено';
            default: return 'Создано';
        }
    }

    const renderAboutTable = (): React.JSX.Element => {
        if (!claim) return null;
        return (
            <table className={styles['about-table']}>
                <tbody>
                    <tr>
                        <td className={styles['key']}>Идентификатор</td>
                        <td className={styles['value']}>{claim.genId}</td>
                    </tr>
                    <tr>
                        <td className={styles['key']}>Причина</td>
                        <td className={styles['value']}>{claim.claimInfo.contentType}</td>
                    </tr>
                    <tr>
                        <td className={styles['key']}>Текущий статус</td>
                        <td className={styles['value']}>{getStatusName(claim.claimInfo.status as IClaimStatus)}</td>
                    </tr>
                    <tr>
                        <td className={styles['key']}>Дата создания</td>
                        <td className={styles['value']}>{datetimeUtils.formatTime(claim.claimInfo.createdAt, 'DD.MM.YYYY')}</td>
                    </tr>
                    <tr>
                        <td className={styles['key']}>Последнее обновление</td>
                        <td className={styles['value']}>{datetimeUtils.formatTime(claim.claimInfo.lastUpd, 'DD.MM.YYYY')}</td>
                    </tr>
                </tbody>
            </table>
        )
    }

    const renderCompanyTable = (): React.JSX.Element => {
        if (!claim || !claim.claimInfo) return null;
        return (
            <>
                <div className={styles['company-caption']}>Обращение направлено в {claim.claimInfo.recipientName}</div>
                <table className={styles['about-table']}>
                    <tbody>
                        <tr>
                            <td className={styles['key']}>Название</td>
                            <td className={styles['value']}>{claim.claimInfo.recipientName}</td>
                        </tr>
                        <tr>
                            <td className={styles['key']}>Адресс</td>
                            <td className={styles['value']}>{claim.claimInfo.recipientAddress}</td>
                        </tr>
                        <tr>
                            <td className={styles['key']}>ИНН</td>
                            <td className={styles['value']}>{claim.claimInfo.recipientInn}</td>
                        </tr>
                    </tbody>
                </table>
            </>
        )
    }

    return (
        <div className={styles['claim-preview']}>
            <div className={styles['caption-container']}>
                <div className={styles['caption']}>{claim.claimInfo.recipientName}</div>
                <div className={styles['buttons']}>
                    <Button
                        className={styles['button']}
                        onClick={() => navigate(`/mySpace/myRequests/${claim.genId}`)}
                        children={
                            <div className={styles['comments']}>
                                <RiMessage3Line className={styles['icon']} />
                                {/* <span className={styles['number']}>{claim.claimInfo.comments?.length ? claim.claimInfo.comments.length : 0}</span> */}
                            </div>
                        }
                    />
                    <Button
                        className={styles['button']}
                        onClick={() => navigate(`/mySpace/myRequests/${claim.genId}`)}
                        children={'Перейти к обращению'}
                    />
                </div>
            </div>
            <div className={styles['about']}>
                {renderAboutTable()}
            </div>
            <div className={styles['company']}>
                {renderCompanyTable()}
            </div>
            <ReactQuill
                className={styles['text']}
                theme=""
                onChange={() => {}}
                value={claim.claimInfo.textClaim || ''}
                formats={formats}
                modules={{toolbar: null}}
                readOnly={true}
            />
        </div>
    )
})

export default ClaimPreview;