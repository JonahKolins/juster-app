import React, {memo, useCallback, useEffect, useState} from "react";
import styles from "./AdditionalInfo.module.sass";
import {Dropdown, MenuProps, Modal, Tag} from "antd";
import {BsChevronDown} from "react-icons/bs";
import {IOrganisationData} from "../../newRequest/NewRequestDataLayer";
import {ISuggestions} from "../../newRequest/api/requests/GetOrganisationSuggestionsRequest";
import {Claim} from "../../classes/claim/Claim";
import {IClaimAction, IClaimActionType, IClaimStatus} from "../../classes/claim/Claim.Types";
import {useProfile} from "../../app/hooks/useProfile";

interface InfoRow {
    name: string;
    value: string | JSX.Element;
}

const MOCK_ADD_CLAIM_INFO = {
    id: '120',
    status: IClaimStatus.inProcess,
    author: 'Пувел Диареевич',
    institution: 'Роспотребнадзор',
    createdDate: '01.07.2023 10:20',
    lastUpdate: '01.07.2023 в 19:30'
}

interface AdditionalInfoProps {
    manager: Claim;
    id: string;
    author: string;
    status: IClaimStatus;
    org: IOrganisationData;
}

const AdditionalInfo = memo<AdditionalInfoProps>(({manager, id, status, author, org}) => {
    const {clientInfo} = useProfile();

    const [rows, setRows] = useState<InfoRow[]>(null);
    const [currentStatus, setCurrentStatus] = useState<IClaimStatus>(status);
    const [declineDialogOpened, setDeclineDialogOpened] = useState<boolean>(false);

    useEffect(() => {
        createInfoRows();
    }, [])

    const isSuggestion = (info: IOrganisationData): info is ISuggestions => {
        return info && Boolean((info as ISuggestions).data) && Boolean((info as ISuggestions).value)
    }

    const renderOrgView = (name: string, address: string, inn: string) => {
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

    const renderOrg = () => {
        if (!org) return null;
        return isSuggestion(org)
            ? renderOrgView(org.value, org.data.address.value, org.data.inn)
            : renderOrgView(org.name, org.address, org.inn)
    }

    const createInfoRows = useCallback(() => {
        const info = MOCK_ADD_CLAIM_INFO;
        const resultRows: InfoRow[] = [];
        for (let field in info) {
            if (field === 'id') {
                resultRows.push({name: 'Номер', value: id})
            }
            if (field === 'status'){
                resultRows.push({name: 'Статус', value: renderStatusTag(info[field])})
            }
            if (field === 'author') {
                resultRows.push({name: 'Автор', value: author})
            }
            if (field === 'institution') {
                resultRows.push({name: 'Учреждение', value: renderOrg()})
            }
        }

        setRows(resultRows);
    }, [])

    const renderStatusTag = (status: IClaimStatus, className?: string, children?: React.JSX.Element): React.JSX.Element => {
        switch (status) {
            case IClaimStatus.created: {
                return (
                    <Tag color='geekblue' className={className}>
                        Создано
                        {children}
                    </Tag>
                )
            }
            case IClaimStatus.underConsideration: {
                return (
                    <Tag color='blue' className={className}>
                        На рассмотрении
                        {children}
                    </Tag>
                )
            }
            case IClaimStatus.inProcess: {
                return (
                    <Tag color='processing' className={className}>
                        В процессе
                        {children}
                    </Tag>
                )
            }
            case IClaimStatus.waitingForAction: {
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
                        Готово
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
            case IClaimStatus.created: return 'Создано';
            case IClaimStatus.underConsideration: return 'На рассмотрении';
            case IClaimStatus.inProcess: return 'В процессе';
            case IClaimStatus.waitingForAction: return 'Требуется действие';
            case IClaimStatus.resolved: return 'Решено';
            case IClaimStatus.declined: return 'Отклонено';
            default: return '';
        }
    }

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        console.log('click', e);
        if (e.key === IClaimStatus.declined) {
            setDeclineDialogOpened(true);
            return;
        }
        //
        setCurrentStatus(e.key as IClaimStatus);
        //
        if (currentStatus != e.key) {
            const newMessageAction: Omit<IClaimAction, 'id'> = {
                createdAt: new Date().getTime(),
                text: `%user% поменял статус на %status% %date%`,
                type: "action",
                actionType: IClaimActionType.statusChanged,
                status: e.key as IClaimStatus,
                user: {
                    firstName: clientInfo.firstName,
                    lastName: clientInfo.lastName
                }
            }
            manager.addAction(newMessageAction);
        }
    };

    const items: MenuProps['items'] = [
        {
            label: 'Создано',
            key: IClaimStatus.created
        },
        {
            label: 'На рассмотрении',
            key: IClaimStatus.underConsideration,
        },
        {
            label: 'В процессе',
            key: IClaimStatus.inProcess,
        },
        {
            label: 'Требуется действие',
            key: IClaimStatus.waitingForAction,
        },
        {
            label: 'Решено',
            key: IClaimStatus.resolved,
            danger: true,
        },
        {
            label: 'Отклонено',
            key: IClaimStatus.declined,
            danger: true
        }
    ];

    const menuProps = {
        items,
        selectable: true,
        onClick: handleMenuClick,
        defaultSelectedKeys: [currentStatus]
    };

    const handleDeclineModalOk = () => {
        setCurrentStatus(IClaimStatus.declined);
        //
        const newMessageAction: Omit<IClaimAction, 'id'> = {
            createdAt: new Date().getTime(),
            text: `%user% поменял статус на %status% %date%`,
            type: "action",
            actionType: IClaimActionType.statusChanged,
            status: IClaimStatus.declined,
            user: {
                firstName: clientInfo.firstName,
                lastName: clientInfo.lastName
            }
        }
        manager.addAction(newMessageAction);
        //
        setDeclineDialogOpened(false);
    }

    const handleDeclineModalCancel = () => {
        setDeclineDialogOpened(false);
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
                <div>Создано {MOCK_ADD_CLAIM_INFO.createdDate}</div>
                <div>Последнее обноление {MOCK_ADD_CLAIM_INFO.lastUpdate}</div>
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
        </div>
    )
})

export default AdditionalInfo
