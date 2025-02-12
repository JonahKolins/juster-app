import { IClaimsItemResponse } from "../types/mockUsersData";


export interface IClaimInfoRequestParams {
    id: string;
}

const TIMEOUT = 200;

export const testClaimInfo = (params: IClaimInfoRequestParams, timeout?: number): Promise<IClaimsItemResponse> => {
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

        if (!existedClaimsArray.length) {
            reject();
            return;
        }

        const claimInfo: IClaimsItemResponse = existedClaimsArray.find((claim) => claim.id === params.id);

        if (!claimInfo) {
            reject();
            return;
        }

        // const initialActionId = String(Math.floor(1000 + Math.random() * 9000));
        // const createdAt = new Date().getTime();
        //
        // const formatDate = datetimeUtils.formatTime(createdAt, 'DD MMM YYYY в hh:mm')
        //
        // const newClaimInfo: IClaimsItemResponse = {
        //     ...claimInfo,
        //     actions: [
        //         {
        //             type: 'action',
        //             actionType: IClaimActionType.claimCreated,
        //             id: initialActionId,
        //             createdAt: createdAt,
        //             text: `Вы создали обращение %date%`,
        //             user: {
        //                 firstName: '',
        //                 lastName: '',
        //                 title: {
        //                     id: 'iam',
        //                     value: 'Вы'
        //                 }
        //             }
        //         }
        //     ]
        // }
        //
        // // удаляем старое обращение по id
        // const copyWithoutCurrentRequest = existedClaimsArray.filter((cl) => cl.id !== params.id);
        // // добавляем новый
        // copyWithoutCurrentRequest.push(newClaimInfo);
        // // в строку и сохраняем
        // const dataToSave = JSON.stringify(copyWithoutCurrentRequest);
        // localStorage.setItem('user_requests', dataToSave);

        window.setTimeout(() => {
            resolve(claimInfo);
        }, timeout || TIMEOUT);
    })
}