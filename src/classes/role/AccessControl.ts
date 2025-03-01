import { IClaimStatus } from "classes/claim/Claim.Types";
import { RuntimeError } from "core/errors";

// роли в приложении 
export enum Roles {
    CLIENT = 'client',
    COMPANY = 'company',
    LAWYER = 'lawyer',
    ADMIN = 'admin'
  }
  
// перечень строковых ключей для действий, которые нужно проверять в приложении
export type PermissionKey =
| 'canCreateAcountOnSite'
| 'canCreateClaim'
| 'сanReceiveClaim'
| 'canChangeStatus'
| 'canViewAllClaims'
| 'canDeleteAccount'
| 'canDeleteUser';

// тип-объект, где каждый ключ – это роль, а значение – это "карта" из ключа разрешения в булево
export type PermissionsMap = {
    [role in Roles]: Record<PermissionKey, boolean>;
};

export type StatusPermissionKey = 'statusesList';
export type IStatusPermissionOption = IClaimStatus[];

export type StatusPermissionsMap = {
    [role in Roles]: Record<StatusPermissionKey, IStatusPermissionOption>;
}

// словарь, задающий разрешения для каждой роли. При необходимости можно расширять список действий
const PERMISSIONS: PermissionsMap = {
    [Roles.CLIENT]: {
        canCreateAcountOnSite: true,
        canCreateClaim: true,
        сanReceiveClaim: false,
        canChangeStatus: true,
        canViewAllClaims: false,
        canDeleteAccount: true,
        canDeleteUser: false,
    },
    [Roles.COMPANY]: {
        canCreateAcountOnSite: false,
        canCreateClaim: false,
        сanReceiveClaim: true,
        canChangeStatus: true,
        canViewAllClaims: false,
        canDeleteAccount: true,
        canDeleteUser: false,
    },
    [Roles.LAWYER]: {
        canCreateAcountOnSite: false,
        canCreateClaim: false,
        сanReceiveClaim: false,
        canChangeStatus: true,
        canViewAllClaims: false,
        canDeleteAccount: false,
        canDeleteUser: false,
    },
    [Roles.ADMIN]: {
        canCreateAcountOnSite: false,
        canCreateClaim: true,
        сanReceiveClaim: false,
        canChangeStatus: true,
        canViewAllClaims: false,
        canDeleteAccount: false,
        canDeleteUser: true,
    }
};

// перечисление статусов, которые доступны каждой роли (это статусы, которые роль может применить к жалобе)
// то есть те, которые отображаются в дропдауне на странице жалобы
const STATUS_PERMISSIONS: StatusPermissionsMap = {
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

// класс, инкапсулирующий работу с ролями и разрешениями
export class AccessControl {
    // текущая роль пользователя
    private currentRole: Roles;

    constructor(initialRole: Roles) {
        this.currentRole = initialRole;
    }

    // метод для смены роли
    public setRole(newRole: Roles): void {
        this.currentRole = newRole;
    }

    // проверяем, имеет ли текущая роль доступ к нужному действию
    public can(permission: PermissionKey): boolean {
        if (!this.currentRole) {
            throw new RuntimeError('AccessControl.can: ROLE is not defined');
        }
        return PERMISSIONS[this.currentRole][permission];
    }

    // геттер для текущей роли
    public getRole(): Roles {
        return this.currentRole;
    }

    // возращает статусы обращения для текущей роли 
    public claimStatusesList(): IClaimStatus[] {
        if (!this.currentRole) {
            throw new RuntimeError('AccessControl.statusesList: ROLE is not defined');
        }
        return STATUS_PERMISSIONS[this.currentRole].statusesList;
    }
}
