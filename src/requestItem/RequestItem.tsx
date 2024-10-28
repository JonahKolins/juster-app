import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import styles from "./RequestItem.module.sass";
import ClaimActions from "./claimActions/ClaimActions";
import AdditionalInfo from "./additionalInfo/AdditionalInfo";
import {ClaimsItemResponse, IComment, IUserInfo} from "../mainPageSections/api/requests/GetClaimsRequest";
import TextEditor from "./textEditor/TextEditor";
import DraftCreator from "../newRequest/DraftCreator";
import {IFullRequestInfo} from "../newRequest/newRequestForm/parts/newRequestFinalPart/NewRequestFinalPart";
import {LoaderCircle} from "../designSystem/loader/Loader.Circle";
import classNames from "classnames";
import {formats} from "./textEditor/EditorToolbar";
import ReactQuill from "react-quill";
import {formatDate} from "../core/utils/dateUtils";
import {ScrollBarVisibility} from "../controls/scrollArea";
import {ScrollablePanel} from "../controls/panel/ScrollablePanel";
import {useProfile} from "../app/hooks/useProfile";
import {stringUtils} from "../core/utils";
import NBSP = stringUtils.NBSP;

const CAPTION = 'Читос или кузя лакомкин?';
const ITEM_DESCRIPTION = 'Многие меня спрашивают читос или кузя лакомкин. Скажу по секрету, что между ними стоит еще один титан. Это русская картошка. ' +
    'Базарю. Под пивас вообще четко залетает, тает во рту, каеф. Будто девчонку первый раз попробовал. И к слову жизнь как рюкзак нагруженный пивом - чем больше пьешь пиво тем тебе легче. Главное перед мамой не спалиться'

const firstMessage = 'Добрый день! Ваше обращение поступило к нам на рассморение и скоро вы получите ответ. Следите за уведомлениями. Спасибо!'
const testAdminMessages: string[] = [
    'Ваш комментарий принят.',
    'Вам необходимо прислать сканы ваших документов. Просто прикрепите их к комментарию.',
    'Спасибо, что долнили ваше обращение.',
    'В результате рассмотрения вашего обращения было решено составить заявление в прокуратуру, а так же обратиться в суд.'
]

