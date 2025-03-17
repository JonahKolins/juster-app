import React, {FC} from "react";
import MainWrapper from "components/mainWrapper/MainWrapper";
import styles from "./InboxPage.module.sass";

const InboxPage: FC = () => {
    return (
        <MainWrapper>
            <div className={styles['inbox']}>
                <h1>Inbox page</h1>
            </div>
        </MainWrapper>
    )
}

export default InboxPage;
