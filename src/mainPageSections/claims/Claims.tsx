import React, {FC, useCallback, useEffect, useState} from "react";
import styles from "./Claims.module.sass";
import {useNavigate} from "react-router-dom";
import getClaimsRequest from "../api/metods/getClaimsRequest";
import {Button, Table, Tag} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {IOrganisationData} from "../../newRequest/NewRequestDataLayer";
import {ISuggestions} from "../../newRequest/api/requests/GetOrganisationSuggestionsRequest";
import {useProfile} from "../../app/hooks/useProfile";
import {IClaimsItemResponse, IClaimStatus, TClaimAction} from "../../classes/claim/Claim.Types";
import {datetimeUtils} from "../../core/utils/datetimeUtils";

interface ClaimRowData {
    key: React.Key;
    id: string; //120
    name: string; //"Жалоба на врача"
    createdDate: string; // "2023-06-12 16:52:48.343"
    status: IClaimStatus; //"RESOLVED"
    text: string; //"Колоноскопия прошла не успешно - я обосрался"
    isRowExpandable: boolean;
    actions: TClaimAction[];
}

const Claims: FC = () => {
    const navigate = useNavigate();
    //
    const {clientInfo, isProfileLoading} = useProfile();
    const [claims, setClaims] = useState<IClaimsItemResponse[]>([]);
    const [rows, setRows] = useState<ClaimRowData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        // requestClaims();
        if (!isProfileLoading && clientInfo) {
            getClaims();
        }
    }, [isProfileLoading, clientInfo])

    const getClaims = () => {
        testRequestClaims()
            .then((claimItems: IClaimsItemResponse[]) => {
                setClaims(claimItems);
                createTableRows(claimItems);
                setLoading(false);
            })
            .catch((e) => {
                console.log('нет обращений', e);
                setLoading(false);
            })
    }

    const testRequestClaims = (): Promise<IClaimsItemResponse[]> => {
        setLoading(true);
        return new Promise((resolve, reject) => {
            const existedClaimsString = localStorage.getItem('user_requests');

            let existedClaimsArray: IClaimsItemResponse[] = [];

            try {
                if (existedClaimsString) {
                    const parsedRegUsers: IClaimsItemResponse[] = JSON.parse(existedClaimsString) || [];

                    if (parsedRegUsers?.length) {
                        existedClaimsArray.push(...parsedRegUsers);
                    }
                }
            } catch (e) {
                console.error('Cannot parse user_requests in HomePage Claims -> existedClaimsString', existedClaimsString);
            }

            if (!existedClaimsArray.length) {
                reject();
                return;
            }

            if (!clientInfo.integrationId) {
                resolve(existedClaimsArray);
                return;
            }

            const resultArr: IClaimsItemResponse[] = [];

            existedClaimsArray.forEach((request) => {
                const organisation = request.organisation;
                if (isSuggestion(organisation) && organisation.id === clientInfo.integrationId) {
                    resultArr.push(request);
                }
            });

            resolve(resultArr);
        })
    }

    const isSuggestion = (info: IOrganisationData): info is ISuggestions => {
        return info && Boolean((info as ISuggestions).data) && Boolean((info as ISuggestions).value)
    }

    const onAllAppealsClick = () => {
        navigate('/mySpace/myRequests')
    }

    const createTableRows = useCallback((claimItems: IClaimsItemResponse[]) => {
        if (!claimItems.length) return null;

        const rowsArray: ClaimRowData[] = claimItems.map((item) => {
            return {
                key: item.id,
                id: item.id,
                name: item.name,
                createdDate: datetimeUtils.formatTime(item.createdDate, 'DD.MM.YYYY'),
                status: item.status,
                text: item.text,
                isRowExpandable: !!item.text,
                actions: item.actions
            }
        })

        setRows(rowsArray);
    }, [])

    const requestClaims = useCallback(async () => {
        const sessionId = localStorage.getItem('id');
        if (!sessionId) return;
        setLoading(true);
        try {
            const response = await getClaimsRequest(sessionId);
            if (response) {
                console.log('res', response)
                setClaims(response.claims);
                // createTableRows();
                setLoading(false);
            }
        } catch (err) {
            console.log('err')
            setLoading(false);
        }
    }, [createTableRows])

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
            case IClaimStatus.created: {
                return (
                    <Tag color='geekblue'>Создано</Tag>
                )
            }
            case IClaimStatus.inProcess: {
                return (
                    <Tag color='blue'>В процессе</Tag>
                )
            }
            case IClaimStatus.underConsideration: {
                return (
                    <Tag color='blue'>На рассмотрении</Tag>
                )
            }
            case IClaimStatus.waitingForAction: {
                return (
                    <Tag color='orange'>Требуется действие</Tag>
                )
            }
            default: {
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
        navigate(`/mySpace/myRequests/${id}`)
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
                dataSource={rows}
                loading={loading}
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