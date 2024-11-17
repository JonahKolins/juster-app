import React, {FC} from 'react';
import styles from "./AppealsItem.module.css";
import {HiOutlineBuildingLibrary} from "react-icons/hi2";
import {IClaimsItemResponse, IClaimStatus} from "../../classes/claim/Claim.Types";
import {datetimeUtils} from "../../core/utils/datetimeUtils";

interface IAppealsItemProps {
    item: IClaimsItemResponse
}

const AppealsItem: FC<IAppealsItemProps> = ({ item }) => {
    return (
        <div className={styles.appealsItem}>
            <div className={styles.appealsContainer}>
                <div className={styles.itemData}>
                    <div className={styles.itemId}>{`№ ${item.id}`}</div>
                    <div className={styles.itemDate}>{datetimeUtils.formatTime(item.createdDate, 'DD.MM.YYYY')}</div>
                </div>
                <div className={styles.itemIcon}>
                    <div className={styles.iconContainer}>
                        <HiOutlineBuildingLibrary size={20} />
                    </div>
                </div>
                <div className={styles.itemDescription}>
                    <div className={styles.itemTitle}>{item.name}</div>
                    <div className={styles.itemShortDescription}>{item.text}</div>
                </div>
                <div className={styles.itemStatus}>
                    {item.status === IClaimStatus.resolved && <div className={styles.itemSuccessStatus}>{item.status}</div>}
                    {item.status === IClaimStatus.inProcess && <div className={styles.itemInProcessStatus}>{item.status}</div>}
                    {item.status === IClaimStatus.created && <div className={styles.itemSentStatus}>{item.status}</div>}
                    {item.status === IClaimStatus.declined && <div className={styles.itemVerificationStatus}>{item.status}</div>}
                    {item.status === IClaimStatus.waitingForAction && <div className={styles.itemWaitingForAction}>{item.status}</div>}
                </div>
            </div>
        </div>
    )
}

export default AppealsItem;