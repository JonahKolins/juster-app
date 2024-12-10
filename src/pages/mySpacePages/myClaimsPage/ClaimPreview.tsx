import React from "react";
import {memo} from "react";
import styles from "./ClaimPreview.module.sass";
import {IClaimsItem, IClaimStatus} from "../../../classes/claim/Claim.Types";
import {datetimeUtils} from "../../../core/utils/datetimeUtils";
import {IOrganisationData} from "../../../newRequest/NewRequestDataLayer";
import {ISuggestions} from "../../../newRequest/api/requests/GetOrganisationSuggestionsRequest";
import Button from "../../../designSystem/button/Button";
import {useNavigate} from "react-router-dom";
import {RiMessage3Line} from "react-icons/ri";

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
            case IClaimStatus.created: return 'Создано';
            case IClaimStatus.underConsideration: return 'На рассмотрении';
            case IClaimStatus.inProcess: return 'В процессе';
            case IClaimStatus.waitingForAction: return 'Требуется действие';
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
                        <td className={styles['value']}>{claim.id}</td>
                    </tr>
                    <tr>
                        <td className={styles['key']}>Причина</td>
                        <td className={styles['value']}>{claim.reason.text}</td>
                    </tr>
                    <tr>
                        <td className={styles['key']}>Текущий статус</td>
                        <td className={styles['value']}>{getStatusName(claim.status)}</td>
                    </tr>
                    <tr>
                        <td className={styles['key']}>Дата создания</td>
                        <td className={styles['value']}>{datetimeUtils.formatTime(claim.createdDate, 'DD.MM.YYYY')}</td>
                    </tr>
                    <tr>
                        <td className={styles['key']}>Последнее обновление</td>
                        <td className={styles['value']}>{datetimeUtils.formatTime(claim.createdDate, 'DD.MM.YYYY')}</td>
                    </tr>
                </tbody>
            </table>
        )
    }

    const isSuggestion = (info: IOrganisationData): info is ISuggestions => {
        return info && Boolean((info as ISuggestions).data) && Boolean((info as ISuggestions).value)
    }

    const renderCompanyTable = (): React.JSX.Element => {
        if (!claim) return null;

        // @ts-ignore
        const company = claim.organisation || claim['org'];

        if (!company) return null;

        if (isSuggestion(company)) {
            return (
                <>
                    <div className={styles['company-caption']}>Обращение направлено в {company.value}</div>
                    <table className={styles['about-table']}>
                        <tbody>
                            <tr>
                                <td className={styles['key']}>Название</td>
                                {/*// @ts-ignore*/}
                                <td className={styles['value']}>{company.data.name['full_with_opf'] || company.value}</td>
                            </tr>
                            <tr>
                                <td className={styles['key']}>Адресс</td>
                                <td className={styles['value']}>{`${company.data.address.data.postal_code}, ${company.data.address.value}`}</td>
                            </tr>
                            <tr>
                                <td className={styles['key']}>ИНН</td>
                                <td className={styles['value']}>{company.data.inn}</td>
                            </tr>
                            <tr>
                                <td className={styles['key']}>КПП</td>
                                <td className={styles['value']}>{company.data.kpp}</td>
                            </tr>
                            <tr>
                                <td className={styles['key']}>ОГРН</td>
                                <td className={styles['value']}>{company.data.ogrn}</td>
                            </tr>
                        </tbody>
                    </table>
                </>
            )
        }

        return (
            <>
                <div className={styles['company-caption']}>Обращение направлено в {company.name}</div>
                <table className={styles['about-table']}>
                    <tbody>
                        <tr>
                            <td className={styles['key']}>Название</td>
                            <td className={styles['value']}>{company.name}</td>
                        </tr>
                        <tr>
                            <td className={styles['key']}>Адресс</td>
                            <td className={styles['value']}>{company.address}</td>
                        </tr>
                        <tr>
                            <td className={styles['key']}>ИНН</td>
                            <td className={styles['value']}>{company.inn}</td>
                        </tr>
                    </tbody>
                </table>
            </>
        )
    }

    return (
        <div className={styles['claim-preview']}>
            <div className={styles['caption-container']}>
                <div className={styles['caption']}>{claim.name}</div>
                <div className={styles['buttons']}>
                    <Button
                        className={styles['button']}
                        onClick={() => navigate(`/mySpace/myRequests/${claim.id}`)}
                        children={
                            <div className={styles['comments']}>
                                <RiMessage3Line className={styles['icon']} />
                                <span className={styles['number']}>{claim.actions?.length ? claim.actions.length : 0}</span>
                            </div>
                        }
                    />
                    <Button
                        className={styles['button']}
                        onClick={() => navigate(`/mySpace/myRequests/${claim.id}`)}
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
            <div className={styles['text']}>
                <div dangerouslySetInnerHTML={{__html: claim.text}}/>
            </div>
        </div>
    )
})

export default ClaimPreview;