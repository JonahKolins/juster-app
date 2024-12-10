import React, {useEffect, useState} from "react";
import styles from "./MyClaimsPage.module.sass";
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
import {IClaimsItem, IClaimsItemResponse, IClaimStatus} from "../../../classes/claim/Claim.Types";
import {useClaims} from "../../../app/hooks/useClaims";
import classNames from "classnames";
import { BsChevronRight } from "react-icons/bs";
import { RiMessage3Line } from "react-icons/ri";
import Button from "../../../designSystem/button/Button";
import { IoAdd } from "react-icons/io5";
import ClaimPreview from "./ClaimPreview";

enum IRequestsPageId {
    inbox = 'inbox',
    sent = 'sent'
}

const MyClaimsPage = () => {
    const navigate = useNavigate();
    //
    // const {clientInfo} = useProfile();
    const {claims, isClaimsLoading, isClaimsReady} = useClaims();
    //
    const [currentPreview, setCurrentPreview] = useState<IClaimsItem>(null);

    useEffect(() => {
        if (claims?.length && currentPreview == null) {
            const firstClaim: IClaimsItem = claims[0];
            setCurrentPreview(firstClaim);
        }
    }, [claims, currentPreview])

    // const getInboxes = (): IClaimsItem[] => {
    //     if (!claims) return [];
    //
    //     // TODO придумать определение партнера
    //     if (!clientInfo?.integrationId) return claims;
    //
    //     const resultArr: IClaimsItem[] = [];
    //
    //     claims.forEach((claim) => {
    //         const organisation = claim.organisation;
    //         if (isSuggestion(organisation) && organisation.id === clientInfo?.integrationId) {
    //             resultArr.push(claim);
    //         }
    //     });
    //
    //     return resultArr;
    // }

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


    const handleListItemClick = (claimsItem: IClaimsItem) => {
        setCurrentPreview(claimsItem);
    }

    const renderRequests = (items: IClaimsItem[]): React.JSX.Element => {
        return (
            <>
                {items.map((claimsItem: IClaimsItem, index) => {
                    const firstIndex = claimsItem.text.indexOf('<p>');
                    const lastIndex = claimsItem.text.indexOf('</p>');
                    const shortDescription = claimsItem.text.slice(firstIndex, lastIndex + 4) || claimsItem.text;

                    return (
                        <div
                            key={`${claimsItem.id}_${index}`}
                            className={classNames(
                                styles['list-item'],
                                currentPreview?.id == claimsItem.id && styles['_selected']
                            )}
                            onClick={() => handleListItemClick(claimsItem)}
                        >
                            <div className={styles['chevron']}>
                                <BsChevronRight className={styles['icon']} />
                            </div>
                            <div
                                className={styles['list-item-caption']}
                                onClick={() => handleRequestClick(claimsItem.id)}
                            >
                                {claimsItem.reason.text}
                            </div>
                            {shortDescription && (
                                <div className={styles['list-item-text']} dangerouslySetInnerHTML={{__html: shortDescription}} />
                            )}
                            <div className={styles['list-item-actions']}>
                                <div className={styles['comments']}>
                                    <RiMessage3Line className={styles['icon']} />
                                    <span className={styles['number']}>{claimsItem.actions?.length ? claimsItem.actions.length : 0}</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </>
        );
    }

    const renderCreateNew = () => {
        return (
            <div className={styles['new-offer']}>
                <div
                    className={classNames(styles['list-item'], styles['_add'])}
                    onClick={() => navigate('/mySpace/newRequest')}
                >
                    <div className={classNames(styles['chevron'], styles['_add'])}>
                        <IoAdd className={styles['add-icon']} />
                    </div>
                    <div className={styles['create-caption']}>
                        Создать новое обращение
                    </div>
                    <div className={styles['create-text']}>
                        5 простых шагов
                    </div>
                </div>
            </div>
        )
    }

    const renderSkeletonListItems = () => {
        const items = [1, 2, 3, 4, 5, 6, 7];
        return (
            <>
                {items.map((claimsItem: number, index) => {
                    return (
                        <div
                            key={`${claimsItem}_${index}`}
                            className={classNames(
                                styles['skeleton-list-item']
                            )}
                        >
                            <div className={styles['skeleton-list-item-caption']}></div>
                            <div className={styles['skeleton-list-item-text']}></div>
                            <div className={styles['skeleton-list-item-actions']}></div>
                        </div>
                    )
                })}
            </>
        )
    }

    const renderInbox = () => {
        if (!isClaimsReady && !isClaimsLoading && !claims?.length) {
            return (
              <>
                  <div className={styles['no-list-items']}>У вас пока что нет обращений</div>
                  {renderCreateNew()}
              </>
            )
        }

        if (isClaimsLoading || !isClaimsReady) {
            return renderSkeletonListItems();
        }

        const inboxes = claims || [];
        return (
            <>
                {!!inboxes.length
                    ? renderRequests(inboxes)
                    : <div className={styles['no-list-items']}>У вас пока что нет обращений</div>
                }
                {renderCreateNew()}
            </>
        )
    }

    const renderSent = () => {
        if (isClaimsLoading) {
            // TODO skeleton
            return <div>загрузка</div>
        }

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

    return (
        <div className={styles['my-claims-container']}>
            <div className={styles['all-claims']}>
                <ScrollablePanel
                    vScroll={ScrollBarVisibility.autoWhenScrollOverArea}
                    hScroll={ScrollBarVisibility.none}
                >
                    <div className={styles['claims-list']}>
                        <div className={styles['title']}>Мои обращения</div>
                        {renderInbox()}
                    </div>
                </ScrollablePanel>
            </div>
            <div className={styles['claim-preview']}>
                <ScrollablePanel
                    vScroll={ScrollBarVisibility.autoWhenScrollOverArea}
                    hScroll={ScrollBarVisibility.none}
                >
                    {isClaimsLoading
                        ? <div>preview skeleton</div>
                        : <ClaimPreview claim={currentPreview} showExample={!claims.length} />
                    }
                </ScrollablePanel>
            </div>
        </div>
    );
}

export default MyClaimsPage;