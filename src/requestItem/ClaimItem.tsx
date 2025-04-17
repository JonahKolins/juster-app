import React, {memo, useEffect, useState} from "react";
import {useParams} from "react-router";
import styles from "./ClaimItem.module.sass";
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
import {ActionType, ClaimType, IClaimsItem, IClaimStatus} from "../classes/claim/Claim.Types";
import {ApiError, NetworkError} from "../core/errors";
import {IClaimInfoContext, withClaimInfoHOC} from "./withClaimInfo";
import { IClaimActionRequestInfo } from "cmd/network/claims/methods/requestAddClaimAction";
import { useClaims } from "app/hooks/useClaims";

interface ClaimItemProps extends IClaimInfoContext {}

const ClaimItem = memo<ClaimItemProps>(({manager}) => {
    const {id} = useParams();
    console.log('ClaimItem - id parameter:', id);
    const {clientInfo} = useProfile();
    // const {claims} = useClaims();
    //
    const [data, setData] = useState<IClaimsItem>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | NetworkError>(null);

    useEffect(() => {
        if (!id || !manager) return;

        const claimChangedEvent = manager.claimDataChanged.subscribe(handleClaimDataChanged);
        manager.readClaimInfo(id);
        // manager.readClaimDocs(id);

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
        const newAction: IClaimActionRequestInfo = {
            text: text,
            type: ClaimType.message,
            actionType: "" as ActionType,
            status: "" as IClaimStatus 
        }
        manager.addAction(newAction);
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
                            <div className={styles.caption}>{data.claimInfo.contentType}</div>
                            <div className={styles.description}>Описание</div>
                            <ReactQuill
                                className={classNames(
                                    styles.description_text
                                )}
                                theme=""
                                onChange={() => {}}
                                value={data.claimInfo.textClaim || ''}
                                formats={formats}
                                modules={{toolbar: null}}
                                readOnly={true}
                            />
                            <div className={styles.attachments}>Вложения</div>
                            <div className={styles.attachment_items}>
                                {data.claimInfo.files?.map((fileInfo) => (
                                    <div className={styles.attach_item}>
                                        {fileInfo.fileName}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <div className={styles.title}>Активность</div>
                            <TextEditor saveComment={handleSaveComment} />
                            <ClaimActions manager={manager} actions={data.claimInfo.actions} id={id}/>
                        </div>
                    </div>
                    <AdditionalInfo
                        id={data.genId}
                        manager={manager}
                        status={data.claimInfo.status as IClaimStatus}
                        author={
                            clientInfo?.firstName || clientInfo?.lastName
                                ? `${clientInfo?.firstName}${NBSP}${clientInfo?.lastName}`
                                : `${clientInfo?.email}`
                        }
                        respondent={{
                            name: data.claimInfo.recipientName,
                            address: data.claimInfo.recipientAddress,
                            inn: data.claimInfo.recipientInn
                        }}
                    />
                </div>
            </DraftCreator>
        </ScrollablePanel>
    )
})

export default withClaimInfoHOC(ClaimItem);