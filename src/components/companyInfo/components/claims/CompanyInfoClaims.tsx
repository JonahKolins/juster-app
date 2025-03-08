import React, { useState, useEffect, useMemo } from 'react';
import styles from './CompanyInfoClaims.module.sass';
import { IClaimsItem, IClaimStatus } from 'classes/claim/Claim.Types';
import { Input, Dropdown, Tag, Empty, Button } from 'antd';
import { SearchOutlined, CloseOutlined, FilterOutlined } from '@ant-design/icons';
import ClaimItem from './ClaimItem';


interface CompanyInfoClaimsProps {
    claims: IClaimsItem[];
    searchKeywords?: string[];
}

type FilterType = 'all' | 'resolved' | 'unresolved';

const CompanyInfoClaims = React.memo<CompanyInfoClaimsProps>(({ claims, searchKeywords = [] }) => {
    const [searchText, setSearchText] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [visibleClaims, setVisibleClaims] = useState<IClaimsItem[]>(claims || []);

    // Функция фильтрации обращений
    const filterClaims = useMemo(() => {
        return (claimsToFilter: IClaimsItem[]): IClaimsItem[] => {
            let result = [...claimsToFilter];
            
            // Фильтрация по статусу
            if (activeFilter === 'resolved') {
                result = result.filter(claim => 
                    claim.claimInfo.status === IClaimStatus.resolved || 
                    claim.claimInfo.status === IClaimStatus.close
                );
            } else if (activeFilter === 'unresolved') {
                result = result.filter(claim => 
                    claim.claimInfo.status !== IClaimStatus.resolved && 
                    claim.claimInfo.status !== IClaimStatus.close
                );
            }
            
            // Фильтрация по поисковому запросу (если есть минимум 3 символа)
            if (searchText.length >= 3) {
                const searchLower = searchText.toLowerCase();
                result = result.filter(claim => 
                    claim.claimInfo.claimName.toLowerCase().includes(searchLower) || 
                    claim.claimInfo.textClaim.toLowerCase().includes(searchLower)
                );
            }
            
            return result;
        };
    }, [activeFilter, searchText]);

    // При изменении фильтров или данных, обновляем видимые обращения
    useEffect(() => {
        if (claims) {
            setVisibleClaims(filterClaims(claims));
        }
    }, [claims, activeFilter, searchText, filterClaims]);

    // Обработчик изменения поискового запроса
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    // Добавление ключевого слова в поиск
    const handleKeywordClick = (keyword: string) => {
        setSearchText(keyword);
    };

    // Сброс активного фильтра
    const clearFilter = () => {
        setActiveFilter('all');
    };

    // Опции для выпадающего списка фильтров
    const filterMenuItems = [
        {
            key: 'all',
            label: 'Все обращения',
            onClick: () => setActiveFilter('all')
        },
        {
            key: 'resolved',
            label: 'Решенные обращения',
            onClick: () => setActiveFilter('resolved')
        },
        {
            key: 'unresolved',
            label: 'Нерешенные обращения',
            onClick: () => setActiveFilter('unresolved')
        }
    ];

    if (!claims?.length) {
        return (
            <div className={styles['empty-claims']}>
                <Empty description="Нет обращений" />
            </div>
        );
    }

    return (
        <div className={styles['company-info-claims']}>
            <div className={styles['header']}>
                <div className={styles['search']}>
                    <Input
                        placeholder="Поиск обращений..."
                        prefix={<SearchOutlined />}
                        allowClear
                        value={searchText}
                        onChange={handleSearchChange}
                        className={styles['search-input']}
                    />
                    <Dropdown 
                        menu={{ items: filterMenuItems }} 
                        trigger={['click']}
                        className={styles['filter-dropdown']}
                    >
                        <Button type="default" icon={<FilterOutlined />}>
                        </Button>
                    </Dropdown>
                </div>
                
                {activeFilter !== 'all' && (
                    <div className={styles['active-filters']}>
                        <Tag 
                            closable 
                            onClose={clearFilter}
                            color="purple"
                            className={styles['filter-tag']}
                        >
                            {activeFilter === 'resolved' ? 'Решенные' : 'Нерешенные'}
                        </Tag>
                    </div>
                )}
                
                <div className={styles['keywords']}>
                    {searchKeywords.map((keyword, index) => (
                        <Tag 
                            key={index}
                            color="default"
                            onClick={() => handleKeywordClick(keyword)}
                            className={styles['keyword-tag']}
                        >
                            {keyword}
                        </Tag>
                    ))}
                </div>
            </div>
            <div className={styles['list']}>
                {visibleClaims.length > 0 
                    ? (
                        visibleClaims.map((claim, index, arr) => (
                            <ClaimItem key={claim.genId} claim={claim} isLast={arr[arr.length - 1].genId == claim.genId} />
                        ))
                    ) : (
                        <Empty description="Обращения не найдены" />
                    )
                }
            </div>
        </div>
    );
});

export default CompanyInfoClaims;