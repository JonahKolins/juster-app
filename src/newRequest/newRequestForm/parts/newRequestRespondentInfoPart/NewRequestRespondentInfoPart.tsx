import React, {ChangeEvent, memo, useCallback, useEffect, useMemo, useState} from "react";
import styles from "./NewRequestRespondentInfoPart.module.sass";
import Button from "../../../../designSystem/button/Button";
import classNames from "classnames";
import {Dropdown, Input, MenuProps} from "antd";
import {IoIosSearch} from "react-icons/io";
import ManualForm from "../../../createForm/manualForm/ManualForm";
import {ISuggestions} from "../../../api/requests/GetOrganisationSuggestionsRequest";
import {HiOutlineInbox} from "react-icons/hi2";
import OrganisationForm from "../../components/organisationForm/OrganisationForm";
import { ClaimCreator } from "classes/claim/ClaimCreator";
import { IMinRespondentData } from "classes/claim/Claim.Types";

interface NewRequestRespondentInfoPartProps {
    onPrevPageClick: () => void;
    onNextPageClick: () => void;
}

const CAPTION = 'Информация об организации';
const NO_RESPONDENT_CAPTION = 'Нет организаций соответствующих вашему запросу';

const NewRequestRespondentInfoPart = memo<NewRequestRespondentInfoPartProps>(({onPrevPageClick, onNextPageClick}) => {
    // данные "Ответчика"
    const [respondentData, setRespondentData] = useState<IMinRespondentData>(ClaimCreator.instance.minRespondentData);
    const [inputSearchValue, setInputSearchValue] = useState<string>('');
    const [dropdownItems, setDropdownItems] = useState<MenuProps['items']>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<IMinRespondentData>(ClaimCreator.instance.minRespondentData);
    // id партнера
    const [partnerId, setPartnerId] = useState<string>(ClaimCreator.instance.partnerId);
    // есть ли уведомление о добавлении партнера
    const [isAddedInfoNoticeVisible, setIsAddedInfoNoticeVisible] = useState<boolean>(!!partnerId);
    // есть изменения, которые нужно сохранить
    const [hasChangesToSave, setHasChangesToSave] = useState<boolean>(false);

    useEffect(() => {
        ClaimCreator.instance.claimCreatorDataChanged.subscribe(handleClaimCreatorDataChanged);
        handleClaimCreatorDataChanged();
    }, [])

    const handleClaimCreatorDataChanged = () => {
        setRespondentData(ClaimCreator.instance.minRespondentData);
        setPartnerId(ClaimCreator.instance.partnerId);
    }

    const renderNothingFoundItem = () => {
        return (
            <div className={styles['nothing-found-menu-item']}>
                <HiOutlineInbox />
                <span className={styles['nothing-found-text']}>{NO_RESPONDENT_CAPTION}</span>
            </div>
        )
    }

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

    // обработка ввода в поле поиска
    const handleInputSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) setIsDropdownOpen(false);
        setInputSearchValue(e.target.value);
    }, [])

    const renderMenuItem = (item: ISuggestions, index?: number): JSX.Element => {
        return (
            <div className={styles['menu-item']} key={`${item.value + index}`}>
                <span className={styles['item-name']}>{item.value}</span><span><span className={styles['item-key']}>инн:</span> {item.data.inn}</span>
                <div>{item.data.address.value}</div>
            </div>
        )
    }

    // обработка выбора найденной организации
    const handleDropdownItemClick = useCallback((item: ISuggestions) => {
        // для показа сохраняем только минимальные данные
        const respondentData: IMinRespondentData = {
            inn: item.data.inn,
            name: item.value,
            address: item.data.address.value
        }
        // для показа формы найденной организации
        setSelectedItem(respondentData);
        // полные данные сохраняем в ClaimCreator
        ClaimCreator.instance.setRespondent(respondentData);
        // закрываем меню
        setIsDropdownOpen(false);
        // если был добавлен партнер, то скрываем уведомление
        if (isAddedInfoNoticeVisible) {
            setIsAddedInfoNoticeVisible(false);
            ClaimCreator.instance.setPartnerId('');
        }
        // есть изменения, которые нужно сохранить
        setHasChangesToSave(true);
    }, [])

    // создает меню выбора "ответчика"
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

    // выполняет поиск по введенному значению и создает меню выбора "ответчика"
    const handleSearch = useCallback(() => {
        if (!inputSearchValue) return;
        //
        ClaimCreator.instance.searchSuggestion(inputSearchValue)
            .then((suggestions) => {
                console.log('res', suggestions)
                createMenuItems(suggestions);
            })
            .catch((err) => {
                console.log('error', err)
            })
    }, [inputSearchValue])

    // обработка сохранения данных вручную
    const handleSaveManualForm = useCallback((data: IMinRespondentData) => {
        // сохраняем данные
        setRespondentData(data);
        // сохраняем данные в ClaimCreator
        ClaimCreator.instance.setRespondent(data);
        // есть изменения, которые нужно сохранить
        setHasChangesToSave(true);
    }, [])

    // форма для ввода данных вручную
    const renderManualForm = (): JSX.Element => {
        return <ManualForm data={respondentData} saveRespondentData={handleSaveManualForm} />
    }

    // закрытие формы найденной организации
    const handleCloseRespondentForm = () => {
        setSelectedItem(null);
        // если был добавлен партнер, то скрываем уведомление
        if (isAddedInfoNoticeVisible) {
            setIsAddedInfoNoticeVisible(false);
            ClaimCreator.instance.setPartnerId('');
        }
    }

    // форма найденной организации
    const renderSelectedItem = (): JSX.Element => {
        if (!selectedItem) return null;
        return (
            <OrganisationForm data={selectedItem} onClose={handleCloseRespondentForm} />
        )
    }

    const isNextButtonDisabled = useMemo<boolean>(() => {
        if (selectedItem) return !selectedItem;

        if (!respondentData) return true;

        return !Object.values(respondentData).every((val) => !!val)
    }, [respondentData, selectedItem])

    const handlePrevPageClick = () => {
        // если есть изменения и есть данные, то обновляем черновик
        if (hasChangesToSave && !!(selectedItem || respondentData)) {
            // обновляем черновик только если есть изменения
            ClaimCreator.instance.updateDraft()
                .then(() => {
                    // можно показать загрузку
                })
                .catch(() => {
                    // можно показать ошибку
                })
        }
        setHasChangesToSave(false);
        onPrevPageClick();
    }

    const handleNextPageClick = () => {
        // если есть изменения и есть данные, то обновляем черновик
        if (hasChangesToSave && !!(selectedItem || respondentData)) {
            ClaimCreator.instance.updateDraft()
                .then(() => {
                    // можно показать загрузку
                })
                .catch(() => {
                    // можно показать ошибку
                })
        }
        setHasChangesToSave(false);
        onNextPageClick();
    }    

    return (
        <div className={styles['info-container']}>
            <h2 className={styles['caption']}>{CAPTION}</h2>
            <div className={styles['description']}>Воспользуйтесь поиском или впишите данные организации вручную. <br />Описание подраздела Описание подраздела Описание подраздела Описание подраздела Описание подраздела Описание подраздела Описание подраздела</div>
            <div className={styles['org-part-content']}>
                <div className={styles['pick-block']}>
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
                </div>
            </div>
            {isAddedInfoNoticeVisible && (
                <div className={styles['notice']}>
                    <div className={styles['notice-caption']}>Организация добавлена. Можете пропустить этот шаг</div>
                    <div className={styles['notice-text']}>Если данные неверны, вы можете выполнить поиск или ввести информацию вручную удалив текущий выбор.</div>
                </div>
            )}
            <div className={styles['content']}>
                {selectedItem ? renderSelectedItem() : renderManualForm()}
            </div>
            <div className={styles['buttons']}>
                <Button onClick={handlePrevPageClick} className={styles['back-btn']}>Назад</Button>
                <Button disabled={isNextButtonDisabled} onClick={handleNextPageClick} className={styles['next-btn']}>Далее</Button>
            </div>
        </div>
    )
})

export default NewRequestRespondentInfoPart;