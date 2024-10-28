import {RefreshResponse} from "../../../service/network/session/requests/PostRefreshRequest";


interface ITestRefreshResponse extends RefreshResponse {}

export const testRefresh = (): Promise<ITestRefreshResponse> => {
    return new Promise((resolve, reject) => {

        const token = localStorage.getItem('token');

        if (!token) {
            reject();
            return;
        }

        const newToken = `${token}-${token.length + 1}`

        window.setTimeout(() => {
            resolve({accessToken: newToken})
        }, 200)
    })
}