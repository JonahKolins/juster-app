import { IClaimsItem } from 'classes/claim/Claim.Types';
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
  resolvedClaimsCount: number,
  unresolvedClaimsCount: number,
  resolvedPercentage: number,
  searchKeywords: string[],
  claims: IClaimsItem[];
}


export const getCompanyById = (id: number): Promise<ICompanyInfo> => {
  // Имитация задержки сетевого запроса
  return new Promise((resolve) => {
    setTimeout(() => {
      const company = companiesData.find((c) => c.id === id) || null;
      resolve(company as ICompanyInfo);
    }, 300);
  });
}; 