import React, {memo, useEffect, useState} from "react";
import {useParams} from "react-router";
import styles from "./RequestItem.module.sass";
import ClaimActions from "./claimActions/ClaimActions";
import AdditionalInfo from "./additionalInfo/AdditionalInfo";
import TextEditor from "./textEditor/TextEditor";
import DraftCreator from "../newRequest/DraftCreator";
import {LoaderCircle} from "../designSystem/loader/Loader.Circle";
import classNames from "classnames";
import {formats} from "./textEditor/EditorToolbar";
import ReactQuill from "react-quill";
import {ScrollBarVisibility} from "../controls/scrollArea";
import {ScrollablePanel} from "../controls/panel/ScrollablePanel";
import {useProfile} from "../app/hooks/useProfile";
import {stringUtils} from "../core/utils";
import NBSP = stringUtils.NBSP;
import {IClaimMessage, IClaimsItemResponse} from "../classes/claim/Claim.Types";
import {ApiError, NetworkError} from "../core/errors";
import {IClaimInfoContext, withClaimInfoHOC} from "./withClaimInfo";

interface ClaimItemProps extends IClaimInfoContext {}

const ClaimItem = memo<ClaimItemProps>(({manager}) => {
    const {id} = useParams();
    const {clientInfo} = useProfile();
    //
    const [data, setData] = useState<IClaimsItemResponse>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | NetworkError>(null);

    useEffect(() => {
        if (!id || !manager) return;

        const claimChangedEvent = manager.claimDataChanged.subscribe(handleClaimDataChanged);
        manager.readClaimInfo(id);

        return () => {
            manager.dispose();
            claimChangedEvent?.dispose();
        }
    }, [id, manager])

    const handleClaimDataChanged = () => {
        if (!manager) return;
        console.log('manager.claimData', manager.claimData);
        console.log('manager.isLoading', manager.isLoading);

        setData(manager.claimData);
        setIsLoading(manager.isLoading);
        setError(manager.error);
    }

    const handleSaveComment = (text: string) => {
        const newMessageAction: Omit<IClaimMessage, 'id'> = {
            createdAt: new Date().getTime(),
            text: text,
            type: "message",
            user: {
                firstName: clientInfo?.firstName,
                lastName: clientInfo?.lastName
            }
        }
        manager.addAction(newMessageAction);
    }

    if (error) return <div>{error.text}</div>

    return isLoading || !data ? <LoaderCircle /> : (
        <ScrollablePanel
            vScroll={ScrollBarVisibility.autoWhenScrollOverArea}
            hScroll={ScrollBarVisibility.auto}
        >
            <DraftCreator>
                <div className={styles['request-item']}>
                    <div className={styles.main_info}>
                        <div style={{color: '#6B778C', marginBottom: '12px'}}>{`bread > crumbs`}</div>
                        <div className={styles.form}>
                            <div className={styles.caption}>{data.name}</div>
                            <div className={styles.description}>Описание</div>
                            <ReactQuill
                                className={classNames(
                                    styles.description_text
                                )}
                                theme=""
                                onChange={() => {}}
                                value={data.text || ''}
                                formats={formats}
                                modules={{toolbar: null}}
                                readOnly={true}
                            />
                            <div className={styles.attachments}>Вложения</div>
                            <div className={styles.attachment_items}>
                                <div className={styles.attach_item}>
                                    .doc
                                </div>
                                <div className={styles.attach_item}>
                                    .pdf
                                </div>
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <div className={styles.title}>Активность</div>
                            <TextEditor saveComment={handleSaveComment} />
                            {data.actions?.length ? (
                                <ClaimActions actions={data.actions} id={id}/>
                            ) : (
                                <div className={styles.no_activities}>Нет активности</div>
                            )}
                        </div>
                    </div>
                    <AdditionalInfo
                        id={data.id}
                        manager={manager}
                        status={data.status}
                        author={
                            clientInfo?.firstName || clientInfo?.lastName
                                ? `${clientInfo?.firstName}${NBSP}${clientInfo?.lastName}`
                                : `${clientInfo?.email}`
                        }
                        org={data.organisation}
                    />
                </div>
            </DraftCreator>
        </ScrollablePanel>
    )
})

export default withClaimInfoHOC(ClaimItem);