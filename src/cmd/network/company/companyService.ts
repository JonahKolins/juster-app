import { IClaimsPublicItem } from 'classes/claim/Claim.Types';
import companiesData from '../../mocks/companiesDataExtended.json';

export enum ICompanyCategoryAlias {
  finance = 'finance',
  energy = 'energy',
  it = 'it',
  telecommunication = 'telecommunication',
  retail = 'retail',
  gambling = 'gambling',
  busAndRail = 'busAndRail',
  airlines = 'airlines',
  industrial = 'industrial'
}

export interface ICompanyCategory {
  name: string;
  alias: ICompanyCategoryAlias;
}

export interface ICompanyInCategory {
  place: number;
  name: string;
  pathName: string;
}

export interface ICompanyInfo {
  id: number;
  name: string;
  fullName: string;
  inn: string;
  description: string;
  address: string;
  email: string;
  logoUrl: string;
  rating: number;
  summary: string;
  summaryDescription?: string;
  claimsCount: number;
  resolvedClaimsCount: number;
  unresolvedClaimsCount: number;
  resolvedPercentage: number;
  searchKeywords: string[];
  category: ICompanyCategory;
  placeInCategory: number; 
  companiesInCategory: ICompanyInCategory[];
  claims: IClaimsPublicItem[];
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