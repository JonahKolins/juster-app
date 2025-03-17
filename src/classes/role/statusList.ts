import { IClaimStatus } from "classes/claim/Claim.Types";
import { Roles } from "./roles";

export type StatusPermissionKey = 'statusesList';
export type IStatusPermissionOption = IClaimStatus[];

export type StatusPermissionsMap = {
    [role in Roles]: Record<StatusPermissionKey, IStatusPermissionOption>;
}

// перечисление статусов, которые доступны каждой роли (это статусы, которые роль может применить к жалобе)
// то есть те, которые отображаются в дропдауне на странице жалобы
export const STATUS_PERMISSIONS: StatusPermissionsMap = {
    [Roles.CLIENT]: {
        statusesList: [
            IClaimStatus.resolved,
            IClaimStatus.deleted,
        ]
    },
    [Roles.COMPANY]: {
        statusesList: [
            IClaimStatus.open,
            IClaimStatus.inProgress,
            IClaimStatus.needInfo,
            IClaimStatus.waitingForAction,
            IClaimStatus.resolved,
            IClaimStatus.declined
        ]
    },
    [Roles.LAWYER]: {
        statusesList: [
            IClaimStatus.needInfo,
            IClaimStatus.waitingForAction,
            IClaimStatus.resolved,
            IClaimStatus.deleted,
            IClaimStatus.declined
        ]
    },
    [Roles.ADMIN]: {
        statusesList: [
            IClaimStatus.draft,
            IClaimStatus.new,
            IClaimStatus.open,
            IClaimStatus.inProgress,
            IClaimStatus.needInfo,
            IClaimStatus.waitingForAction,
            IClaimStatus.resolved,
            IClaimStatus.deleted,
            IClaimStatus.declined
        ]
    }
}