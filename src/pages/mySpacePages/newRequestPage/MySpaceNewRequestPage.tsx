import React, {memo} from "react";
import NewRequestDataLayerProvider from "../../../newRequest/NewRequestDataLayer";
import DraftCreator from "../../../newRequest/DraftCreator";
import NewRequestForm from "../../../newRequest/newRequestForm/NewRequestForm";
import styles from "./MySpaceNewRequest.module.sass";

interface NewRequestProps {}

const MySpaceNewRequestPage = memo<NewRequestProps>(() => {
    return (
        <div className={styles['new-request']}>
            <NewRequestDataLayerProvider>
                <DraftCreator>
                    <div className={styles['scroll-area']}>
                        <div className={styles['main-section']}>
                            <div className={styles['main-caption']}>Новое обращение</div>
                            <NewRequestForm />
                        </div>
                    </div>
                </DraftCreator>
            </NewRequestDataLayerProvider>
        </div>
    );
})

export default MySpaceNewRequestPage;