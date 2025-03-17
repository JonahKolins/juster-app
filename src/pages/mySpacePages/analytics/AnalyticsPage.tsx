import React, {FC} from "react";
import MainWrapper from "components/mainWrapper/MainWrapper";
import styles from "./AnalyticsPage.module.sass";

const AnalyticsPage: FC = () => {
    return (
        <MainWrapper>
            <div className={styles['analytics']}>
                <h1>Analytics page</h1>
            </div>
        </MainWrapper>
    )
}

export default AnalyticsPage;