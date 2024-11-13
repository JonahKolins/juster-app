import React, {FC, useCallback, useEffect, useState} from "react";
import {StatusV2} from "../../pages/mySpacePages/dashboardPage/DashboardPage";
import styles from "./Claims.module.sass";
import {useNavigate} from "react-router-dom";
import getClaimsRequest from "../api/metods/getClaimsRequest";
import {ClaimsItemResponse} from "../api/requests/GetClaimsRequest";
import {Button, Table, Tag} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {getDateFromString} from "../../handlers/getDateFromString";
import {IFullRequestInfo} from "../../newRequest/newRequestForm/parts/newRequestFinalPart/NewRequestFinalPart";
import {IOrganisationData} from "../../newRequest/NewRequestDataLayer";
import {ISuggestions} from "../../newRequest/api/requests/GetOrganisationSuggestionsRequest";
import {useProfile} from "../../app/hooks/useProfile";

interface IUserInfo {
    firstName: string;
    lastName: string;
}

interface IComment {
    createdAt: string;
    id: number;
    text: string;
    user: IUserInfo
}

interface ClaimRowData {
    key: React.Key;
    id: string; //120
    name: string; //"Жалоба на врача"
    createdDate: string; // "2023-06-12 16:52:48.343"
    status: string; //"RESOLVED"
    text: string; //"Колоноскопия прошла не успешно - я обосрался"
    isRowExpandable: boolean;
    comments: IComment[];
}

const Claims: FC = () => {
    const navigate = useNavigate();
    //
    const {clientInfo, isProfileLoading} = useProfile();
    const [claims, setClaims] = useState<ClaimsItemResponse[]>([]);
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
            .then((data: IFullRequestInfo[]) => {
                const claimItems: ClaimsItemResponse[] = data.map((item) => {
                    return {
                        contentType: '',
                        createdDate: '2023-06-12 16:52', // "2023-06-12 16:52:48.343"
                        genId: item.id, //"1e3ec6b0-0d2e-4671-89a1-a637ae4b7986"
                        name: item.reason.text, //"Жалоба на врача"
                        status: StatusV2.new, //"RESOLVED"
                        text: item.requestText, //"Колоноскопия прошла не успешно - я обосрался"
                        comments: item.comments || []
                    }
                })
                setClaims(claimItems);
                createTableRows(claimItems);
                setLoading(false);
            })
            .catch((e) => {
                console.log('нет обращений', e);
                setLoading(false);
            })
    }

    const testRequestClaims = (): Promise<IFullRequestInfo[]> => {
        setLoading(true);
        return new Promise((resolve, reject) => {
            const existedRequestsString = localStorage.getItem('user_requests');
            let existedRequestsArray: IFullRequestInfo[] = [];
            try {
                if (existedRequestsString) {
                    const parsedRegUsers: IFullRequestInfo[] = JSON.parse(existedRequestsString) || [];

                    if (parsedRegUsers?.length) {
                        existedRequestsArray.push(...parsedRegUsers);
                    }
                }
            } catch (e) {
                console.error('Cannot parse user_requests in HomePage Claims -> existedRequestsString', existedRequestsString);
            }

            if (!existedRequestsArray.length) {
                reject();
                return;
            }

            if (!clientInfo.integrationId) {
                resolve(existedRequestsArray);
                return;
            }

            const resultArr: IFullRequestInfo[] = [];

            existedRequestsArray.forEach((request) => {
                const organisation = request.org;
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

    const createTableRows = useCallback((claimItems: ClaimsItemResponse[]) => {
        if (!claimItems.length) return null;

        const rowsArray: ClaimRowData[] = claimItems.map((item) => {
            return {
                key: item.genId,
                id: item.genId,
                name: item.name,
                createdDate: getDateFromString(item.createdDate),
                status: item.status,
                text: item.text,
                isRowExpandable: !!item.text,
                comments: item.comments
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

    // useEffect( () => {
    //     requestClaims();
    // }, [JSON.stringify(claims)])

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

    const renderStatusTag = (status: string): JSX.Element => {
        switch (status) {
            case StatusV2.resolved: {
                return (
                    <Tag color='green'>Готово</Tag>
                )
            }
            case StatusV2.decline: {
                return (
                    <Tag color='volcano'>Отклонено</Tag>
                )
            }
            case StatusV2.new: {
                return (
                    <Tag color='geekblue'>Создано</Tag>
                )
            }
            case StatusV2.inProcess: {
                return (
                    <Tag color='blue'>В процессе</Tag>
                )
            }
            case 'NEED_INFO':
            case StatusV2.waitingForAction: {
                return (
                    <Tag color='orange'>Требуется действие</Tag>
                )
            }
            default: return <Tag color='geekblue'>{status}</Tag>
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
                <div className={styles['expand-data']}>{claimRowData.comments.length} ответов</div>
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