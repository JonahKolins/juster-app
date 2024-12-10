import {IUserData} from "../../../pages/loginPages/api/AuthServise";
import {IProfileResponse} from "../../../cmd/network/profile/requests/PostProfileRequest";


interface ITestProfileResponse extends IProfileResponse {}

export const testProfile = (): Promise<ITestProfileResponse> => {
    return new Promise((resolve, reject) => {

        const clientId = localStorage.getItem('clientId');

        if (!clientId) {
            Promise.reject();
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
                console.error('Cannot parse reg_users in testProfile -> existedUsersString', existedUsersString);
            }

            if (!existedUsersArray.length) {
                reject();
            } else {
                const reqUserData: IUserData = existedUsersArray.find((data) => data.id === clientId);

                if (!reqUserData) {
                    reject();
                } else {
                    const response: ITestProfileResponse = {
                        clientInfo: {
                            clientId: reqUserData.id,
                            role: reqUserData.role,
                            firstName: reqUserData.firstName || reqUserData.name,
                            lastName: reqUserData.lastName,
                            email: reqUserData.email
                        },
                        profileSettings: null
                    }
                    resolve(response);
                }
            }
        }, 200)
    })
}