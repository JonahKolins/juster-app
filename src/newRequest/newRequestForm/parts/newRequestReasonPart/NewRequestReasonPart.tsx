import React, {memo, useEffect, useState} from "react";
import styles from "./NewRequestReasonPart.module.sass";
import classNames from "classnames";
import Button from "../../../../designSystem/button/Button";
import { ClaimCreator } from "../../../../classes/claim/ClaimCreator";
import { IClaimReason, IClaimReasonId } from "../../../../classes/claim/Claim.Types";

interface NewRequestReasonPartProps {
    onNextPageClick: () => void;
}

const CAPTION = 'Причина обращения';

const reasons: IClaimReason[] = [
    {id: 1, text: 'Неисполнение условий договора'},
    {id: 2, text: 'Обман и мошенничество'},
    {id: 3, text: 'Некачественный товар и услуга'},
    {id: 4, text: 'Незаконное удержание денежных средств'},
    {id: 5, text: 'Нарушение прав на персональные данные'},
    {id: 6, text: 'Проблемы с гарантийным обслуживанием'},
    {id: 7, text: 'Мои права были нарушены. Обращение в свободной форме'},
]

const NewRequestReasonPart = memo<NewRequestReasonPartProps>(({onNextPageClick}) => {
    const [selectedReasonId, setSelectedReasonId] = useState<IClaimReasonId>(null);
    const [hasChangesToSave, setHasChangesToSave] = useState(false);

    useEffect(() => {
        ClaimCreator.instance.claimCreatorDataChanged.subscribe(handleClaimCreatorDataChanged);
        handleClaimCreatorDataChanged();
    }, [])

    const handleClaimCreatorDataChanged = () => {
        const newId = ClaimCreator.instance.claimInfo?.reason?.id;
        if (!newId) {
            setSelectedReasonId(null);
            return;
        }

        if (newId !== selectedReasonId) {
            setSelectedReasonId(newId);
        }
    }

    const handleSelectReason = (item: IClaimReason) => {
        if (item.id === selectedReasonId) {
            setSelectedReasonId(null);
            ClaimCreator.instance.setReason(null);
            return;
        }

        setSelectedReasonId(item.id);
        ClaimCreator.instance.setReason(item);
        setHasChangesToSave(true);
    }

    const handleNextPageClick = () => {
        // есть ли изменения, которые нужно сохранить
        if (hasChangesToSave) {
            // отправляем запрос на создание или обновление черновика
            ClaimCreator.instance.createOrUpdateDraft()
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
        <div className={styles['reason-part']}>
            <h2 className={styles['caption']}>{CAPTION}</h2>
            <div>Описание подраздела Описание подраздела Описание подраздела Описание подраздела Описание подраздела Описание подраздела Описание подраздела</div>
            {reasons.map((item) => (
                <div
                    key={item.id}
                    className={classNames(
                        styles['reason-item'],
                        item.id === selectedReasonId && styles['_selected']
                    )}
                    onClick={() => handleSelectReason(item)}
                >
                    {item.text}
                </div>
            ))}
            <div className={styles['buttons']}>
                <Button disabled={!selectedReasonId} onClick={handleNextPageClick}>Далее</Button>
            </div>
        </div>
    )
})

export default NewRequestReasonPart;