import React, {FC} from "react";
import styles from "./DashboardPage.module.sass";
import Claims from "../../../mainPageSections/claims/Claims";
import RightSideBar from "../../../mainPageSections/rightSideBar/RightSideBar";
import {ScrollBarVisibility} from "../../../controls/scrollArea";
import {ScrollablePanel} from "../../../controls/panel/ScrollablePanel";

export enum Status {
    success = "Решено",
    inProcess = "В процессе",
    sent = "Отправлено",
    verification = "Верификация",
    waitingForAction = 'Требудется действие'
}

export enum StatusV2 {
    resolved = "RESOLVED",
    new = "NEW",
    decline = "DECLINE",
    inProcess = "IN_PROCESS",
    waitingForAction = 'WAIT_FOR_ACTION'
}

export enum NotificationsTitle {
    success = "Обращение решено",
    newStatus = "Новый статус обращения",
    sent = "Обращение отправлено"
}

export interface IAppeals {
    id: number
    date: string
    title: string
    description: string
    shortDescription: string
    status: Status
}

export interface INotifications {
    id: number
    sentTime: string
    title: NotificationsTitle
    isRead: boolean
}

const DashboardPage: FC = () => {

    const notificationsFromServer: Array<INotifications> = [
        {id: 10001, sentTime: '2 мин назад', title: NotificationsTitle.sent, isRead: false},
        {id: 10002, sentTime: '5 мин назад', title: NotificationsTitle.success, isRead: false},
        {id: 10003, sentTime: '30 мин назад', title: NotificationsTitle.newStatus, isRead: false},
        {id: 10004, sentTime: '1 ч назад', title: NotificationsTitle.newStatus, isRead: true},
        {id: 10005, sentTime: '2 ч назад', title: NotificationsTitle.sent, isRead: true},
    ]

    return (
        <ScrollablePanel
            vScroll={ScrollBarVisibility.autoWhenScrollOverArea}
            hScroll={ScrollBarVisibility.auto}
        >
            <div className={styles['status-container']}>
                <div className={styles['status-item']}>
                    <div className={styles['status-item-caption']}>Всего обращений</div>
                    <div className={styles['status-item-number']}>98</div>
                </div>
                <div className={styles['status-item']}>
                    <div className={styles['status-item-caption']}>Создано</div>
                    <div className={styles['status-item-number']}>10</div>
                </div>
                <div className={styles['status-item']}>
                    <div className={styles['status-item-caption']}>На рассмотрении</div>
                    <div className={styles['status-item-number']}>18</div>
                </div>
                <div className={styles['status-item']}>
                    <div className={styles['status-item-caption']}>Решено</div>
                    <div className={styles['status-item-number']}>70</div>
                </div>
            </div>
            <div className={styles['main-section']}>
                <div className={styles['appeals']}>
                    <Claims />
                </div>
                <RightSideBar notifications={notificationsFromServer}/>
            </div>
        </ScrollablePanel>
    );
}

export default DashboardPage;