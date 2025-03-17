import { Roles } from "./roles";
import { stringUtils } from "core/utils";
import NBSP = stringUtils.NBSP;

export enum MySpaceMenuPathname {
    Home = "/mySpace/dashboard",
    // для юзера
    Category = '/mySpace/category',
    MyClaims = '/mySpace/claims',
    MyClaimItem = '/mySpace/laims/:id',
    NewClaim = '/mySpace/newClaim',
    // для копании
    Inbox = '/mySpace/inbox',
    Analytics = '/mySpace/analytics',
    // для юриста
    AllClaims = '/mySpace/allClaims',
    //
    Notifications = '/mySpace/notifications'
}

export interface IMenuLink {
    pathName: MySpaceMenuPathname;
    caption: string;
    checkSubscription?: boolean;
}

export interface IMenuLinksObject {
    links: IMenuLink[];
}

export type MenuLinksPermissionsMap = {
    [role in Roles]: IMenuLinksObject;
}

// перечисление элементов меню для каждой роли
export const MENU_LINKS: MenuLinksPermissionsMap = {
    [Roles.USER]: {
        links: [
            { caption: 'Главная', pathName: MySpaceMenuPathname.Home },
            { caption: 'Категории', pathName: MySpaceMenuPathname.Category },
            { caption: `Мои${NBSP}обращения`, pathName: MySpaceMenuPathname.MyClaims },
            { caption: `Новое${NBSP}обращение`, pathName: MySpaceMenuPathname.NewClaim },
            { caption: 'Уведомления', pathName: MySpaceMenuPathname.Notifications },
        ]
    },
    [Roles.COMPANY]: {
        links: [
            { caption: 'Главная', pathName: MySpaceMenuPathname.Home },
            { caption: `Входящие${NBSP}обращения`, pathName: MySpaceMenuPathname.Inbox },
            { caption: 'Аналитика', pathName: MySpaceMenuPathname.Analytics, checkSubscription: true },
            { caption: 'Уведомления', pathName: MySpaceMenuPathname.Notifications },
        ]
    },
    [Roles.LAWYER]: {
        links: [
            { caption: 'Главная', pathName: MySpaceMenuPathname.Home },
            { caption: 'Все обращения', pathName: MySpaceMenuPathname.AllClaims },
            { caption: 'Мои обращения', pathName: MySpaceMenuPathname.MyClaims },
            { caption: 'Уведомления', pathName: MySpaceMenuPathname.Notifications },
        ]
    },
    [Roles.ADMIN]: {
        links: [
            { caption: 'Главная', pathName: MySpaceMenuPathname.Home },
            { caption: 'Категории', pathName: MySpaceMenuPathname.Category },
            { caption: 'Все обращения', pathName: MySpaceMenuPathname.AllClaims },
            { caption: `Мои${NBSP}обращения`, pathName: MySpaceMenuPathname.MyClaims },
            { caption: `Новое${NBSP}обращение`, pathName: MySpaceMenuPathname.NewClaim },
            { caption: `Входящие${NBSP}обращения`, pathName: MySpaceMenuPathname.Inbox },
            { caption: 'Аналитика', pathName: MySpaceMenuPathname.Analytics, checkSubscription: false },
            { caption: 'Уведомления', pathName: MySpaceMenuPathname.Notifications }
        ]
    }
}