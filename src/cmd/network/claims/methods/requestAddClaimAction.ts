import { ActionType, ClaimType, IClaimStatus } from "classes/claim/Claim.Types";
import PostAddClaimAction, { IPostAddClaimActionResponse } from "../requests/PostAddClaimAction";

export interface IClaimActionRequestInfo {
    text: string;
    type: ClaimType;
    status: IClaimStatus;
    actionType: ActionType;
}

export interface IAddClaimActionRequestParams {
    sessionId: string;
    claimId: string;
    action: IClaimActionRequestInfo;
}

// добавление экшена к Обращению
export const requestAddClaimAction = async (params: IAddClaimActionRequestParams): Promise<IPostAddClaimActionResponse> => {
    const postAddClaimActionRequest = new PostAddClaimAction(params);

    const data: IPostAddClaimActionResponse = await postAddClaimActionRequest.send();

    return data;
}