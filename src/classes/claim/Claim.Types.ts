import {IOrganisationData} from "../../newRequest/NewRequestDataLayer";

type IClaimReasonId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface IClaimReason {
    id: IClaimReasonId;
    text: string;
}

export enum IClaimStatus {
    created = "CREATED",
    underConsideration = 'underConsideration',
    inProcess = "IN_PROCESS",
    waitingForAction = 'WAIT_FOR_ACTION',
    resolved = "RESOLVED",
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
    type: 'action' | 'message';
    id: string;
    createdAt: number;
    text: string;
    user: IUserInfo;
}

export enum IClaimActionType {
    claimCreated = 'claimCreated',
    statusChanged = 'statusChanged',
    addDocs = 'addDocs'
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
}

// TODO переименовать IClaimsItemResponse на IClaimsItem
export interface IClaimsItem extends IClaimsItemResponse {}

export interface INewClaimsItem extends Omit<IClaimsItem, 'id' | 'createdDate'> {}

export const isClaimAction = (obj: TClaimAction): obj is IClaimAction => {
    return (obj as IClaimAction).type == 'action' && !!(obj as IClaimAction).actionType;
}

export const isClaimMessage = (obj: TClaimAction): obj is IClaimMessage => {
    return (obj as IClaimMessage).type == 'message' && !!(obj as IClaimMessage).text;
}