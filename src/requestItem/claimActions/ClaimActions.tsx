import React, {memo} from "react";
import styles from "./ClaimActions.module.sass";
import classNames from "classnames";
import {
    ActionType,
    ClaimType,
    IAction,
    IClaimStatus
} from "../../classes/claim/Claim.Types";
import {datetimeUtils} from "../../core/utils/datetimeUtils";
import {stringUtils} from "../../core/utils";
import NBSP = stringUtils.NBSP;
import { BsStars } from "react-icons/bs";
import { RiMessage3Line } from "react-icons/ri";
import { useProfile } from "app/hooks/useProfile";
import { IClaimInfoContext } from "requestItem/withClaimInfo";

interface ClaimActionsProps extends IClaimInfoContext {
    id: string;
    actions: IAction[];
}

const ClaimActions = memo<ClaimActionsProps>(({ manager, id, actions }) => {
    const {clientInfo} = useProfile();

    const getStatusName = (status: IClaimStatus): string => {
        switch (status) {
            case IClaimStatus.draft: return 'Черновик';
            case IClaimStatus.new: return 'Создано';
            case IClaimStatus.open: return 'На рассмотрении';
            case IClaimStatus.inProgress: return 'В процессе';
            case IClaimStatus.needInfo: return 'Требуется действие';
            case IClaimStatus.resolved: return 'Решено';
            case IClaimStatus.declined: return 'Отклонено';
            default: return '';
        }
    }

    const replacePlaceholdersWithElements = (
        input: string,
        replacements: { [placeholder: string]: React.ReactNode }
    ): React.ReactNode => {
        const regex = /%(\w+)%/g;
        const result: React.ReactNode[] = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(input)) !== null) {
            // Добавляем текст до плейсхолдера
            if (match.index > lastIndex) {
                result.push(input.substring(lastIndex, match.index));
            }

            const placeholder = `%${match[1]}%`;

            if (replacements[placeholder]) {
                // Клонируем элемент и добавляем уникальный ключ
                result.push(
                    React.cloneElement(replacements[placeholder] as React.ReactElement, {
                        key: match.index,
                    })
                );
            } else {
                // Если замена не найдена, оставляем плейсхолдер как есть
                result.push(match[0]);
            }

            lastIndex = regex.lastIndex;
        }

        // Добавляем оставшийся текст
        if (lastIndex < input?.length) {
            result.push(input.substring(lastIndex));
        }

        return result;
    }

    const renderAction = (action: IAction): React.JSX.Element => {
        console.log('renderAction, action', action);

        let text: React.ReactNode = action.text;

        if (action.actionType == ActionType.claimCreated) {
            const actionText = action.text || `Вы создали обращение %date%`;
             // TODO уничтожить этот костыль, нужно чтобы с сервера приходило число
            const formatDate = datetimeUtils.formatTime(new Date(action.createdAt).getTime(), 'DD MMM YYYY в hh:mm')

            text = (
                <span className={styles['action-message']}>
                    {actionText.replace('%date%', '')}
                    <span className={styles['string-dot']}></span>
                    <span className={styles['action-time']}>{formatDate}</span>
                </span>
            )
        }

        if (action.actionType == ActionType.statusChanged) {
            const actionText = action.text || `%user% поменял статус на %status% %date%`;
            // TODO уничтожить этот костыль, нужно чтобы с сервера приходило число
            const formatDate = datetimeUtils.formatTime(new Date(action.createdAt).getTime(), 'DD MMM YYYY в hh:mm');
            const userString = action.user.firstName ? `${action.user.firstName} ${action.user.lastName}` : clientInfo.email;
            const actionTextView = replacePlaceholdersWithElements(actionText, {
                '%user%': <span className={styles['action-user-info']}>{userString}{NBSP}</span>,
                '%status%': <>{NBSP}<span className={styles['status-inline']}>{getStatusName(action.status)}</span></>,
                '%date%': <><span className={styles['string-dot']}></span><span className={styles['action-time']}>{formatDate}</span></>
            })
            text = (
                <span className={styles['action-message']}>
                    {actionTextView}
                </span>
            )
        }


        return (
            <div key={action.createdAt} className={styles['action-item']}>
                <div className={styles['item-from-icon-container']}>
                    <div className={styles['icon']}>
                        <BsStars size={16} />
                    </div>
                </div>
                <div className={styles['item-main-container']}>
                    <div className={styles['item-text']}>
                        {text}
                    </div>
                </div>
            </div>
        )
    }

    const renderMessage = (message: IAction): React.JSX.Element => {
        console.log('renderMessage, message', message);
        
        return (
            <div key={message.createdAt} className={styles['message-container']}>
                <div className={styles['message-container-icon']}>
                    <div className={styles['message-container-icon-background']}>
                        <RiMessage3Line size={16} />
                    </div>
                </div>
                <div className={styles['message-item']}>
                    <div className={styles['message-icon-container']}>
                        <div className={classNames(styles['message-default-user-icon'])}>
                            <div className={styles['first-letter']}>{message.user.firstName ? message.user.firstName[0] : 'U'}</div>
                        </div>
                    </div>
                    <div className={styles['message-main-container']}>
                        <div className={styles['message-user-data']}>
                            <div className={styles['name']}>{message.user.firstName}</div>
                            {/* {message.user.title?.value && <div className={styles['name']}>{message.user.title.value}</div>} */}
                            <span className={styles['string-dot']}></span>
                            <div className={styles['time']}>
                                {/*  // TODO уничтожить этот костыль, нужно чтобы с сервера приходило число */}
                                {datetimeUtils.formatTime(new Date(message.createdAt).getTime(), 'DD MMM YYYY в hh:mm')}
                            </div>
                        </div>
                        {/*<div className={styles.item_text}>{action.text}</div>*/}
                        <div className={styles['message-text']} dangerouslySetInnerHTML={{__html: message.text}} />
                    </div>
                </div>
            </div>
        )
    }

    const renderActions = () => {
        let allActions: IAction[] = actions || [];

        if (!allActions.length) {
            allActions = [
                {
                    text: '',
                    status: IClaimStatus.new,
                    type: ClaimType.action,
                    actionType: ActionType.claimCreated,
                    user: {
                        firstName: '',
                        lastName: '',
                    },
                    createdAt: `${manager.claimData.claimInfo.createdAt}`
                }
            ]
        }

        const actionsElements = allActions.slice().reverse().map((action) => {
            return action.type == ClaimType.action ? renderAction(action) : renderMessage(action);
        })

        return (
            <div className={styles['actions-container']}>{actionsElements}</div>
        )
    }

    return renderActions()

})

export default ClaimActions;