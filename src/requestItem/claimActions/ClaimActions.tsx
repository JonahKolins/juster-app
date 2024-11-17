import React, {memo} from "react";
import styles from "./ClaimActions.module.sass";
import classNames from "classnames";
import {
    IClaimAction,
    IClaimActionType,
    IClaimMessage, IClaimStatus,
    isClaimAction,
    TClaimAction
} from "../../classes/claim/Claim.Types";
import {datetimeUtils} from "../../core/utils/datetimeUtils";
import {stringUtils} from "../../core/utils";
import NBSP = stringUtils.NBSP;
import { BsStars } from "react-icons/bs";
import { RiMessage3Line } from "react-icons/ri";

interface ClaimActionsProps {
    id: string;
    actions: TClaimAction[];
}

const ClaimActions = memo<ClaimActionsProps>(({id, actions}) => {

    const getStatusName = (status: IClaimStatus): string => {
        switch (status) {
            case IClaimStatus.created: return 'Создано';
            case IClaimStatus.underConsideration: return 'На рассмотрении';
            case IClaimStatus.inProcess: return 'В процессе';
            case IClaimStatus.waitingForAction: return 'Требуется действие';
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
        if (lastIndex < input.length) {
            result.push(input.substring(lastIndex));
        }

        return result;
    }

    const renderAction = (action: IClaimAction): React.JSX.Element => {

        let text: React.ReactNode = action.text;

        if (action.actionType == IClaimActionType.claimCreated) {
            const formatDate = datetimeUtils.formatTime(action.createdAt, 'DD MMM YYYY в hh:mm')

            text = (
                <span className={styles['action-message']}>
                    {action.text.replace('%date%', '')}
                    <span className={styles['string-dot']}></span>
                    <span className={styles['action-time']}>{formatDate}</span>
                </span>
            )
        }

        if (action.actionType == IClaimActionType.statusChanged) {
            const formatDate = datetimeUtils.formatTime(action.createdAt, 'DD MMM YYYY в hh:mm')
            const actionText = replacePlaceholdersWithElements(action.text, {
                '%user%': <span className={styles['action-user-info']}>{action.user.firstName} {action.user.lastName}{NBSP}</span>,
                '%status%': <>{NBSP}<span className={styles['status-inline']}>{getStatusName(action.status)}</span></>,
                '%date%': <><span className={styles['string-dot']}></span><span className={styles['action-time']}>{formatDate}</span></>
            })
            text = (
                <span className={styles['action-message']}>
                    {actionText}
                </span>
            )
        }


        return (
            <div key={action.id} className={styles['action-item']}>
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

    const renderMessage = (message: IClaimMessage): React.JSX.Element => {
        return (
            <div className={styles['message-container']}>
                <div className={styles['message-container-icon']}>
                    <div className={styles['message-container-icon-background']}>
                        <RiMessage3Line size={16} />
                    </div>
                </div>
                <div key={message.id} className={styles['message-item']}>
                    <div className={styles['message-icon-container']}>
                        <div className={classNames(styles['message-default-user-icon'])}>
                            <div className={styles['first-letter']}>{message.user.firstName ? message.user.firstName[0] : 'U'}</div>
                        </div>
                    </div>
                    <div className={styles['message-main-container']}>
                        <div className={styles['message-user-data']}>
                            <div className={styles['name']}>{message.user.firstName}</div>
                            {message.user.title?.value && <div className={styles['name']}>{message.user.title.value}</div>}
                            <span className={styles['string-dot']}></span>
                            <div className={styles['time']}>
                                {datetimeUtils.formatTime(message.createdAt, 'DD MMM YYYY в hh:mm')}
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
        if (!actions || !actions.length) return <div>no data</div>

        const actionsElements = actions.map((action) => {
            return isClaimAction(action) ? renderAction(action) : renderMessage(action);
        })

        return (
            <div className={styles['actions-container']}>{actionsElements}</div>
        )
    }

    return renderActions()

})

export default ClaimActions;