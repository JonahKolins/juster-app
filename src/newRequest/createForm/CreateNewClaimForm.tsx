import React, {ChangeEvent, memo, useCallback, useEffect, useMemo, useState} from "react";
import styles from "./CreateNewClaimForm.module.sass";
import TextArea from "antd/es/input/TextArea";
import classNames from "classnames";
import {Dropdown, Input, MenuProps, Modal, message} from "antd";
import {IoIosSearch} from "react-icons/io";
// import getOrganisationSuggestionsRequest from "../api/methods/getOrganisationSuggestionsRequest";
import {ISuggestions} from "../api/requests/GetOrganisationSuggestionsRequest";
import TextEditor from "../../requestItem/textEditor/TextEditor";
import { IoClose, IoWarningOutline } from "react-icons/io5";
import {CreateNewClaimParams} from "../api/requests/PostCreateNewClaimRequest";
import {requestCreateNewClaim} from "../api/methods/requestCreateNewClaim";
import { FiInfo } from "react-icons/fi";
import { HiOutlineInbox } from "react-icons/hi2";
import Button from "../../designSystem/button/Button";
import {useDraftCreatorContext} from "../DraftCreator";

enum ModalType {
    submit = 'submit',
    cancel = 'cancel'
}

enum FormError {
    organisation = 'organisation',
    name = 'name',
    text = 'text',
    files = 'files',
    unknown = 'unknown'
}

interface IModalContext {
    title?: string;
    text: string;
    type: ModalType;
    okButtonText?: string;
    cancelButtonText?: string;
}

interface IFormError {
    message: string;
    type: FormError;
}

interface CreateNewClaimFormProps {}

