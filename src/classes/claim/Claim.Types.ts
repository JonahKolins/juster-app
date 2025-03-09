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

export enum ActionType {
    claimCreated = 'CLAIM_CREATED',
    statusChanged = 'STATUS_CHANGED',
    addDocs = 'ADD_DOCS'
}

export enum ClaimType {
    action = 'ACTION',
    message = 'MESSAGE'
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
        status: IClaimStatus;
        actions: IAction[];
    };
}

export interface IMinRespondentData {
    inn: string;
    name: string;
    address: string;
}

export interface IAction {
    text: string;
    status: IClaimStatus;
    type: ClaimType;
    actionType: ActionType;
    user: {
        firstName: string;
        lastName: string;
    };
    createdAt: string; // TODO нужно переделать на число
}


export interface IClaimsPublicItem {
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
        status: IClaimStatus;
        actions: IAction[];
        user: {
            firstName: string;
            lastName: string;
            verified: boolean;
        };
    };
}