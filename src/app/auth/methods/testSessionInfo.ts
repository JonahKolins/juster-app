import {IUserData} from "../../../pages/loginPages/api/AuthServise";

export interface ILoginParams {
    clientId: string;
    token: string;
}

export interface IUserLoginResponse {
    clientId: string;
    accessToken: string;
    role: string;
}

const TIMEOUT = 1500;

export const testSessionInfo = (params: ILoginParams, timeout?: number): Promise<IUserLoginResponse> => {
    return new Promise((resolve, reject) => {
        if (!params) {
            reject();
            return;
        }

        window.setTimeout(() => {
            const existedUsersString = localStorage.getItem('reg_users');

            let existedUsersArray: IUserData[] = [];

            try {
                if (existedUsersString) {
                    const parsedRegUsers: IUserData[] = JSON.parse(existedUsersString) || [];

                    if (parsedRegUsers?.length) {
                        existedUsersArray.push(...parsedRegUsers);
                    }
                }
            } catch (e) {
                console.error('Cannot parse reg_users in testSessionInfo -> existedUsersString', existedUsersString);
            }

            if (!existedUsersArray.length) {
                reject();
            } else {
                const reqUserData: IUserData = existedUsersArray.find((data) => data.id === params.clientId);

                if (!reqUserData) {
                    reject();
                } else {
                    const response: IUserLoginResponse = {
                        clientId: reqUserData.id,
                        accessToken: 'accessToken1',
                        role: reqUserData.role
                    }
                    resolve(response);
                }
            }
        }, timeout ? timeout : TIMEOUT)
    })
}