const CreateNewClaimForm = memo<CreateNewClaimFormProps>(({}) => {
    // organisation data
    const [orgData, setOrgData] = useState<any>(null);
    const [inputSearchValue, setInputSearchValue] = useState<string>('');
    const [dropdownItems, setDropdownItems] = useState<MenuProps['items']>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<ISuggestions>(null);
    // claim data
    const [claimName, setClaimName] = useState<string>('');
    const [claimText, setClaimText] = useState<string>('');
    const [claimFiles, setClaimFiles] = useState<File[]>([]);
    // ошибка
    const [error, setError] = useState<IFormError>(null);
    // modal
    const [modalContext, setModalContext] = useState<IModalContext>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    // clean fields
    const [cleanOrg, setCleanOrg] = useState<boolean>(false);
    const [cleanText, setCleanText] = useState<boolean>(false);

    const [messageApi, contextHolder] = message.useMessage();

    const {createOrEditDraft, cleanDraft} = useDraftCreatorContext();

    // effects

    // когда уходим со страницы --> отчищаем черновик
    useEffect(() => {
        return () => cleanDraft();
    }, [])

    // вывод сообщения об ошибке в попапе
    useEffect(() => {
        if (error) messageApi.open({ content: errorMessageContent(error.message) })
    }, [error])

    const errorMessageContent = (message: string): React.ReactNode => {
        return (
            <div className={styles['error-message-content']}>
                <FiInfo color={'var(--base-color__button)'} size={16}/>
                <div className={styles['message']}>{message}</div>
            </div>
        )
    }

    const renderNothingFoundItem = () => {
        return (
            <div className={styles['nothing-found-menu-item']}>
                <HiOutlineInbox />
                <span className={styles['nothing-found-text']}>Нет организаций соответствующих вашему запросу</span>
            </div>
        )
    }

    // memos

    const showCancelButton = useMemo<boolean>(() => {
        const isEmpty = orgData ? !Object.values(orgData).some(val => val !== '') : true;
        return !!(claimName || claimText || !!claimFiles.length || selectedItem || !isEmpty);
    }, [claimName, claimText, claimFiles.length, selectedItem, orgData])

    const nothingFoundedItem = useMemo(() => {
        return {
            key: 'empty',
            label: renderNothingFoundItem(),
            onClick: () => setIsDropdownOpen(false)
        }
    }, [])

    const menuItems = useMemo<MenuProps>(() => {
        if (!dropdownItems || !dropdownItems.length) return { items: [nothingFoundedItem] }
        return { items: dropdownItems }
    }, [dropdownItems])

    // handlers

    const handleInputSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) setIsDropdownOpen(false);
        setInputSearchValue(e.target.value);
    }, [])

    const handleSearch = useCallback(() => {
        if (!inputSearchValue) return;
        // getOrganisationSuggestionsRequest(inputSearchValue)
        //     .then((res) => {
        //         console.log('res', res.suggestions)
        //         createMenuItems(res.suggestions);
        //     })
        //     .catch((err) => {
        //         console.log('error', err)
        //     })
    }, [inputSearchValue])

    const createMenuItems = useCallback((suggestions: ISuggestions[]) => {
        const newArray: MenuProps['items'] = suggestions.map((item, index) => {
            return {
                key: `${item.value + index}`,
                label: renderMenuItem(item, index),
                onClick: () => handleDropdownItemClick(item)
            }
        })
        setDropdownItems(newArray);
        setIsDropdownOpen(true);
    }, [])

    const renderMenuItem = (item: ISuggestions, index?: number): JSX.Element => {
        return (
            <div className={styles['menu-item']} key={`${item.value + index}`}>
                <span className={styles['item-name']}>{item.value}</span><span><span className={styles['item-key']}>инн:</span> {item.data.inn}</span>
                <div>{item.data.address.value}</div>
            </div>
        )
    }

    const handleDropdownItemClick = useCallback((item: ISuggestions) => {
        setSelectedItem(item);
        setIsDropdownOpen(false);
        setInputSearchValue('');
    }, [])

    const handleSaveOrganisationData = useCallback((data: any) => {
        setOrgData(data);
        setError(null);
    }, [])

    const handleChangeTextEditor = useCallback((text: string, files: File[]) => {
        setClaimText(text);
        setClaimFiles(files);
        setError(null);
    }, [])

    const isValidForm = useCallback((): {isValid: boolean; error?: IFormError} => {
        // нет даных об организации
        if (!orgData) return {isValid: false, error: {type: FormError.organisation, message: 'Заполните данные организации'}};
        // полные ли данные организации
        const isFullOrgData = Object.values(orgData).every((orgValue) => orgValue !== '' && orgValue !== null);
        // нет всех данных организации
        if (!isFullOrgData) return {isValid: false, error: {type: FormError.organisation, message: 'Не все данные организации заполнены'}};
        // нет названия
        if (!claimName) return {isValid: false, error: {type: FormError.name, message: 'Введите название обращения'}};
        // нет текста
        if (!claimText) return {isValid: false,  error: {type: FormError.text, message: 'Введите описание'}};
        // нет ошибки
        return {isValid: true}
    }, [claimName, claimText, orgData])

    const handleChangeClaimName = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setClaimName(event.target.value);
        setError(null);
        localStorage.setItem("claim.draft.name", JSON.stringify(event.target.value));
    }, [])

    const handleClaimNameBlur = useCallback(() => {
        // создаем или добавляем черновик
        !!claimName && createOrEditDraft({name: claimName})
    }, [claimName])

    const raiseModal = useCallback((context: IModalContext) => {
        setModalContext(context);
        setModalOpen(true);
    }, [])

    const handleCancelClaim = useCallback(() => {
        // raise poppup
        raiseModal({
            title: 'Подтверждение',
            text: 'Ваше обращение будет сохранено в черновике. Вы уверены, что хотите отменить обращение?',
            type: ModalType.cancel
        })
    }, []);

    const handleSubmitClaim = useCallback(() => {
        // validate
        const { isValid, error } = isValidForm();

        if (!isValid) {
            setError(error);
            return;
        }
        // raise modal with loading
        raiseModal({
            title: 'Подтверждение',
            text: 'Вы уверены что хотите отправить обращение?',
            type: ModalType.submit
        })
    }, [isValidForm]);

    const handleModalOk = () => {
        if (modalContext.type === ModalType.submit) {
            // send claim
            submitFullForm();
        }
        if (modalContext.type === ModalType.cancel) {
            // remove all data
            setInputSearchValue('');
            setOrgData(null);
            setClaimFiles([]);
            setClaimText('');
            setClaimName('');
            cleanOrgFields();
            cleanTextFields();
            // сообщение
            messageApi.open({ content: errorMessageContent('Черновик сохранен') })
            // отчистка созданного черновика (он уже соханился на серваке)
            cleanDraft();
        }
        setModalOpen(false);
    };

    const cleanOrgFields = () => {
        setCleanOrg(true);
        setTimeout(() => setCleanOrg(false), 100)
    }

    const cleanTextFields = () => {
        setCleanText(true);
        setTimeout(() => setCleanText(false), 100)
    }

    const handleModalCancel = () => {
        setModalOpen(false);
    };

    const submitFullForm = useCallback(async () => {
        const sessionId = localStorage.getItem('id');
        // const files = claimFiles.map((file) => file.originFileObj);
        // TODO прикрутить files
        const params: CreateNewClaimParams = {
            claimName: claimName,
            claimText: claimText,
            contentSum: "1500000",
            contentType: "Appeal",
            recipientAddress: orgData.address,
            recipientEmail: "",
            recipientInn: orgData.inn,
            recipientName: orgData.name,
            sessionId: sessionId,
            file: null
        }

        try {
            const response = await requestCreateNewClaim(params);

            console.log('requestCreateNewClaim response', response)
        } catch (error) {
            console.log('error', {error})
            setError({type: FormError.unknown, message: 'Неизвестная ошибка сервера. Попробуйте позже.'})
        }
    }, [claimName, claimText, orgData?.address, orgData?.inn, orgData?.name])


    const renderOrganisationData = (): JSX.Element => {
        return null
        // return <ManualForm clean={cleanOrg} saveOrganisationData={handleSaveOrganisationData} />
    }

    const renderSelectedItem = (): JSX.Element => {
        if (!selectedItem) return null;
        // return (
        //     <ManualForm
        //         clean={cleanOrg}
        //         // data={selectedItem}
        //         saveOrganisationData={handleSaveOrganisationData}
        //     />
        // )
    }

    const menuStyle = (): React.CSSProperties => {
        return {
            maxHeight: '70vh',
            maxWidth: '600px',
            minWidth: '440px',
            overflow: 'scroll',
        }
    }

    const renderDropdownContainer = (menu: React.ReactNode) => {
        if (!menu) return null;
        return React.cloneElement(menu as React.ReactElement, { style: menuStyle() })
    }

    const renderCloseIcon = (): React.ReactNode => {
        return (
            <div className={styles['close-icon']}>
                <IoClose size={18}/>
            </div>
        )
    }

    const isOrganisationError = useMemo(() => !!error && error.type === FormError.organisation, [error])
    const isNameError = useMemo(() => !!error && error.type === FormError.name, [error])
    const isTextError = useMemo(() => !!error && error.type === FormError.text, [error])

    return (
        <div className={styles['create-new-claim-form']}>
            <div className={styles['organisation']}>
                <div className={styles['caption']}>Организация</div>
                <div
                    className={classNames(
                        styles['description'],
                        isOrganisationError && styles['_red']
                    )}
                >
                    <span>Введите данные организации или выполните ее поиск</span>
                    {isOrganisationError && <IoWarningOutline className={styles['warning-icon']} size={15}/>}
                </div>
                <div className={styles['pick-block']}>
                    {/*<div className={styles['tabs']}>*/}
                    {/*    <div*/}
                    {/*        onClick={() => handleTabItemClick(OrganisationTabId.search)}*/}
                    {/*        className={classNames(*/}
                    {/*            styles['tabs-item'],*/}
                    {/*            currentOrgTabId === OrganisationTabId.search && styles['_active']*/}
                    {/*        )}*/}
                    {/*    >*/}
                    {/*        Поиск*/}
                    {/*    </div>*/}
                    {/*    <div*/}
                    {/*        onClick={() => handleTabItemClick(OrganisationTabId.manual)}*/}
                    {/*        className={classNames(*/}
                    {/*            styles['tabs-item'],*/}
                    {/*            currentOrgTabId === OrganisationTabId.manual && styles['_active']*/}
                    {/*        )}*/}
                    {/*    >*/}
                    {/*        Ввести вручную*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    <Dropdown
                        autoAdjustOverflow={true}
                        placement="bottomLeft"
                        dropdownRender={renderDropdownContainer}
                        menu={menuItems}
                        open={isDropdownOpen}
                    >
                        <div className={classNames(
                            styles['tabs']
                        )}>
                            <div className={classNames(
                                styles['tabs-item'],
                                styles['_search-input']
                            )}>
                                <Input
                                    value={inputSearchValue}
                                    onChange={handleInputSearch}
                                    rootClassName={styles['org-search']}
                                    size="middle"
                                    placeholder="Введите название, ИНН или ОГРН"
                                    allowClear
                                    bordered={false}
                                />
                            </div>
                            <div
                                className={classNames(
                                    styles['tabs-item'],
                                    styles['icon']
                                )}
                                onClick={handleSearch}
                            >
                                <IoIosSearch size={16} />
                            </div>
                        </div>
                    </Dropdown>
                    {/*<div className={classNames(*/}
                    {/*    styles['tabs'],*/}
                    {/*    styles['_search']*/}
                    {/*)}>*/}
                    {/*    <div*/}
                    {/*        className={classNames(*/}
                    {/*            styles['tabs-item'],*/}
                    {/*            styles['icon'],*/}
                    {/*            styles['_trash']*/}
                    {/*        )}*/}
                    {/*        onClick={() => {}}*/}
                    {/*    >*/}
                    {/*        <IoTrashOutline size={16} />*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
                <div className={styles['content']}>
                    {selectedItem ? renderSelectedItem() : renderOrganisationData()}
                </div>
            </div>
            <TextArea
                bordered={false}
                className={styles['enter-title']}
                placeholder="Введите название"
                onChange={handleChangeClaimName}
                onBlur={handleClaimNameBlur}
                value={cleanText ? '' : claimName}
                autoSize
            />
            <div className={classNames(styles['warning-line'], isNameError && styles['_red'] )} />
            <div className={styles['text']}>
                <div className={styles['claim-text-caption']}>Текст обращения</div>
                <TextEditor
                    onChange={handleChangeTextEditor}
                    placeHolder='Используйте меню выше чтобы форматировать описание'
                    showButtons={false}
                    toolBarClassName={styles['editor-tool-bar']}
                    editTextClassName={classNames(
                        styles['editor-edit-text'],
                        isTextError && styles['_red']
                    )}
                    clean={cleanText}
                    withDraft={true}
                />
            </div>
            <div className={styles['submit-block']}>
                <Button
                    className={styles['cancel-button']}
                    onClick={handleCancelClaim}
                    disabled={!showCancelButton}
                >
                    Отмена
                </Button>
                <Button
                    className={styles['submit-button']}
                    onClick={handleSubmitClaim}
                >
                    Отправить
                </Button>
            </div>
            <Modal
                title={modalContext?.title}
                open={modalOpen}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Подтвердить"
                cancelText="Отмена"
                closeIcon={renderCloseIcon()}
            >
                <div>{modalContext?.text}</div>
            </Modal>
            {contextHolder}
        </div>
    )
})

export default CreateNewClaimForm;