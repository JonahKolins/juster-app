import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ScrollablePanel } from "../../controls/panel/ScrollablePanel";
import { ScrollBarVisibility } from "../../controls/scrollArea";
import { ICompanyInfo, getCompanyById } from "../../cmd/network/company/companyService";
import styles from "./CompanyPage.module.sass";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { FiMail, FiMapPin } from "react-icons/fi";
import { BsBuilding, BsFileEarmarkText } from "react-icons/bs";
import CompanyInfo from "components/companyInfo/CompanyInfo";
import { LoaderCircle } from "designSystem/loader/Loader.Circle";

//TODO переделать
const CompanyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<ICompanyInfo>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      setIsLoading(true);
      try {
        if (!id) {
          throw new Error("ID компании не указан");
        }
        
        const companyData = await getCompanyById(parseInt(id));
        if (!companyData) {
          throw new Error("Компания не найдена");
        }
        
        setCompany(companyData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Произошла ошибка при загрузке компании");
        setCompany(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  const handleCreateClaimClick = () => {
    navigate(`/mySpace/newRequest?companyId=${id}`);
  };

  // Рендерим звездочки рейтинга
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className={styles.star} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className={styles.star} />);
      } else {
        stars.push(<FaRegStar key={i} className={styles.star} />);
      }
    }
    
    return (
      <div className={styles.ratingStars}>
        {stars}
        <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Форматирование статуса для отображения соответствующего стиля
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'решено':
        return styles.statusResolved;
      case 'в обработке':
        return styles.statusProcessing;
      case 'рассмотрено':
        return styles.statusReviewed;
      case 'закрыто':
        return styles.statusClosed;
      default:
        return '';
    }
  };

  const renderError = (): React.JSX.Element => {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>{error}</div>
        <button 
          className={styles.goBackButton}
          onClick={() => navigate(-1)}
        >
          Вернуться назад
        </button>
      </div>
    )
  }

  return (
    <ScrollablePanel
      vScroll={ScrollBarVisibility.autoWhenScrollOverArea}
      hScroll={ScrollBarVisibility.auto}
    >
      <div className={styles['page-body']}>
        {isLoading 
          ? <LoaderCircle />
          : (
            <div className={styles['company-section']}>
              <div className={styles['content-container']}>
              {error 
                ? renderError()
                : company 
                  ? <CompanyInfo info={company} />
                  : null
              }
              </div>
            </div>
        )}
      </div>
    </ScrollablePanel>
  );
};

export default CompanyPage;