import React from 'react';
import styles from './CompanyInfo.module.sass';
import classNames from 'classnames';
import { Button, SliderSingleProps } from 'antd';
import { ICompanyInfo } from 'cmd/network/company/companyService';
import { HiOutlineBuildingLibrary } from 'react-icons/hi2';
import { LuGoal } from 'react-icons/lu';
import { IoDocumentOutline } from 'react-icons/io5';
import RatingSlider from './RatingSlider';

interface CompanyInfoProps {
    info: ICompanyInfo;
}

const CompanyInfo = React.memo<CompanyInfoProps>(({info}) => {
    if (!info) return null;

    // TODO сделать слайдер решенных/нерешенных обращений
    const marks: SliderSingleProps['marks'] = {
        0: '0',
    };
    const maxCount = info.claimsCount;
    marks[maxCount] = info.claimsCount;

    return (
        <div className={styles['company-info-container']}>
            <div className={styles['main-info']}>
                <div className={styles['info-block']}>
                    <div className={styles['header']}>
                        <div className={styles['caption-container']}>
                            <div className={styles['logo']}>
                                <img src={info.logoUrl} className={styles.logo} />
                            </div>
                            <span className={styles['caption']}>{info.name}</span>
                        </div>
                        <div className={styles['tags-container']}>
                            <div className={classNames(styles['tag'], styles['_left'])}>Что-то</div>
                            <div className={classNames(styles['tag'], styles['_right'])}>Активная</div>
                        </div>
                    </div>
                    <div className={styles['rating']}>
                        <div>{info.rating}</div>
                        <div className={styles['rating-claims-count']}>{`- ${info.claimsCount} обращений`}</div>
                    </div>
                    <table className={styles['about-table']}>
                        <tbody>
                            <tr>
                                <td className={styles['key']}>
                                    <HiOutlineBuildingLibrary />
                                    <span>Email</span>
                                </td>
                                <td className={styles['value']}>{info.email}</td>
                            </tr>
                            <tr>
                                <td className={styles['key']}>
                                    <LuGoal />
                                    <span>Адресс</span>
                                </td>
                                <td className={styles['value']}>{info.address}</td>
                            </tr>
                            <tr>
                                <td className={styles['key']}>
                                    <IoDocumentOutline />
                                    <span>ИНН</span>
                                </td>
                                <td className={styles['value']}>{info.inn}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className={styles['full-name']}>
                        {info.fullName}
                    </div>
                    <div className={styles['company-description']}>
                        {info.description}
                    </div>
                </div>
                <div className={styles['info-title']}>Обращения</div>
                <div className={styles['info-block']}>
                    <div className={styles['rating-container']}>
                        <span className={styles['rating-caption']}>{`Насколько отзывчива служба поддержки клиетов в ${info.name}?`}</span>
                        <RatingSlider min={0} max={info.claimsCount} current={34} marks={marks} />
                        <table className={styles['about-table']}>
                            <tbody>
                                <tr>
                                    <td className={styles['key']}>
                                        <span>Всего обращений</span>
                                    </td>
                                    <td className={styles['value']}>{info.claimsCount}</td>
                                </tr>
                                <tr>
                                    <td className={styles['key']}>
                                        <span>Завершенные</span>
                                    </td>
                                    <td className={styles['value']}>{'34'}</td>
                                </tr>
                                <tr>
                                    <td className={styles['key']}>
                                        <span>Не завершенные</span>
                                    </td>
                                    <td className={styles['value']}>{'50'}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className={styles['total']}>Нет так уж и плохо, но есть над чем работать</div>
                        <div className={styles['total-description']}>Компания {info.name} является постоянным пользователем нашего приложения и неплохо справляется</div>
                    </div>
                </div>
            </div>
            <div className={styles['rigth-colomn']}>
                <div className={styles['info-block']}>
                    <div className={styles['header']}>Хотите написать обращение в эту компанию?</div>
                    <div className={styles['description']}>
                        Решите ваши вопросы напрямую с компанией. Создайте обращение за 4 простых шага.
                    </div>
                    <div className={styles['buttons']}>
                        <Button className={styles['send-request']} color="primary">Написать обращение</Button>
                        <Button className={styles['share']} color="default">Поделиться</Button>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default CompanyInfo;