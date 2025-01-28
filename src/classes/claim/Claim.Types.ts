import {IOrganisationData} from "../../newRequest/NewRequestDataLayer";

export type IClaimReasonId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface IClaimReason {
    id: IClaimReasonId;
    text: string;
}

export enum IClaimStatus {
    draft = 'DRAFT',
    new = 'NEW',
    //
    open = 'OPEN',
    inProgress = 'IN_PROGRESS',
    needInfo = 'NEED_INFO',
    waitingForAction = 'WAIT_FOR_ACTION',
    //
    resolved = 'RESOLVED',
    //
    close = 'CLOSE',
    deleted = 'DELETED',
    declined = "DECLINED"
}

type IUserTitle = {
    id: 'iam' | 'admin' | 'lawyer', // и другие
    value: string;
}

export interface IUserInfo {
    firstName: string;
    lastName?: string;
    title?: IUserTitle;
}

export interface IComment {
    createdAt: string;
    id: number;
    text: string;
    user: IUserInfo
}

interface IClaimActionBase {
    type: 'ACTION' | 'MESSAGE';
    id: string;
    createdAt: number;
    text: string;
    user: IUserInfo;
}

export enum IClaimActionType {
    claimCreated = 'CLAIM_CREATED',
    statusChanged = 'CLAIM_STATUS_CHANGED',
    addDocs = 'ADD_DOCS'
}

export interface IClaimAction extends IClaimActionBase {
    actionType: IClaimActionType;
    status?: IClaimStatus;
}

export interface IClaimMessage extends IClaimActionBase {}

export type TClaimAction = IClaimAction | IClaimMessage;

export interface IClaimsItemResponse {
    id: string;
    name: string;
    status: IClaimStatus;
    text: string;
    reason: IClaimReason;
    organisation: IOrganisationData;
    createdDate: number;
    files: any[];
    actions: TClaimAction[];
    partnerId?: string;
}

export interface IClaimsItem {
    genId: string;
    claimInfo: {
        createdAt: number;
        lastUpd: number;
        claimName: string;
        recipientInn: string;
        recipientName: string;
        recipientAddress: string;
        recipientEmail: string;
        contentType: string;
        contentSum: string;
        textClaim: string;
        status: string;
        comments: any[];
    };
}

export interface IMinRespondentData {
    inn: string;
    name: string;
    address: string;
}

export const isClaimAction = (obj: TClaimAction): obj is IClaimAction => {
    return (obj as IClaimAction).type == 'ACTION' && !!(obj as IClaimAction).actionType;
}

export const isClaimMessage = (obj: TClaimAction): obj is IClaimMessage => {
    return (obj as IClaimMessage).type == 'MESSAGE' && !!(obj as IClaimMessage).text;
}