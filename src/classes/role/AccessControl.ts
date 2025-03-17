import { IClaimStatus } from "classes/claim/Claim.Types";
import { Instance } from "core/entity";
import { RuntimeError } from "core/errors";
import { STATUS_PERMISSIONS } from "./statusList";
import { IMenuLink, MENU_LINKS } from "./menuLinks";
import { Roles } from "./roles";
  
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

// словарь, задающий разрешения для каждой роли. При необходимости можно расширять список действий
const PERMISSIONS: PermissionsMap = {
    [Roles.USER]: {
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

// класс, инкапсулирующий работу с ролями и разрешениями
export class AccessControl {
    // текущая роль пользователя
    private currentRole: Roles;

    constructor() {
        this.currentRole = null;
    }

    // синглтон
    public static get instance() {
        return Instance.getOrCreate<AccessControl>(AccessControl, 'AccessControl');
    }

    // геттер для текущей роли
    public getRole = (): Roles => {
        return this.currentRole;
    }

    // метод для смены роли
    public setRole = (newRole: Roles) => {
        this.currentRole = newRole;
    }

    // проверяем, имеет ли текущая роль доступ к нужному действию
    public can = (permission: PermissionKey): boolean => {
        if (!this.currentRole) {
            throw new RuntimeError('AccessControl.can: ROLE is not defined');
        }
        return PERMISSIONS[this.currentRole][permission];
    }

    // возращает статусы обращения для текущей роли 
    public get claimStatusesList(): IClaimStatus[] {
        if (!this.currentRole) {
            throw new RuntimeError('AccessControl.statusesList: ROLE is not defined');
        }
        return STATUS_PERMISSIONS[this.currentRole].statusesList;
    }

    // возвращает элементы меню для текущей роли
    public get menuLinks(): IMenuLink[] {
        if (!this.currentRole) {
            throw new RuntimeError('AccessControl.menuLinks: ROLE is not defined');
        }
        return MENU_LINKS[this.currentRole].links;
    }
}