const RequestItem = () => {
    const {id} = useParams();
    const {clientInfo} = useProfile();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<ClaimsItemResponse>(null);
    const [fullInfo, setFullInfo] = useState<IFullRequestInfo>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        // requestClaims();
        getAllData();
    }, [])

    // const requestClaims = useCallback(async () => {
    //
    //     if (!sessionId) return;
    //     try {
    //         const response = await getClaimsRequest(sessionId);
    //         if (response) {
    //             console.log('res', response);
    //             const requiredData = response.claims.find((claim) => claim.genId === id);
    //             setData(requiredData);
    //             setIsLoading(false);
    //         }
    //     } catch (err) {
    //         console.log('requestClaims err', err)
    //         setIsLoading(false);
    //     }
    // }, [id, sessionId])

    //
    const getAllData = () => {
        testRequestClaim(id)
            .then((data) => {
                if (!data) {
                    setData(null);
                    setError('Жалобы не существует');
                } else {
                    setFullInfo(data);
                    setData({
                        contentType: '',
                        createdDate: '2023-06-12 16:52', // "2023-06-12 16:52:48.343"
                        genId: data.id, //"1e3ec6b0-0d2e-4671-89a1-a637ae4b7986"
                        name: data.reason.text, //"Жалоба на врача"
                        status: data.status, //"RESOLVED"
                        text: data.requestText, //"Колоноскопия прошла не успешно - я обосрался"
                        comments: data.comments || []
                    })
                }
                setIsLoading(false);
            })
            .catch(() => {
                console.error('Невозможно получить данные по id')
                setError('Невозможно получить данные по id');
                setIsLoading(false);
            })
    }

    const getCurrentRequest = (id: string): IFullRequestInfo => {
        const existedRequestsString = localStorage.getItem('user_requests');

        let existedRequestsArray: IFullRequestInfo[] = [];

        try {
            if (existedRequestsString) {
                const parsedRegUsers: IFullRequestInfo[] = JSON.parse(existedRequestsString) || [];

                if (parsedRegUsers?.length) {
                    existedRequestsArray.push(...parsedRegUsers);
                }
            }
        } catch (e) {
            console.error('Cannot parse user_requests in FinalPArt -> existedRequestsString', existedRequestsString);
        }

        if (!existedRequestsArray.length) return null;

        const requestInfo: IFullRequestInfo = existedRequestsArray.find((data) => data.id === id);

        if (!requestInfo) return null;

        return requestInfo;
    }

    const testRequestClaim = (reqId: string): Promise<IFullRequestInfo> => {
        setIsLoading(true);

        return new Promise((resolve, reject) => {
            if (!reqId) {
                reject();
                return;
            }

            const requestInfo = getCurrentRequest(reqId);
            window.setTimeout(() => resolve(requestInfo), 300)
        })
    }

    const handleTestSaveComment = (text: string) => {
        const requestInfo = getCurrentRequest(id);
        //создаем новый коммент
        const newComment: IComment = {
            text: text,
            createdAt: formatDate(new Date().getTime(), 'DD/MM/YYYY'),
            id: Math.floor(1000 + Math.random() * 9000),
            user: {
                firstName: clientInfo.firstName,
                lastName: clientInfo.lastName
            }
        }
        // добаляем новый коммент к старым
        let allComments: IComment[] = requestInfo.comments || [];
        allComments.push(newComment);
        // создаем полностью новый объект Обращения с новым комментом
        const newRequestInfo: IFullRequestInfo = {
            ...requestInfo,
            comments: [...allComments]
        }

        // берем все обращения что есть
        const existedRequestsString = localStorage.getItem('user_requests');
        let existedRequestsArray: IFullRequestInfo[] = [];
        try {
            if (existedRequestsString) {
                const parsedRegUsers: IFullRequestInfo[] = JSON.parse(existedRequestsString) || [];

                if (parsedRegUsers?.length) {
                    existedRequestsArray.push(...parsedRegUsers);
                }
            }
        } catch (e) {
            console.error('Cannot parse user_requests in FinalPArt -> existedRequestsString', existedRequestsString);
        }
        // удаляем старое обращение по id
        const copyWithoutCurrentRequest = existedRequestsArray.filter((req) => req.id !== id);
        // добавляем новое
        copyWithoutCurrentRequest.push(newRequestInfo);
        // в строку и сохраняем
        const dataToSave = JSON.stringify(copyWithoutCurrentRequest);
        localStorage.setItem('user_requests', dataToSave);
        //
        testRequestClaim(id)
            .then((data) => {
                if (!data) {
                    setData(null);
                    setError('Жалобы не существует');
                } else {
                    setData({
                        contentType: '',
                        createdDate: '2023-06-12 16:52', // "2023-06-12 16:52:48.343"
                        genId: data.id, //"1e3ec6b0-0d2e-4671-89a1-a637ae4b7986"
                        name: data.reason.text, //"Жалоба на врача"
                        status: data.status, //"RESOLVED"
                        text: data.requestText, //"Колоноскопия прошла не успешно - я обосрался"
                        comments: data.comments || []
                    })
                }
                setIsLoading(false);
                testAddNewCommentFromAdmin();
            })
            .catch(() => {
                console.error('Невозможно получить данные по id')
                setError('Невозможно получить данные по id');
                setIsLoading(false);
            })
    }

    const getTestMessageFromAdmin = (): string => {
        if (!data.comments?.length) return firstMessage;

        const currentIndex = data.comments.length ? data.comments.length - 1 : 0;

        return testAdminMessages[currentIndex] || testAdminMessages[0];
    }

    const testAddNewCommentFromAdmin = () => {
        const requestInfo = getCurrentRequest(id);
        // создаем новый коммент
        const newComment: IComment = {
            text: getTestMessageFromAdmin(),
            createdAt: formatDate(new Date().getTime(), 'DD/MM/YYYY'),
            id: Math.floor(1000 + Math.random() * 9000),
            user: {
                firstName: 'Клава',
                lastName: '',
                title: {
                    id: 'admin',
                    value: 'Менеджер клиентского сервиса МВидео'
                }
            }
        }
        // добаляем новый коммент к старым
        let allComments: IComment[] = requestInfo.comments || [];
        allComments.push(newComment);
        // создаем полностью новый объект Обращения с новым комментом
        const newRequestInfo: IFullRequestInfo = {
            ...requestInfo,
            comments: [...allComments]
        }

        // берем все обращения что есть
        const existedRequestsString = localStorage.getItem('user_requests');
        let existedRequestsArray: IFullRequestInfo[] = [];
        try {
            if (existedRequestsString) {
                const parsedRegUsers: IFullRequestInfo[] = JSON.parse(existedRequestsString) || [];

                if (parsedRegUsers?.length) {
                    existedRequestsArray.push(...parsedRegUsers);
                }
            }
        } catch (e) {
            console.error('Cannot parse user_requests in FinalPArt -> existedRequestsString', existedRequestsString);
        }
        // удаляем старое обращение по id
        const copyWithoutCurrentRequest = existedRequestsArray.filter((req) => req.id !== id);
        // добавляем новое
        copyWithoutCurrentRequest.push(newRequestInfo);
        // в строку и сохраняем
        const dataToSave = JSON.stringify(copyWithoutCurrentRequest);
        localStorage.setItem('user_requests', dataToSave);

        window.setTimeout(() => {
            getAllData()
        }, 300)
    }

    // const handleSaveComment = useCallback(async (text: string) => {
    //     const params = { claimId: id, sessionId: sessionId, text: text };
    //     try {
    //         const sendCommentResponse = await sendComment(params);
    //
    //         console.log('sendCommentResponse', sendCommentResponse);
    //         setIsLoading(false);
    //     } catch (err) {
    //         console.log('handleSaveComment err', err)
    //         console.log('handleSaveComment err', {err})
    //         setIsLoading(false);
    //     }
    // }, [id, sessionId])

    if (error) return <div>{error}</div>
    if (!data) return null;

    return isLoading || !data || !clientInfo ? <LoaderCircle /> : (
        <ScrollablePanel
            vScroll={ScrollBarVisibility.autoWhenScrollOverArea}
            hScroll={ScrollBarVisibility.auto}
        >
            <DraftCreator>
                <div className={styles['request-item']}>
                    <div className={styles.main_info}>
                        <div className={styles.form}>
                            <div className={styles.caption}>{data.name}</div>
                            <div className={styles.description}>Описание</div>
                            <ReactQuill
                                className={classNames(
                                    styles.description_text
                                )}
                                theme="snow"
                                onChange={() => {}}
                                value={data.text || ''}
                                formats={formats}
                                modules={{toolbar: null}}
                                readOnly={true}
                            />
                            <div className={styles.attachments}>Вложения</div>
                            <div className={styles.attachment_items}>
                                <div className={styles.attach_item}>
                                    .doc
                                </div>
                                <div className={styles.attach_item}>
                                    .pdf
                                </div>
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <div className={styles.title}>Активность</div>
                            <TextEditor saveComment={handleTestSaveComment} />
                            {data.comments?.length ? (
                                <ClaimActions actions={data.comments} id={id}/>
                            ) : (
                                <div className={styles.no_activities}>Нет активности</div>
                            )}
                        </div>
                    </div>
                    <AdditionalInfo
                        id={data.genId}
                        author={`${clientInfo.firstName}${NBSP}${clientInfo.lastName}`}
                        org={fullInfo.org}
                    />
                </div>
            </DraftCreator>
        </ScrollablePanel>
    )
}

export default RequestItem;