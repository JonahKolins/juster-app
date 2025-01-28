import React, {FC} from 'react';
import styles from "./AppealsItem.module.css";
import {HiOutlineBuildingLibrary} from "react-icons/hi2";
import {IClaimsItem, IClaimStatus} from "../../classes/claim/Claim.Types";
import {datetimeUtils} from "../../core/utils/datetimeUtils";

interface IAppealsItemProps {
    item: IClaimsItem
}

const AppealsItem: FC<IAppealsItemProps> = ({ item }) => {
    return (
        <div className={styles.appealsItem}>
            <div className={styles.appealsContainer}>
                <div className={styles.itemData}>
                    <div className={styles.itemId}>{`№ ${item.genId}`}</div>
                    <div className={styles.itemDate}>{datetimeUtils.formatTime(item.claimInfo.createdAt, 'DD.MM.YYYY')}</div>
                </div>
                <div className={styles.itemIcon}>
                    <div className={styles.iconContainer}>
                        <HiOutlineBuildingLibrary size={20} />
                    </div>
                </div>
                <div className={styles.itemDescription}>
                    <div className={styles.itemTitle}>{item.claimInfo.claimName}</div>
                    <div className={styles.itemShortDescription}>{item.claimInfo.textClaim}</div>
                </div>
                <div className={styles.itemStatus}>
                    {item.claimInfo.status === IClaimStatus.draft && <div className={styles.itemInProcessStatus}>{item.claimInfo.status}</div>}
                    {item.claimInfo.status === IClaimStatus.resolved && <div className={styles.itemSuccessStatus}>{item.claimInfo.status}</div>}
                    {item.claimInfo.status === IClaimStatus.inProgress && <div className={styles.itemInProcessStatus}>{item.claimInfo.status}</div>}
                    {item.claimInfo.status === IClaimStatus.new && <div className={styles.itemSentStatus}>{item.claimInfo.status}</div>}
                    {item.claimInfo.status === IClaimStatus.declined && <div className={styles.itemVerificationStatus}>{item.claimInfo.status}</div>}
                    {item.claimInfo.status === IClaimStatus.waitingForAction && <div className={styles.itemWaitingForAction}>{item.claimInfo.status}</div>}
                </div>
            </div>
        </div>
    )
}

export default AppealsItem;