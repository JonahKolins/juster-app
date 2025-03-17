import React, {FC} from "react";
import MainWrapper from "components/mainWrapper/MainWrapper";
import styles from "./AllClaimsPage.module.sass";

const AllClaimsPage: FC = () => {
    return (
        <MainWrapper>
            <div className={styles['all-claims']}>
                <h1>All claims page</h1>
            </div>
        </MainWrapper>
    )
}

export default AllClaimsPage;
