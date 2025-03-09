import React from 'react';
import styles from './ClaimItem.module.sass';
import { IClaimsPublicItem, IClaimStatus } from 'classes/claim/Claim.Types';
import { Dropdown, Tag, Tooltip } from 'antd';
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { datetimeUtils } from 'core/utils/datetimeUtils';
import classNames from 'classnames';

interface ClaimItemProps {
    claim: IClaimsPublicItem;
    isLast: boolean;
    className?: string;
}

const getStatusColor = (status: IClaimStatus): string => {
    switch (status) {
        case IClaimStatus.resolved:
            return 'green';
        case IClaimStatus.close:
            return 'green';
        case IClaimStatus.inProgress:
        case IClaimStatus.needInfo:
        case IClaimStatus.waitingForAction:
            return 'orange';
        case IClaimStatus.declined:
            return 'red';
        default:
            return 'blue';
    }
};

const getStatusText = (status: IClaimStatus): string => {
    switch (status) {
        case IClaimStatus.resolved:
            return 'Решено';
        case IClaimStatus.close:
            return 'Закрыто';
        case IClaimStatus.inProgress:
            return 'В обработке';
        case IClaimStatus.needInfo:
            return 'Нужна информация';
        case IClaimStatus.waitingForAction:
            return 'Ожидание действия';
        case IClaimStatus.declined:
            return 'Отклонено';
        case IClaimStatus.draft:
            return 'Черновик';
        case IClaimStatus.new:
            return 'Новое';
        case IClaimStatus.open:
            return 'Открыто';
        case IClaimStatus.deleted:
            return 'Удалено';
        default:
            return status;
    }
};

// Опции для выпадающего списка опций
const filterMenuItems = [
    {
        key: 'copy',
        label: 'Поделиться ссылкой',
        onClick: () => {}
    },
    {
        key: 'like',
        label: 'Нравится',
        onClick: () => {}
    }
];

const ClaimItem: React.FC<ClaimItemProps> = ({ claim, isLast, className }) => {
    const { claimInfo } = claim;
    const formattedDate = datetimeUtils.formatTime(claimInfo.createdAt, 'DD.MM.YYYY hh:mm');
    
    const logoLetters = `${claim.claimInfo.user.firstName[0]} ${claim.claimInfo.user.lastName[0]}`;
    const showStatus = claim.claimInfo.status == IClaimStatus.resolved || claim.claimInfo.status == IClaimStatus.declined;

    return (
        <div className={classNames(styles['claims-item'], isLast && styles['_last'])}>
            <div className={styles['claim-header']}>
                <div className={styles['header-user-info']}>
                    <div className={styles['logo-container']}>
                        {logoLetters}
                    </div>
                    <div className={styles['user-data']}>
                        <div className={styles['name-container']}>
                            <div className={styles['name']}>
                                {`${claimInfo.user.firstName} ${claimInfo.user.lastName}`}
                            </div>
                            {claimInfo.user.verified && (
                                <div className={styles['verify']}>
                                    <Tooltip placement="bottom" title={'Пользователь верифицирован'} arrow={false}>
                                        <RiVerifiedBadgeFill size={18} />
                                    </Tooltip> 
                                </div>
                            )}
                        </div>
                        <div className={styles['date']}>
                            <div className={styles['date-item']}>
                                {formattedDate}
                            </div>
                        </div>
                    </div>
                </div>
                <Dropdown 
                    menu={{ items: filterMenuItems }} 
                    trigger={['click']}
                    className={styles['filter-dropdown']}
                >
                    <div className={styles['options']}>
                        <HiOutlineDotsVertical />
                    </div>
                </Dropdown>
            </div>
            {showStatus && (
                <div className={styles['status']}>
                    <div 
                        className={classNames(
                            styles['tag'],
                            claim.claimInfo.status == IClaimStatus.resolved 
                                ? styles['_resolved']
                                : styles['_unresolved']
                        )}
                    >
                        {getStatusText(claim.claimInfo.status)}
                    </div>
                </div>
            )}
            <div className={styles['claim-info']}>
                <h3 className={styles['claim-title']}>{claimInfo.claimName}</h3>
                <div className={styles['claim-text']}>
                    {claimInfo.textClaim}
                </div>
            </div>
        </div>
    );
};

export default ClaimItem; 