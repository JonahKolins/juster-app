import React, {useEffect, useState} from "react";
import styles from "./MyRequestsPage.module.sass";
import {LoaderCircle} from "../../../designSystem/loader/Loader.Circle";
import {ISuggestions} from "../../../newRequest/api/requests/GetOrganisationSuggestionsRequest";
import {IFullRequestInfo} from "../../../newRequest/newRequestForm/parts/newRequestFinalPart/NewRequestFinalPart";
import {formats} from "../../../requestItem/textEditor/EditorToolbar";
import ReactQuill from "react-quill";
import {IOrganisationData} from "../../../newRequest/NewRequestDataLayer";
import {useNavigate} from "react-router-dom";
import {ScrollBarVisibility} from "../../../controls/scrollArea";
import {ScrollablePanel} from "../../../controls/panel/ScrollablePanel";
import {Tabs, TabsProps} from "antd";
import {useProfile} from "../../../app/hooks/useProfile";

enum IRequestsPageId {
    inbox = 'inbox',
    sent = 'sent'
}

const MyRequestsPage = () => {
    const navigate = useNavigate();
    //
    const {clientInfo} = useProfile();
    const [isReady, setIsReady] = useState<boolean>(false);
    const [requests, setRequests] = useState<IFullRequestInfo[]>([]);
    const [currentPageId, setCurrentPageId] = useState<IRequestsPageId>(IRequestsPageId.inbox);

    useEffect(() => {
        setIsReady(false);
        getAllClaims()
            .then((data: IFullRequestInfo[]) => {
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

    const getAllClaims = (): Promise<IFullRequestInfo[]> => {
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

    const getInboxes = (): IFullRequestInfo[] => {
        if (!requests) return [];

        // TODO придумать определение партнера
        if (!clientInfo.integrationId) return requests;

        const resultArr: IFullRequestInfo[] = [];

        requests.forEach((request) => {
            const organisation = request.org;
            if (isSuggestion(organisation) && organisation.id === clientInfo.integrationId) {
                resultArr.push(request);
            }
        });

        return resultArr;
    }

    const getSentRequests = (): IFullRequestInfo[] => {
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

    const renderRequests = (items: IFullRequestInfo[]): React.JSX.Element => {
        return (
            <>
                {items.map((requestItem: IFullRequestInfo, index) => {
                    const statusMessage = requestItem.status === 'created' ? 'Создано' : 'Другой';

                    const firstIndex = requestItem.requestText.indexOf('<p>');
                    const lastIndex = requestItem.requestText.indexOf('</p>');
                    const shortDescription = requestItem.requestText.slice(firstIndex, lastIndex + 4);

                    return (
                        <div key={`${requestItem.id}_${index}`} className={styles['request']}>
                            {requestItem.status && <div className={styles['status']}>{statusMessage}</div>}
                            <div
                                className={styles['caption']}
                                onClick={() => handleRequestClick(requestItem.id)}
                            >
                                {requestItem.reason.text}
                            </div>
                            <div className={styles['name']}>Куда</div>
                            {isSuggestion(requestItem.org)
                                ? renderOrg(requestItem.org.value, requestItem.org.data.address.value, requestItem.org.data.inn)
                                : renderOrg(requestItem.org.name, requestItem.org.address, requestItem.org.inn)
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
                            <div className={styles['comments']}>Комментарии: {requestItem.comments?.length ? requestItem.comments.length : 0}</div>
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