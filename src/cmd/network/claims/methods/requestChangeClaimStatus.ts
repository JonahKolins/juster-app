import PostChangeClaimStatusRequest, { IPostChangeClaimStatusResponse } from "../requests/PostChangeClaimStatusRequest";
import { IClaimStatus } from "classes/claim/Claim.Types";

export interface IChangeClaimStatusRequestParams {
    sessionId: string;
    claimId: string;
    status: IClaimStatus;
}

// изменение статуса Обращения
export const requestChangeClaimStatus = async (params: IChangeClaimStatusRequestParams): Promise<IPostChangeClaimStatusResponse> => {
    const postChangeClaimStatusRequest = new PostChangeClaimStatusRequest(params);

    const data: IPostChangeClaimStatusResponse = await postChangeClaimStatusRequest.send();

    return data;
}