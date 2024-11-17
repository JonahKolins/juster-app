import React, {useEffect, useState} from "react";
import styles from "./MyRequestsPage.module.sass";
import {LoaderCircle} from "../../../designSystem/loader/Loader.Circle";
import {ISuggestions} from "../../../newRequest/api/requests/GetOrganisationSuggestionsRequest";
import {formats} from "../../../requestItem/textEditor/EditorToolbar";
import ReactQuill from "react-quill";
import {IOrganisationData} from "../../../newRequest/NewRequestDataLayer";
import {useNavigate} from "react-router-dom";
import {ScrollBarVisibility} from "../../../controls/scrollArea";
import {ScrollablePanel} from "../../../controls/panel/ScrollablePanel";
import {Tabs, TabsProps, Tag} from "antd";
import {useProfile} from "../../../app/hooks/useProfile";
import {IClaimsItemResponse, IClaimStatus} from "../../../classes/claim/Claim.Types";

enum IRequestsPageId {
    inbox = 'inbox',
    sent = 'sent'
}

const MyRequestsPage = () => {
    const navigate = useNavigate();
    //
    const {clientInfo} = useProfile();
    const [isReady, setIsReady] = useState<boolean>(false);
    const [requests, setRequests] = useState<IClaimsItemResponse[]>([]);
    const [currentPageId, setCurrentPageId] = useState<IRequestsPageId>(IRequestsPageId.inbox);

    useEffect(() => {
        setIsReady(false);
        getAllClaims()
            .then((data: IClaimsItemResponse[]) => {
                if (!data?.length) {
                    setIsReady(true);
                    setRequests([]);
                    return;
                }
                setRequests(data);
                setIsReady(true);
            })
            .catch((e) => {
                console.log('нет обращений', e);
                setIsReady(true);
            })
    }, [currentPageId])

    const getAllClaims = (): Promise<IClaimsItemResponse[]> => {
        return new Promise((resolve, reject) => {
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
                console.error('Cannot parse user_requests in MyRequests -> existedRequestsString', existedRequestsString);
            }

            if (!existedRequestsArray.length) {
                reject();
                return;
            }

            window.setTimeout(() => {
                resolve(existedRequestsArray);
            }, 300)
        })
    }

    const getInboxes = (): IClaimsItemResponse[] => {
        if (!requests) return [];

        // TODO придумать определение партнера
        if (!clientInfo.integrationId) return requests;

        const resultArr: IClaimsItemResponse[] = [];

        requests.forEach((request) => {
            const organisation = request.organisation;
            if (isSuggestion(organisation) && organisation.id === clientInfo.integrationId) {
                resultArr.push(request);
            }
        });

        return resultArr;
    }

    const getSentRequests = (): IClaimsItemResponse[] => {
        //TODO сделать исходящие обращения для компании
        return []
    }

    const renderOrg = (name: string, address: string, inn: string) => {
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

    const handleRequestClick = (id: string) => {
        navigate(`/mySpace/myRequests/${id}`)
    }

    const isSuggestion = (info: IOrganisationData): info is ISuggestions => {
        return info && Boolean((info as ISuggestions).data) && Boolean((info as ISuggestions).value)
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

    const renderRequests = (items: IClaimsItemResponse[]): React.JSX.Element => {
        return (
            <>
                {items.map((requestItem: IClaimsItemResponse, index) => {
                    const firstIndex = requestItem.text.indexOf('<p>');
                    const lastIndex = requestItem.text.indexOf('</p>');
                    const shortDescription = requestItem.text.slice(firstIndex, lastIndex + 4);

                    return (
                        <div key={`${requestItem.id}_${index}`} className={styles['request']}>
                            {requestItem.status && (
                             <div className={styles['status']}>
                                 {renderStatusTag(requestItem.status)}
                             </div>
                            )}
                            <div
                                className={styles['caption']}
                                onClick={() => handleRequestClick(requestItem.id)}
                            >
                                {requestItem.reason.text}
                            </div>
                            <div className={styles['name']}>Куда</div>
                            {requestItem.organisation && isSuggestion(requestItem.organisation)
                                ? renderOrg(requestItem.organisation.value, requestItem.organisation.data.address.value, requestItem.organisation.data.inn)
                                : null
                            }
                            <div className={styles['name']}>Описание</div>
                            <ReactQuill
                                className={styles['text']}
                                theme="snow"
                                value={shortDescription || '...'}
                                formats={formats}
                                modules={{toolbar: null}}
                                readOnly={true}
                            />
                            <div className={styles['comments']}>Комментарии: {requestItem.actions?.length ? requestItem.actions.length : 0}</div>
                        </div>
                    )
                })}
            </>
        );
    }

    const renderInbox = () => {
        if (!isReady) return null;

        const inboxes = getInboxes();
        return (
            <div className={styles['requests-container']}>
                {!!requests.length
                    ? renderRequests(inboxes)
                    : <div>У вас пока что нет обращений</div>
                }
            </div>
        )
    }

    const renderSent = () => {
        if (!isReady) return null;

        const sentRequests = getSentRequests();
        return (
            <div className={styles['requests-container']}>
                {!!sentRequests.length
                    ? renderRequests(sentRequests)
                    : <div>У вас пока что нет обращений</div>
                }
            </div>
        )
    }

    const items: TabsProps['items'] = [
        { key: IRequestsPageId.inbox, label: 'Входящие', children: renderInbox() },
        { key: IRequestsPageId.sent, label: 'Отправленные', children: renderSent() },
    ];

    const handleTabsChange = (key: IRequestsPageId) => {
        setCurrentPageId(key);
    }

    const isPageReady = !!clientInfo && isReady;

    return (
        <>
            {!isPageReady && <LoaderCircle />}
            <ScrollablePanel
                vScroll={ScrollBarVisibility.autoWhenScrollOverArea}
                hScroll={ScrollBarVisibility.auto}
            >
                <div className={styles['my-requests']}>
                    <div className={styles['list']}>
                        {/* TODO придумать определение партнера */}
                        {clientInfo?.integrationId
                            ?  (
                                <Tabs
                                    defaultActiveKey={IRequestsPageId.inbox}
                                    items={items}
                                    onChange={handleTabsChange}
                                    rootClassName={styles['tabs']}
                                />
                            )
                            : (
                                <>
                                    <div className={styles['title']}>Мои обращения</div>
                                    {renderInbox()}
                                </>
                            )
                        }
                    </div>
                </div>
            </ScrollablePanel>
        </>
    );
}

export default MyRequestsPage;