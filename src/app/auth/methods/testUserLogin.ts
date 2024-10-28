import {IUserData} from "../../../pages/loginPages/api/AuthServise";

export interface ILoginParams {
    email: string;
    password: string;
}

export interface IUserLoginResponse {
    clientId: string;
    accessToken: string;
    role: string;
}

const TIMEOUT = 1500;

export const testUserLogin = (params: ILoginParams, timeout?: number): Promise<IUserLoginResponse> => {
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
                console.error('Cannot parse reg_users in LoginForm -> existedUsersString', existedUsersString);
            }

            if (!existedUsersArray.length) {
                reject();
            } else {
                const reqUserData: IUserData = existedUsersArray.find((data) => data.email === params.email);

                if (!reqUserData) {
                    resolve(null);
                } else {
                    if (reqUserData.password === params.password) {
                        const response: IUserLoginResponse = {
                            clientId: reqUserData.id,
                            accessToken: 'accessToken1',
                            role: reqUserData.role
                        }
                        resolve(response);
                    } else {
                        reject();
                    }
                }
            }
        }, timeout ? timeout : TIMEOUT)
    })
}