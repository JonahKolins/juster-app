import React, { memo } from "react";
import DraftCreator from "../../../newRequest/DraftCreator";
import NewRequestForm from "../../../newRequest/newRequestForm/NewRequestForm";
import styles from "./MySpaceNewRequest.module.sass";
import { ScrollablePanel } from "controls/panel/ScrollablePanel";
import { ScrollBarVisibility } from "controls/scrollArea";

interface NewRequestProps {}

const MySpaceNewRequestPage = memo<NewRequestProps>(() => {
    return (
        <div className={styles['new-request']}>
            <DraftCreator>
                <ScrollablePanel
                    vScroll={ScrollBarVisibility.autoWhenScrollOverArea}
                    hScroll={ScrollBarVisibility.none}
                >
                    <div className={styles['main-container']}>
                        <div className={styles['content']}>
                            <div className={styles['main-caption']}>Новое обращение</div>
                            <NewRequestForm />
                        </div>
                    </div>
                </ScrollablePanel>
            </DraftCreator>
        </div>
    );
})

export default MySpaceNewRequestPage;