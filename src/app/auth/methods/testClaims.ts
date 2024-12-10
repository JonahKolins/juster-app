import {IClaimsItem} from "../../../classes/claim/Claim.Types";
import {IPostClaimsResponse} from "../../../cmd/network/claims/requests/PostClaimsRequest";

export const testClaims = (): Promise<IPostClaimsResponse> => {
    return new Promise((resolve, reject) => {
        const existedRequestsString = localStorage.getItem('user_requests');
        let existedRequestsArray: IClaimsItem[] = [];
        try {
            if (existedRequestsString) {
                const parsedRegUsers: IClaimsItem[] = JSON.parse(existedRequestsString) || [];

                if (parsedRegUsers?.length) {
                    existedRequestsArray.push(...parsedRegUsers);
                }
            }
        } catch (e) {
            console.error('Cannot parse user_requests in testClaims -> existedRequestsString', existedRequestsString);
            reject();
        }

        if (!existedRequestsArray.length) {
            reject();
            return;
        }

        window.setTimeout(() => {
            resolve({claims: existedRequestsArray});
        }, 300)
    })
}