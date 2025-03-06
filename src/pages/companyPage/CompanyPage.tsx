import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ScrollablePanel } from "../../controls/panel/ScrollablePanel";
import { ScrollBarVisibility } from "../../controls/scrollArea";
import { ICompanyInfo, ICompanyClaim, getCompanyById } from "../../cmd/network/company/companyService";
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

  return (
    <ScrollablePanel
      vScroll={ScrollBarVisibility.autoWhenScrollOverArea}
      hScroll={ScrollBarVisibility.auto}
    >
      <div className={styles['page-body']}>
        {isLoading ? (
            <LoaderCircle />
          ) : (
            <div className={styles['company-section']}>
              <div className={styles['content-container']}>
              {error ? (
                <div className={styles.errorContainer}>
                  <div className={styles.errorMessage}>{error}</div>
                  <button 
                    className={styles.goBackButton}
                    onClick={() => navigate(-1)}
                  >
                    Вернуться назад
                  </button>
                </div>
              ) : company ? (
                <CompanyInfo info={company} />
                // <div className={styles.container}>
                //   <div className={styles.header}>
                //     <div className={styles.companyHeader}>
                //       <div className={styles.logoContainer}>
                //         {company.logoUrl ? (
                //           <img src={company.logoUrl} alt={company.name} className={styles.logo} />
                //         ) : (
                //           <div className={styles.placeholderLogo}>
                //             {company.name.charAt(0)}
                //           </div>
                //         )}
                //       </div>
                //       <div className={styles.companyInfo}>
                //         <h1 className={styles.companyName}>{company.name}</h1>
                //         <div className={styles.companyFullName}>{company.fullName}</div>
                        
                //         <div className={styles.companyRating}>
                //           {renderRatingStars(company.rating)}
                //           <span className={styles.claimsCount}>
                //             {company.claimsCount} обращений
                //           </span>
                //         </div>
                //       </div>
                //       <button 
                //         className={styles.createClaimButton}
                //         onClick={handleCreateClaimClick}
                //       >
                //         Написать обращение
                //       </button>
                //     </div>
                //   </div>
                  
                //   <div className={styles.detailsSection}>
                //     <div className={styles.detailsCard}>
                //       <h2 className={styles.sectionTitle}>Информация о компании</h2>
                //       <div className={styles.detailsGrid}>
                //         <div className={styles.detailItem}>
                //           <BsBuilding className={styles.detailIcon} />
                //           <div className={styles.detailContent}>
                //             <div className={styles.detailLabel}>ИНН</div>
                //             <div className={styles.detailValue}>{company.inn}</div>
                //           </div>
                //         </div>
                        
                //         <div className={styles.detailItem}>
                //           <FiMapPin className={styles.detailIcon} />
                //           <div className={styles.detailContent}>
                //             <div className={styles.detailLabel}>Адрес</div>
                //             <div className={styles.detailValue}>{company.address}</div>
                //           </div>
                //         </div>
                        
                //         {company.email && (
                //           <div className={styles.detailItem}>
                //             <FiMail className={styles.detailIcon} />
                //             <div className={styles.detailContent}>
                //               <div className={styles.detailLabel}>Email</div>
                //               <div className={styles.detailValue}>{company.email}</div>
                //             </div>
                //           </div>
                //         )}
                        
                //         <div className={styles.detailItem}>
                //           <BsFileEarmarkText className={styles.detailIcon} />
                //           <div className={styles.detailContent}>
                //             <div className={styles.detailLabel}>Описание</div>
                //             <div className={styles.detailValue}>{company.description}</div>
                //           </div>
                //         </div>
                //       </div>
                //     </div>
                //   </div>
                  
                //   <div className={styles.claimsSection}>
                //     <h2 className={styles.sectionTitle}>
                //       Обращения
                //       <span className={styles.claimsCounter}>{company.claims.length}</span>
                //     </h2>
                    
                //     {company.claims.length > 0 ? (
                //       <div className={styles.claimsList}>
                //         {company.claims.map((claim: ICompanyClaim) => (
                //           <div key={claim.id} className={styles.claimCard}>
                //             <div className={styles.claimHeader}>
                //               <h3 className={styles.claimTitle}>{claim.title}</h3>
                //               <div className={`${styles.claimStatus} ${getStatusClass(claim.status)}`}>
                //                 {claim.status}
                //               </div>
                //             </div>
                            
                //             <div className={styles.claimInfo}>
                //               <div className={styles.claimDate}>
                //                 {new Date(claim.date).toLocaleDateString('ru-RU', {
                //                   day: 'numeric',
                //                   month: 'long',
                //                   year: 'numeric'
                //                 })}
                //               </div>
                //               {claim.isPublic && (
                //                 <div className={styles.publicBadge}>Публичное</div>
                //               )}
                //             </div>
                            
                //             <p className={styles.claimDescription}>{claim.description}</p>
                //           </div>
                //         ))}
                //       </div>
                //     ) : (
                //       <div className={styles.emptyClaimsList}>
                //         <p>Пока нет обращений</p>
                //       </div>
                //     )}
                //   </div>
                // </div>
              ) : null}
              </div>
            </div>
        )}
      </div>
    </ScrollablePanel>
  );
};

export default CompanyPage;