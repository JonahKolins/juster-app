import React, { useState, useCallback, useRef, useEffect } from "react";
import styles from "./SearchBar.module.css";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { IoIosSearch, IoIosArrowRoundForward } from "react-icons/io";
import { ICompanyInfo, searchCompanies } from "cmd/network/search/searchService";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoCloseOutline } from "react-icons/io5";
import { ScrollablePanel } from "controls/panel/ScrollablePanel";
import { ScrollBarVisibility } from "controls/scrollArea";

interface SearchBarProps {
    placeholder?: string;
    onSearch?: (searchText: string) => void;
    className?: string;
    withDropdown?: boolean;
}

interface RoutesObject {
    name: string;
    path: string;
}

const navigationLinks: RoutesObject[] = [
    {name: 'главная', path: '/'},
    {name: 'мои обращения', path: '/mySpace/claims'},
    {name: 'новое обращение', path: '/mySpace/newCliam'},
    {name: 'уведомления', path: '/mySpace/notifications'},
    {name: 'подержка', path: '/support'},
    {name: 'помощь', path: '/support'},
];

const SearchBar: React.FC<SearchBarProps> = ({ 
    placeholder = "Поиск...", 
    onSearch, 
    className,
    withDropdown
}) => {
    const navigate = useNavigate();
    const [text, setText] = useState<string>('');
    const [isHistoryOpened, setIsHistoryOpened] = useState<boolean>(false);
    const [matchedLinks, setMatchedLinks] = useState<RoutesObject[]>([]);
    const [searchResults, setSearchResults] = useState<ICompanyInfo[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [history, setHistory] = useState<string[]>([]);
    
    const inputRef = useRef<HTMLInputElement>(null);
    const searchBarRef = useRef<HTMLDivElement>(null);
    
    // Закрытие истории при клике вне компонента
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
                setIsHistoryOpened(false);
            }
        };
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const tryToFindMatches = useCallback((searchText: string) => {
        if (!searchText) {
            setMatchedLinks([]);
            return;
        }
        
        // const newMatches: RoutesObject[] = [];
        
        // navigationLinks.forEach(link => {
        //     const words = link.name.toLowerCase().split(' ');
            
        //     if (words.some(word => word.includes(searchText.toLowerCase())) || 
        //         link.name.toLowerCase().includes(searchText.toLowerCase())) {
        //         if (!newMatches.some(match => match.path === link.path)) {
        //             newMatches.push(link);
        //         }
        //     }
        // });
        
        // setMatchedLinks(newMatches);
        performSearch(searchText);
    }, []);

    const performSearch = async (query: string) => {
        setIsLoading(true);
        try {
          const results = await searchCompanies(query);
          setSearchResults(results);
        } catch (error) {
          console.error("Ошибка при поиске:", error);
        } finally {
          setIsLoading(false);
        }
      };

    const handleTextChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newText = event.target.value;
        setText(newText);
        tryToFindMatches(newText);
    }, [tryToFindMatches]);

    const handleClearClick = useCallback(() => {
        setText('');
        setMatchedLinks([]);
        setTimeout(() => inputRef.current?.focus(), 0);
    }, []);

    const handleInputFocus = useCallback(() => {
        setIsHistoryOpened(true);
    }, []);

    const handleInputBlur = useCallback(() => {
        // Небольшая задержка, чтобы успеть обработать клик по элементу истории
        setTimeout(() => {
            if (text.length && !history.includes(text)) {
                setHistory(prev => [...prev, text]);
            }
        }, 200);
    }, [text, history]);

    const handleHistoryItemClick = useCallback((item: string) => {
        setText(item);
        tryToFindMatches(item);
    }, [tryToFindMatches]);

    const handleLinkClick = useCallback((path: string) => {
        navigate(path);
        setIsHistoryOpened(false);
    }, [navigate]);

    // Обработчик клика по компании
    const handleCompanyClick = (company: ICompanyInfo) => {
        navigate(`/company/${company.id}`);
    };

    const handleSearch = useCallback(() => {
        if (text.trim()) {
            if (onSearch) {
                onSearch(text);
            } else {
                // Если нет внешнего обработчика поиска, можно перенаправить на страницу поиска
                navigate(`/search?q=${encodeURIComponent(text)}`);
            }
            
            if (!history.includes(text)) {
                setHistory(prev => [...prev, text]);
            }
            
            setIsHistoryOpened(false);
        }
    }, [text, history, onSearch, navigate]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }, [handleSearch]);

    return (
        <div className={classNames(styles['search-bar'], className)} ref={searchBarRef}>
            <div
                className={classNames(
                    styles['input-frame'],
                    isHistoryOpened && styles['_active']
                )}
            >
                <div className={styles['search-icon']}>
                    <IoIosSearch size={18} />
                </div>
                <input
                    placeholder={placeholder}
                    spellCheck={false}
                    value={text}
                    onChange={handleTextChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onKeyPress={handleKeyPress}
                    ref={inputRef}
                />
                {isLoading && (
                    <div 
                        className={classNames(styles['clear-icon'], styles['_rotate'])} 
                        aria-label="Загрузка"
                    >
                        <AiOutlineLoading3Quarters />
                    </div>
                )}
                {text && (
                    <div 
                        className={styles['clear-icon']} 
                        onClick={handleClearClick} 
                        aria-label="Очистить поле поиска"
                    >
                        <IoCloseOutline size={20} />
                    </div>
                )}
                {/* <div 
                    className={styles['search-button']}
                    onClick={handleSearch}
                    aria-label="Поиск"
                >
                    <IoIosSearch size={18} />
                </div> */}
            </div>
            {withDropdown && !!text && (
                <div 
                    className={classNames(
                        styles['history'],
                        isHistoryOpened && styles['history-open']
                    )}
                >
                    <ScrollablePanel
                        vScroll={ScrollBarVisibility.autoWhenScrollOverArea}
                        hScroll={ScrollBarVisibility.auto}
                        className={styles['history-container']}
                    >
                        {!text ? (
                            <>
                                <div className={styles['history-title']}>
                                    История поиска
                                </div>
                                <div className={styles['items']}>
                                    {history.length > 0 ? (
                                        history.map((item, index) => (
                                            <div
                                                key={`${item}${index}`}
                                                className={styles['history-item-container']}
                                                onClick={() => handleHistoryItemClick(item)}
                                            >
                                                <div className={styles['links']}>
                                                    {item}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className={styles['empty-history']}>
                                            Пока пусто
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className={styles['items']}>
                                {searchResults.length > 0 
                                    ? (
                                        searchResults.map((resultItem, index) => (
                                            <div
                                                key={`${resultItem.id}.${index}`}
                                                className={styles['link-container']}
                                                onClick={() => handleCompanyClick(resultItem)}
                                            >
                                                <div className={styles['link-icon']}>
                                                    <IoIosArrowRoundForward />
                                                </div>
                                                <div
                                                    className={styles['links']}
                                                >
                                                    {resultItem.name}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className={styles['no-results']}>
                                            Ничего не найдено
                                        </div>
                                    )
                                }
                            </div>
                        )}
                    </ScrollablePanel>
                </div>
            )}
        </div>
    );
};

export default SearchBar;