import React from 'react';
import styles from './CompanyInfoClaims.module.sass';
import { IClaimsItem, IClaimStatus } from 'classes/claim/Claim.Types';
import { Tag } from 'antd';
import { datetimeUtils } from 'core/utils/datetimeUtils';
import classNames from 'classnames';

interface ClaimItemProps {
    claim: IClaimsItem;
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

const ClaimItem: React.FC<ClaimItemProps> = ({ claim, isLast, className }) => {
    const { claimInfo } = claim;
    const formattedDate = datetimeUtils.formatTime(claimInfo.createdAt, 'DD.MM.YYYY hh:mm');
    
    return (
        <div className={classNames(styles['claims-item'], isLast && styles['_last'])}>
            <div className={styles['claim-header']}>
                <h3 className={styles['claim-title']}>{claimInfo.claimName}</h3>
                <Tag color={getStatusColor(claimInfo.status)}>
                    {getStatusText(claimInfo.status)}
                </Tag>
            </div>
            
            <div className={styles['claim-info']}>
                <div className={styles['claim-date']}>
                    {formattedDate}
                </div>
                <div className={styles['claim-type']}>
                    {claimInfo.contentType}
                    {claimInfo.contentSum && ` (${claimInfo.contentSum} руб.)`}
                </div>
            </div>
            
            <div className={styles['claim-text']}>
                {claimInfo.textClaim}
            </div>
        </div>
    );
};

export default ClaimItem; 