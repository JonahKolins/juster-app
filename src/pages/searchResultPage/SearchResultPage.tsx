import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ScrollablePanel } from "../../controls/panel/ScrollablePanel";
import { ScrollBarVisibility } from "../../controls/scrollArea";
import { ICompanyInfo, searchCompanies } from "../../cmd/network/search/searchService";
import SearchBar from "../../components/searchBar/SearchBar";
import styles from "./SearchResultPage.module.sass";

const SearchResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<ICompanyInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Получаем поисковый запрос из URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("q") || "";
    setSearchQuery(query);

    if (query) {
      performSearch(query);
    }
  }, [location.search]);

  // Выполняем поиск
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

  // Обработчик поиска из поисковой строки
  const handleSearch = (searchText: string) => {
    navigate(`/search?q=${encodeURIComponent(searchText)}`);
  };

  // Обработчик клика по компании
  const handleCompanyClick = (company: ICompanyInfo) => {
    navigate(`/company/${company.id}`);
  };

  return (
    <ScrollablePanel
      vScroll={ScrollBarVisibility.autoWhenScrollOverArea}
      hScroll={ScrollBarVisibility.auto}
    >
      <div className={styles.searchResultPage}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>{`Результаты поиска по запросу "${searchQuery}"`}</h1>
            <div className={styles.searchBarContainer}>
              <SearchBar 
                placeholder="Поиск компании, сервиса, продукта" 
                onSearch={handleSearch}
                withDropdown={true}
              />
            </div>
          </div>

          <div className={styles.resultsInfo}>
            {searchQuery && (
              <h2 className={styles.resultsTitle}>
                {isLoading
                  ? "Поиск..."
                  : `${searchResults.length} компании`}
              </h2>
            )}
          </div>

          {isLoading ? (
            <div className={styles.loading}>Загрузка результатов...</div>
          ) : (
            <div className={styles.resultsList}>
              {searchResults.length > 0 ? (
                searchResults.map((company) => (
                  <div
                    key={company.id}
                    className={styles.companyCard}
                    onClick={() => handleCompanyClick(company)}
                  >
                    <h3 className={styles.companyName}>{company.name}</h3>
                    <div className={styles.companyFullName}>{company.fullName} - {company.description}</div>
                    <div className={styles.companyInfo}>
                      <span className={styles.companyInn}>ИНН: {company.inn}</span>
                      <span className={styles.companyAddress}>{company.address}</span>
                    </div>
                    {/* <p className={styles.companyDescription}>{company.description}</p> */}
                  </div>
                ))
              ) : (
                searchQuery && (
                  <div className={styles.noResults}>
                    <p>По вашему запросу ничего не найдено</p>
                    <p>Попробуйте изменить поисковый запрос или проверить его написание</p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </ScrollablePanel>
  );
};

export default SearchResultPage;