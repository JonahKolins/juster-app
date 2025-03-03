import companiesData from '../../mocks/companiesData.json';

export interface ICompanyInfo {
  id: number;
  name: string;
  fullName: string;
  inn: string;
  description: string;
  address: string;
}

export const searchCompanies = (query: string): Promise<ICompanyInfo[]> => {
  // Имитация задержки сетевого запроса
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!query || query.trim() === '') {
        resolve([]);
        return;
      }

      const searchTerm = query.toLowerCase().trim();
      const results = companiesData.filter(
        (company: ICompanyInfo) =>
          company.name.toLowerCase().includes(searchTerm) ||
          company.fullName.toLowerCase().includes(searchTerm) ||
          company.inn.includes(searchTerm) ||
          company.description.toLowerCase().includes(searchTerm)
      );

      resolve(results);
    }, 500); // Имитация задержки сети в 500 мс
  });
}; 