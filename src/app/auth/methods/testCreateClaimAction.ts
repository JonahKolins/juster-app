
import {IClaimsItemResponse, TClaimAction} from "../../../classes/claim/Claim.Types";

export type ICreateClaimActionRequestParams = {
    claimId: string;
    action: Omit<TClaimAction, 'id'>
}

const TIMEOUT = 200;

export const testCreateClaimAction = (params: ICreateClaimActionRequestParams, timeout?: number): Promise<IClaimsItemResponse> => {

    return new Promise((resolve, reject) => {
        const existedClaimsString = localStorage.getItem('user_requests');

        let existedClaimsArray: IClaimsItemResponse[] = [];

        try {
            if (existedClaimsString) {
                const parsedClaims: IClaimsItemResponse[] = JSON.parse(existedClaimsString) || [];

                if (parsedClaims?.length) {
                    existedClaimsArray.push(...parsedClaims);
                }
            }
        } catch (e) {
            console.error('Cannot parse user_requests in testClaimInfo -> existedClaimsString', existedClaimsString);
            reject();
        }

        const claimInfo: IClaimsItemResponse = existedClaimsArray.find((claim) => claim.id === params.claimId);

        if (!claimInfo) {
            reject();
            return;
        }

        // новый объект экшена
        const newAction: TClaimAction = {
            id: String(Math.floor(1000 + Math.random() * 9000)),
            ...params.action
        }

        const allActionsOfClaim: TClaimAction[] = [];

        if (!!claimInfo.actions && claimInfo.actions.length) {
            allActionsOfClaim.push(...claimInfo.actions, newAction)
        } else {
            allActionsOfClaim.push(newAction);
        }

        // весь объект Обращения
        const newClaimInfo: IClaimsItemResponse = {
            ...claimInfo,
            actions: allActionsOfClaim
        }

        // удаляем старое обращение по id
        const copyWithoutCurrentRequest = existedClaimsArray.filter((cl) => cl.id !== params.claimId);
        // добавляем новый
        copyWithoutCurrentRequest.push(newClaimInfo);
        // в строку и сохраняем
        const dataToSave = JSON.stringify(copyWithoutCurrentRequest);
        localStorage.setItem('user_requests', dataToSave);

        window.setTimeout(() => {
            resolve(newClaimInfo);
        }, timeout || TIMEOUT);
    })
}