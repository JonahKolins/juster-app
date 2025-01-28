import React, {FC, useCallback, useState} from "react";
import styles from "./SearchOrganisationForm.module.sass";
import {AutoComplete, Input} from "antd";
import ManualForm from "../ManualForm";
import { getRespondentSuggestions } from "../../api/methods/getOrganisationSuggestionsRequest";
import {ISuggestions} from "../../api/requests/GetOrganisationSuggestionsRequest";
import {SavedOrgData} from "../../clientProblemData/ClientProblemData";

interface IOptions {
    value: string
    label: JSX.Element
}

interface ISuggestionOptions {
    label: JSX.Element
    options?: IOptions[]
}

interface SearchOrganisationFormProps {
    disabled?: boolean;
    submitSearchOrganisation: (result: SavedOrgData) => void;
}

const SearchOrganisationForm: FC<SearchOrganisationFormProps> = ({disabled, submitSearchOrganisation}) => {
    const [searchResult, setSearchResult] = useState<ISuggestions[]>(null);
    const [options, setOptions] = useState<ISuggestionOptions[]>([]);
    const [isManualMode, setIsManualMode] = useState<boolean>(false);
    const [selectedOrganisation, setSelectedOrganisation] = useState<ISuggestions>(null);

    const renderTitle = (title: string) => <span>{title}</span>;

    const enterDataManually = () => {
        setSelectedOrganisation(null);
        setIsManualMode(!isManualMode);
    }

    const renderErrorTitle = (title: string) => (
        <span>
            {title}
            <span  style={{ float: 'right', color: "var(--base-color__button)", cursor: "pointer" }} onClick={enterDataManually}>
                Ввести данные вручную
            </span>
        </span>
    )

    const renderItem = (item: ISuggestions, index?: number) => ({
        value: item.value,
        label: (
            <div key={`${item.value + index}`}>
                <div>{item.value}</div>
                <div>{item.data.inn}</div>
                <div>{item.data.address.value}</div>
            </div>
        ),
    });

    // переводим данные с сервера в опции для показа
    const setSuggestionsInOptions = useCallback((suggestions: ISuggestions[]) => {
        if (!suggestions.length) {
            setOptions([])
            return
        }
        const suggestionsOptions = suggestions.map((item, index) => renderItem(item, index))
        const result = {
            label: renderTitle('Организации'),
            options: suggestionsOptions,
        }
        setOptions([result])
    }, [])

    // поиск организаций (подсказок)
    const searchHandle = useCallback((value: string) => {
        getRespondentSuggestions(value)
            .then((res) => {
                console.log('res', res.suggestions)
                setSearchResult(res.suggestions)
                setSuggestionsInOptions(res.suggestions)
            })
            .catch((err) => {
                console.log('error', err)
                setSearchResult(null)
                setOptions([{label: renderErrorTitle('Произошла ошибка')}])
            })
    }, [renderErrorTitle, setSuggestionsInOptions])

    // реакция на выбор организации
    const onSelect = (value: string) => {
        if (!searchResult) return;

        const selectedOrganisation = searchResult.find((item) => item.value === value);
        if (selectedOrganisation) {
            setSelectedOrganisation(selectedOrganisation)
            setIsManualMode(true)
        }
    };

    const saveHandle = (data: SavedOrgData) => {
        submitSearchOrganisation(data)
    }

    return (
        <div className={styles.organization}>
            <div className={styles.subTitle}>Организация</div>
            <AutoComplete
                dropdownMatchSelectWidth={500}
                options={options}
                style={{ display: 'block' }}
                onSelect={onSelect}
                // onSearch={searchHandle}
            >
                <Input.Search
                    loading={false}
                    onSearch={searchHandle}
                    size="middle"
                    placeholder="Введите название, ИНН или ОГРН"
                    allowClear
                    disabled={disabled}
                />
            </AutoComplete>
            <div className={styles.enterData}>
                <div style={{cursor: 'pointer'}} onClick={enterDataManually}>
                    {isManualMode ? "Закрыть" : "Ввести данные вручную"}
                </div>
            </div>
            {isManualMode && <ManualForm saveOrganisationData={saveHandle} selectedOrganisation={selectedOrganisation} />}
        </div>
    )
}

export default SearchOrganisationForm;