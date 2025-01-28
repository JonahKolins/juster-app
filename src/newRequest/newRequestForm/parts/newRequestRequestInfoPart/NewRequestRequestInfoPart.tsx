import React, {memo, useCallback, useEffect, useState} from "react";
import styles from "./NewRequestRequestInfoPart.module.sass";
import Button from "../../../../designSystem/button/Button";
import TextEditor from "../../../../requestItem/textEditor/TextEditor";
import classNames from "classnames";
import {UploadFile} from "antd";
import {Input, InputSize} from "../../../../designSystem/input";
import { ClaimCreator } from "classes/claim/ClaimCreator";
import { IClaimReasonId } from "classes/claim/Claim.Types";

interface NewRequestRequestInfoPartProps {
    onPrevPageClick: () => void;
    onNextPageClick: () => void;
}

const CAPTION = 'Обращение';

const NewRequestRequestInfoPart = memo<NewRequestRequestInfoPartProps>(({onPrevPageClick, onNextPageClick}) => {
    // id причины
    const [reasonId, setReasonId] = useState<IClaimReasonId>(ClaimCreator.instance.claimInfo?.reason?.id);
    // текст обращения
    const [descriptionText, setDescriptionText] = useState<string>(ClaimCreator.instance.claimInfo?.text || '');
    // файлы
    const [savedFiles, setSavedFiles] = useState<UploadFile[]>(ClaimCreator.instance.files);
    // флаг наличия изменений
    const [hasChangesToSave, setHasChangesToSave] = useState<boolean>(false);
    // ссылка на товар или услугу
    const [linkValue, setLinkValue] = useState<string>('');
    // ошибка
    const [error, setError] = useState<string>('');

    useEffect(() => {
        ClaimCreator.instance.claimCreatorDataChanged.subscribe(handleClaimCreatorDataChanged);
        handleClaimCreatorDataChanged();
    }, [])

    const handleClaimCreatorDataChanged = () => {
        const newId = ClaimCreator.instance.claimInfo?.reason?.id;
        if (!newId) {
            setReasonId(null);
            return;
        }

        if (newId !== reasonId) {
            setReasonId(newId);
        }
    }

    const handleChangeTextEditor = useCallback((text: string, files: UploadFile[]) => {
        // сохраняем текст
        setDescriptionText(text || '');
        ClaimCreator.instance.setText(text || '');
        // очищаем ошибку
        setError('');
        // сохраняем файлы
        const newFiles = files.length ? [...savedFiles, ...files] : [];
        // если есть изменения, то устанавливаем флаг
        if (text || newFiles.length) {
            setHasChangesToSave(true);
        }
        if (newFiles.length) {
            setSavedFiles(newFiles);
            // сохраняем файлы в класс
            ClaimCreator.instance.saveFiles(files)
                .then(() => {
                    // можно показать загрузку
                })
                .catch((error) => {
                    // можно показать ошибку
                    console.log('NewRequestRequestInfoPart: Ошибка при сохранении файлов:', error);
                })
        }
    }, [])

    const onLinkInputChange = (value: string) => {
        setLinkValue(value)
    }

    const handlePrevPageClick = () => {
        if (hasChangesToSave) {
            // отправляем запрос на создание черновика
            ClaimCreator.instance.updateDraft()
                .then(() => {
                    // можно показать загрузку
                })
                .catch(() => {
                    // можно показать ошибку
                })
        }
        onPrevPageClick();
    }

    const handleNextPageClick = () => {
        if (hasChangesToSave) {
            // отправляем запрос на создание черновика
            ClaimCreator.instance.updateDraft()
                .then(() => {
                    // можно показать загрузку
                })
                .catch(() => {
                    // можно показать ошибку
                })
        }
        onNextPageClick();
    }

    const renderContentByReasonId = () => {
        switch (reasonId) {
            case 3: {
                return (
                    <>
                        <div className={styles['description-caption']}>Ссылка на товар или услугу</div>
                        <Input
                            value={linkValue}
                            style={{marginBottom: '12px'}}
                            placeholder={'https://example.com'}
                            tabIndex={0}
                            onChange={onLinkInputChange}
                            size={InputSize.Medium}
                            name='link'
                        />
                    </>
                )
            }
        }
    }

    return (
        <div className={styles['request-info']}>
            <h2 className={styles['caption']}>{CAPTION}</h2>
            <div className={styles['description']}>
                {renderContentByReasonId()}
                <div className={styles['description-caption']}>Текст обращения</div>
                <TextEditor
                    value={descriptionText}
                    files={savedFiles}
                    onChange={handleChangeTextEditor}
                    placeHolder='Используйте меню выше чтобы форматировать описание'
                    showButtons={false}
                    toolBarClassName={styles['editor-tool-bar']}
                    editTextClassName={classNames(
                        styles['editor-edit-text'],
                        // isTextError && styles['_red']
                    )}
                    withDraft={true}
                />
            </div>
            <div className={styles['buttons']}>
                <Button onClick={handlePrevPageClick} className={styles['back-btn']}>Назад</Button>
                <Button disabled={!descriptionText} onClick={handleNextPageClick} className={styles['next-btn']}>Далее</Button>
            </div>
        </div>
    )
})

export default NewRequestRequestInfoPart;