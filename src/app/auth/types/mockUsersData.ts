import { ActionType, IClaimReason, IClaimStatus } from "classes/claim/Claim.Types";
import {IUser, UserRole} from "./types";
import { IOrganisationData } from "newRequest/NewRequestDataLayer";

export interface IMockUsersData {
    users: {
        clients: IUser[],
        partners: IUser[],
        lawyers: IUser[],
        admins: IUser[]
    };
}

export const mockUsersData: IMockUsersData = {
    users: {
        clients: [
            {id: '', role: UserRole.client, email: 'test@test.com'},
            {id: '', role: UserRole.client, email: 'optimus@test.com'},
        ],
        partners: [
            {id: '', role: UserRole.partner, email: 'yandex@test.com'},
            {id: '', role: UserRole.partner, email: 'sber@test.com'},
        ],
        lawyers: [
            {id: '', role: UserRole.lawyer, email: 'lawyer1@test.com'},
            {id: '', role: UserRole.lawyer, email: 'lawyer2@test.com'},
        ],
        admins: [
            {id: '', role: UserRole.admin, email: 'admin1@test.com'},
            {id: '', role: UserRole.admin, email: 'admin2@test.com'},
        ]
    }
}

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

export interface IClaimAction extends IClaimActionBase {
    actionType: ActionType;
    status?: IClaimStatus;
}

export interface IClaimMessage extends IClaimActionBase {}

export type TClaimAction = IClaimAction | IClaimMessage;