import React, {memo, useCallback} from "react";
import {Link, useNavigate} from "react-router-dom";
import styles from "./HomePage.module.sass";
import {ScrollablePanel} from "../../controls/panel/ScrollablePanel";
import {ScrollBarVisibility} from "../../controls/scrollArea";
import {useSessionInfo} from "../../app/hooks/useSessionInfo";
// icons
import { BsChevronRight } from "react-icons/bs";
import { IoLockClosedOutline } from "react-icons/io5";
import { CiBullhorn } from "react-icons/ci";
import { HiOutlineBuildingLibrary } from "react-icons/hi2";

interface HomePageProps {}

const HomePage = memo<HomePageProps>(() => {
    const {isAuth} = useSessionInfo();
    const navigate = useNavigate();

    const onCreateClick = useCallback(() => {
        isAuth ? navigate('/mySpace/newRequest') : navigate('/auth/login')
    }, [isAuth, navigate])

    const onSignInClick = useCallback(() => {
        navigate('/auth/register')
    }, [navigate])

    return (
        <ScrollablePanel
            vScroll={ScrollBarVisibility.autoWhenScrollOverArea}
            hScroll={ScrollBarVisibility.auto}
        >
            <div className={styles['home-page']}>
                <div className={styles['greetings-section']}>
                    <div className={styles['content-container']}>
                        <div className={styles['content']}>
                            <span className={styles['caption']}>Жалуйтесь от души.</span>
                            {/*<div className={styles['text']}>Жалобы, замечания, вопросы, идеи — дайте им выход.</div>*/}
                            <div className={styles['text']}>
                                Превратите ваше недовольство в действие: <span className={styles['link']} onClick={onCreateClick}>создайте жалобу</span> в мгновение и получите решение незамедлительно.
                            </div>
                            <div className={styles['text']}>
                                <span className={styles['link']} onClick={onSignInClick}>Начать бесплатно</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles['categories-section']}>
                    <div className={styles['content-container']}>
                        <div className={styles['row']}>
                            <div className={styles['item']}>
                                <div className={styles['title-container']}>
                                    <div className={styles['title-header']}>
                                        <div className={styles['title-icon']}>
                                            <IoLockClosedOutline />
                                            <span className={styles['title-text']}>Приватно</span>
                                        </div>
                                    </div>
                                    <div className={styles['item-caption']}>Напрямую в организацию</div>
                                    <div className={styles['item-text']}>Получайте уведомления по вашему обращению. Ведите деловую переписку с организацией.</div>
                                </div>
                                <Link to={'/use-cases'} className={styles['find-out-link']}>
                                    <span>Узнать больше</span>
                                    <BsChevronRight className={styles['chevron-icon']} size={10} />
                                </Link>
                            </div>
                            <div className={styles['item']}>
                                <div className={styles['title-container']}>
                                    <div className={styles['title-header']}>
                                        <div className={styles['title-icon']}>
                                            <CiBullhorn />
                                            <span className={styles['title-text']}>Публично</span>
                                        </div>
                                    </div>
                                    <div className={styles['item-caption']}>Чтобы все увидели</div>
                                    <div className={styles['item-text']}>Все пользователи смогут видеть, поддерживать или дополнять ваше обращение.</div>
                                </div>
                                <Link to={'/use-cases'} className={styles['find-out-link']}>
                                    <span>Узнать больше</span>
                                    <BsChevronRight className={styles['chevron-icon']} size={10} />
                                </Link>
                            </div>
                            <div className={styles['item']}>
                                <div className={styles['title-container']}>
                                    <div className={styles['title-header']}>
                                        <div className={styles['title-icon']}>
                                            <HiOutlineBuildingLibrary />
                                            <span className={styles['title-text']}>Куда следует</span>
                                        </div>
                                    </div>
                                    <div className={styles['item-caption']}>Если не знаете куда</div>
                                    <div className={styles['item-text']}>Направьте свою жалобу в компетентные органы. Мы сами оформим все официально.</div>
                                </div>
                                <Link to={'/use-cases'} className={styles['find-out-link']}>
                                    <span>Узнать больше</span>
                                    <BsChevronRight className={styles['chevron-icon']} size={10} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles['footer-section']}>
                <div className={styles['content-container']}>
                    <div>тут будуь контакты и логотипы партнеров</div>
                </div>
            </div>
        </ScrollablePanel>
    )
})

export default HomePage;