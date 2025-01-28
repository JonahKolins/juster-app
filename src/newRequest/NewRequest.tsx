import React, {memo} from "react";
import {useLocation} from "react-router-dom";
import MainWrapper from "../components/mainWrapper/MainWrapper";
import styles from "./NewRequest.module.sass";
import NewRequestDataLayerProvider from "./NewRequestDataLayer";
import DraftCreator from "./DraftCreator";
import NewRequestForm from "./newRequestForm/NewRequestForm";

const REDIRECTED_SEARCH_PARAM = 'external';

interface NewRequestsProps {}

const NewRequests = memo<NewRequestsProps>(() => {
    const location = useLocation();

    console.log('location', location)

    // проверка параметров улра
    const hasExternalSearchParams = (): boolean => {
        const searchString = new URLSearchParams(location.search);
        return searchString.has(REDIRECTED_SEARCH_PARAM) && searchString.get(REDIRECTED_SEARCH_PARAM) === '1'
    }

    const renderContent = (children: React.ReactNode) => {
        return hasExternalSearchParams()
            ? <div className={styles.request_container}>{children}</div>
            : (
                <MainWrapper>
                    <div className={styles.new_request}>
                        {children}
                    </div>
                </MainWrapper>
            )
    }

    return renderContent(
        <NewRequestDataLayerProvider>
            <DraftCreator>
                <div className={styles.scroll_area}>
                    <div className={styles.main_section}>
                        <div className={styles.main_caption}>Новое обращение</div>
                        {hasExternalSearchParams()
                            ? <NewRequestForm />
                            : <div>Не валидный url</div>
                        }
                    </div>
                </div>
            </DraftCreator>
        </NewRequestDataLayerProvider>
    );
})

export default NewRequests;