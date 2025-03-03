import React from "react";
import styles from "./CompanyPage.module.sass";

const CompanyPage = () => {
    return (
        <div className={styles['page-body']}>
            <div className={styles['greetings-section']}>
                <div className={styles['content-container']}>
                    <div>тут страница компании</div>
                    <div>с рейтингом и может даже с публичными обращениями</div>
                </div>
            </div>
        </div>
    )
}

export default CompanyPage;