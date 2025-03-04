import companiesData from '../../mocks/companiesDataExtended.json';

export interface ICompanyInfo {
  id: number;
  name: string;
  fullName: string;
  inn: string;
  description: string;
  address: string;
  email?: string;
  logoUrl?: string;
  rating: number;
  claimsCount: number;
  claims: ICompanyClaim[];
}

export interface ICompanyClaim {
  id: number;
  title: string;
  status: string;
  date: string;
  description: string;
  isPublic: boolean;
}

export const getCompanyById = (id: number): Promise<ICompanyInfo | null> => {
  // Имитация задержки сетевого запроса
  return new Promise((resolve) => {
    setTimeout(() => {
      const company = companiesData.find((c) => c.id === id) || null;
      resolve(company);
    }, 300);
  });
}; 