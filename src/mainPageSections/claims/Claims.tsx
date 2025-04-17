import React, {FC, useMemo} from "react";
import styles from "./Claims.module.sass";
import {useNavigate} from "react-router-dom";
import {Button, Table, Tag} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {useProfile} from "../../app/hooks/useProfile";
import {IAction, IClaimStatus} from "../../classes/claim/Claim.Types";
import {datetimeUtils} from "../../core/utils/datetimeUtils";
import {useClaims} from "../../app/hooks/useClaims";

interface ClaimRowData {
    key: React.Key;
    id: string; //120
    name: string; //"Жалоба на врача"
    createdDate: string; // "2023-06-12 16:52:48.343"
    status: IClaimStatus; //"RESOLVED"
    text: string; //"Колоноскопия прошла не успешно - я обосрался"
    isRowExpandable: boolean;
    actions: IAction[];
}

const Claims: FC = () => {
    const navigate = useNavigate();
    const { clientInfo, isProfileLoading } = useProfile();
    const { claims, isClaimsLoading, isClaimsReady } = useClaims();

    const onAllAppealsClick = () => {
        navigate('/mySpace/claims')
    }

    const tableRows = useMemo<ClaimRowData[]>(() => {
        if (!claims?.length || isClaimsLoading) return [];

        const claimsToRender = claims.slice(0, 10);

        const rowsArray: ClaimRowData[] = claimsToRender.map((item) => {
            return {
                key: item.genId,
                id: item.genId,
                name: item.claimInfo.contentType,
                createdDate: datetimeUtils.formatTime(item.claimInfo.createdAt, 'DD.MM.YYYY'),
                status: item.claimInfo.status as IClaimStatus,
                text: item.claimInfo.textClaim,
                isRowExpandable: !!item.claimInfo.textClaim,
                actions: [] // TODO: add actions
            }
        })

        return rowsArray;
    }, [claims, isClaimsLoading])

    const columns: ColumnsType<ClaimRowData> = [
        {
            title: 'Название',
            dataIndex: 'name',
            render: (name) => renderName(name)
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            width: 170,
            render: (_, {status}) => renderStatusTag(status),
        },
        Table.EXPAND_COLUMN,
    ]

    const renderStatusTag = (status: IClaimStatus): React.JSX.Element => {
        switch (status) {
            case IClaimStatus.resolved: {
                return (
                    <Tag color='green'>Готово</Tag>
                )
            }
            case IClaimStatus.declined: {
                return (
                    <Tag color='volcano'>Отклонено</Tag>
                )
            }
            case IClaimStatus.new: {
                return (
                    <Tag color='geekblue'>Создано</Tag>
                )
            }
            case IClaimStatus.inProgress: {
                return (
                    <Tag color='blue'>В процессе</Tag>
                )
            }
            case IClaimStatus.draft: {
                return (
                    <Tag color='geekblue'>Черновик</Tag>
                )
            }
            case IClaimStatus.open: {
                return (
                    <Tag color='blue'>На рассмотрении</Tag>
                )
            }
            case IClaimStatus.needInfo: {
                return (
                    <Tag color='orange'>Требуется действие</Tag>
                )
            }
            default: {
                // @ts-ignore
                if (status === 'created') {
                    return <Tag color='geekblue'>Создано</Tag>
                }
                return <Tag color='geekblue'>{status}</Tag>
            }
        }
    }

    const renderName = (name: string) => {
        return (
            <div className={styles['row-name']}>{name}</div>
        )
    }

    const handleGoToClaim = (id: string) => {
        navigate(`/mySpace/claims/${id}`)
    }

    const renderDescription = (claimRowData: ClaimRowData): React.JSX.Element => {
        return (
            <div>
                <div className={styles['expand-data']}>Создано {claimRowData.createdDate}</div>
                <div className={styles['expand-data']}>Id: {claimRowData.id}</div>
                <div className={styles['expand-data']}>{claimRowData.actions.length} ответов</div>
                <div className={styles['text']} dangerouslySetInnerHTML={{__html: claimRowData.text}} />
                <Button
                    type="link"
                    color="primary"
                    size="small"
                    className={styles['expand-link']}
                    onClick={() => handleGoToClaim(claimRowData.id)}
                >
                    Перейти к обращению
                </Button>
            </div>
        )
    }

    return (
        <div className={styles['claims']}>
            <Table
                columns={columns}
                dataSource={tableRows}
                loading={isClaimsLoading}
                rowKey={(record) => record.id}
                pagination={false}
                scroll={{ y: '100%' }}
                expandable={{
                    expandedRowRender: (record) => renderDescription(record),
                    rowExpandable: (record) => record.isRowExpandable,
                    // expandIcon: ({ expanded, onExpand, record }) => renderExpandIcon()
                }}
                bordered={true}
                rowHoverable={false}
            />
            <div className={styles['button-container']}>
                <Button
                    size="small"
                    className={styles['all-req-button']}
                    onClick={onAllAppealsClick}
                >
                    Все обращения
                </Button>
            </div>
        </div>
    )
}

export default Claims