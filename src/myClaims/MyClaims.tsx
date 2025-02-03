import React from 'react';
import styles from './MyClaims.module.sass';
import { Button } from 'antd';
import MyClaimsTable from './components/MyClaimsTable';


const MY_CLAIMS_CAPTION = 'Мои обращения';
const MY_CLAIMS_ADD_BUTTON = 'Новое обращение';
const MY_CLAIMS_DESCRIPTION = 'Управляйте своими обращениями и отслеживайте их статусы';

const MyClaims = () => {
    return (
        <div className={styles['main-container']}>
            <div className={styles['my-claims-content']}>
                <div className={styles['my-claims-header']}>
                    <div className={styles['header-info']}>
                        <div className={styles['info-caption']}>{MY_CLAIMS_CAPTION}</div>
                        <div className={styles['info-description']}>{MY_CLAIMS_DESCRIPTION}</div>
                        <div className={styles['info-tags']}>
                            <Button className={styles['tag-button']} type='default' size='small'>Тэг 1</Button>
                            <Button className={styles['tag-button']} type='default' size='small'>Тэг 2</Button>
                        </div>
                    </div>
                    <div className={styles['header-actions']}>
                        <Button type='primary'>{MY_CLAIMS_ADD_BUTTON}</Button>
                    </div>
                </div>
                <div className={styles['claims-list']}>
                    <MyClaimsTable />
                </div>
            </div>
        </div>
    )
}

export default MyClaims;