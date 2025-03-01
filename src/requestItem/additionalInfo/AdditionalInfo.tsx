import React, {memo, useCallback, useEffect, useMemo, useState} from "react";
import styles from "./AdditionalInfo.module.sass";
import {Dropdown, MenuProps, Modal, Tag} from "antd";
import {BsChevronDown} from "react-icons/bs";
import {Claim} from "../../classes/claim/Claim";
import {ActionType, ClaimType, IClaimStatus, IMinRespondentData} from "../../classes/claim/Claim.Types";
import {useProfile} from "../../app/hooks/useProfile";
import { IClaimActionRequestInfo } from "cmd/network/claims/methods/requestAddClaimAction";
import { datetimeUtils } from "core/utils/datetimeUtils";
import { AccessControl } from "classes/role/AccessControl";

interface InfoRow {
    name: string;
    value: string | JSX.Element;
}

interface AdditionalInfoProps {
    manager: Claim;
    id: string;
    author: string;
    status: IClaimStatus;
    respondent: IMinRespondentData;
}

const AdditionalInfo = memo<AdditionalInfoProps>(({manager, id, status, author, respondent}) => {
    const {clientInfo} = useProfile();
    const statuses = AccessControl.instance.claimStatusesList();

    const [rows, setRows] = useState<InfoRow[]>(null);
    const [currentStatus, setCurrentStatus] = useState<IClaimStatus>(status);
    const [declineDialogOpened, setDeclineDialogOpened] = useState<boolean>(false);
    const [successDialogOpened, setSuccessDialogOpened] = useState<boolean>(false);

    useEffect(() => {
        createInfoRows();
    }, [])

    const renderRespondentView = (name: string, address: string, inn: string) => {
        return (
            <div className={styles['org-table']}>
                <div className={styles['org-row']}>
                    <div className={styles['key']}>Название</div>
                    <div className={styles['value']}>{name}</div>
                </div>
                <div className={styles['org-row']}>
                    <div className={styles['key']}>Адрес</div>
                    <div className={styles['value']}>{address}</div>
                </div>
                <div className={styles['org-row']}>
                    <div className={styles['key']}>Инн</div>
                    <div className={styles['value']}>{inn}</div>
                </div>
            </div>
        )
    }

    const renderRespondent = () => {
        if (!respondent) return null;
        return renderRespondentView(respondent.name, respondent.address, respondent.inn)
    }

    const createInfoRows = useCallback(() => {
        const resultRows: InfoRow[] = [
            {name: 'Номер', value: id},
            {name: 'Статус', value: renderStatusTag(status)},
            {name: 'Автор', value: author},
            {name: 'Учреждение', value: renderRespondent()}
        ];
        setRows(resultRows);
    }, [status])

    const renderStatusTag = (status: IClaimStatus, className?: string, children?: React.JSX.Element): React.JSX.Element => {
        switch (status) {
            case IClaimStatus.new: {
                return (
                    <Tag color='geekblue' className={className}>
                        Создано
                        {children}
                    </Tag>
                )
            }
            case IClaimStatus.draft: {
                return (
                    <Tag color='geekblue' className={className}>
                        Черновик
                        {children}
                    </Tag>
                )
            }
            case IClaimStatus.open: {
                return (
                    <Tag color='blue' className={className}>
                        На рассмотрении
                        {children}
                    </Tag>
                )
            }
            case IClaimStatus.inProgress: {
                return (
                    <Tag color='processing' className={className}>
                        В процессе
                        {children}
                    </Tag>
                )
            }
            case IClaimStatus.needInfo: {
                return (
                    <Tag color='orange' className={className}>
                        Требуется действие
                        {children}
                    </Tag>
                )
            }
            case IClaimStatus.resolved: {
                return (
                    <Tag color='green' className={className}>
                        Решено
                        {children}
                    </Tag>
                )
            }
            case IClaimStatus.declined: {
                return (
                    <Tag color='volcano' className={className}>
                        Отклонено
                        {children}
                    </Tag>
                )
            }
            default: {
                // @ts-ignore
                if (status === 'created') {
                    return <Tag color='geekblue' className={className}>Создано{children}</Tag>
                }
                return (
                    <Tag color='geekblue' className={className}>
                        {status}
                        {children}
                    </Tag>
                )
            }
        }
    }

    const renderRow = (name: string, value: string | JSX.Element) => {
        if (!name || !value) return null;
        return (
            <div key={name} className={styles.info_row}>
                <div className={styles.row_name}>{name}</div>
                <div className={styles.row_value}>{value}</div>
            </div>
        )
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
            case IClaimStatus.deleted: return 'Удалить';
            default: return '';
        }
    }

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        console.log('click', e);
        if (e.key === IClaimStatus.declined || e.key === IClaimStatus.deleted) {
            setDeclineDialogOpened(true);
            return;
        }
        if (e.key === IClaimStatus.resolved) {
            setSuccessDialogOpened(true);
            return;
        }
        if (currentStatus != e.key) {
            const newStatus = e.key as IClaimStatus;
            setCurrentStatus(newStatus);
            manager.changeStatus(newStatus);
        }
    };

    // const items: MenuProps['items'] = [
    //     {
    //         label: 'Создано',
    //         key: IClaimStatus.new
    //     },
    //     {
    //         label: 'Черновик',
    //         key: IClaimStatus.draft
    //     },
    //     {
    //         label: 'На рассмотрении',
    //         key: IClaimStatus.open,
    //     },
    //     {
    //         label: 'В процессе',
    //         key: IClaimStatus.inProgress,
    //     },
    //     {
    //         label: 'Требуется действие',
    //         key: IClaimStatus.needInfo,
    //     },
    //     {
    //         label: 'Решено',
    //         key: IClaimStatus.resolved,
    //         danger: true,
    //     },
    //     {
    //         label: 'Отклонено',
    //         key: IClaimStatus.declined,
    //         danger: true
    //     }
    // ];

    const statusItems: MenuProps['items'] = useMemo(() => {
        if (currentStatus == IClaimStatus.resolved) return [];
        return statuses.map((st: IClaimStatus) => {
            return {
                label: getStatusName(st),
                key: st,
                danger: st == IClaimStatus.deleted
            }
        })
    }, []) 


    const menuProps = {
        items: statusItems,
        selectable: true,
        onClick: handleMenuClick,
        defaultSelectedKeys: [currentStatus]
    };

    const handleDeclineModalOk = () => {
        setCurrentStatus(IClaimStatus.declined);
        //
        const newAction: IClaimActionRequestInfo = {
            text: `%user% поменял статус на %status% %date%`,
            type: ClaimType.action,
            actionType: ActionType.statusChanged,
            status: IClaimStatus.declined
        }
        manager.addAction(newAction);
        //
        setDeclineDialogOpened(false);
    }

    const handleDeclineModalCancel = () => {
        setDeclineDialogOpened(false);
    }

    const handleSuccessModalOk = () => {
        setCurrentStatus(IClaimStatus.resolved);
        //
        const newAction: IClaimActionRequestInfo = {
            text: `%user% поменял статус на %status% %date%`,
            type: ClaimType.action,
            actionType: ActionType.statusChanged,
            status: IClaimStatus.resolved
        }
        manager.addAction(newAction);
        //
        setSuccessDialogOpened(false);
    }

    const handleSuccessModalCancel = () => {
        setSuccessDialogOpened(false);
    }

    if (!rows || !rows.length) return null;
    return (
        <div className={styles.additional_info}>
            <div className={styles.change_status}>
                <Dropdown menu={menuProps} trigger={['click']}>
                    {renderStatusTag(currentStatus, styles.dropdown_tag, (
                        <BsChevronDown className={styles.dropdown_icon} size={10} />
                    ))}
                </Dropdown>
            </div>
            <div className={styles.add_caption}>Сведения</div>
            <div className={styles.add_body}>
                {rows.map((row) => (
                    renderRow(row.name, row.value)
                ))}
                {[1,2,3,4,5,6,7,8].map(item => (
                    <div key={item}>поле</div>
                ))}
            </div>
            <div className={styles.date_block}>
                <div>Создано: {datetimeUtils.formatTime(manager.claimData.claimInfo.createdAt, 'DD MMM YYYY в hh:mm')}</div>
                <div>Последнее обноление: {datetimeUtils.formatTime(manager.claimData.claimInfo.lastUpd, 'DD MMM YYYY в hh:mm')}</div>
            </div>
            <Modal
                title={'Предупреждение'}
                open={declineDialogOpened}
                onOk={handleDeclineModalOk}
                onCancel={handleDeclineModalCancel}
                okText="Отклонить"
                cancelText="Закрыть"
            >
                <div>{'Вы уверены, что хотите отклонить обращение? Рассмотрение обращения прекратится.'}</div>
            </Modal>
            <Modal
                title={'Ура'}
                open={successDialogOpened}
                onOk={handleSuccessModalOk}
                onCancel={handleSuccessModalCancel}
                okText="Да, все супер"
                cancelText="Отмена"
            >
                <div>{'Вы полностью удовлетворены результатом обращения? После завершения вы больше не сможете вести диалог с компанией.'}</div>
            </Modal>
        </div>
    )
})

export default AdditionalInfo
