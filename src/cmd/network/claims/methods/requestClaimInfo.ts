import PostClaimInfo, { IPostClaimInfoParams, IPostClaimInfoResponse } from "../requests/PostClaimInfo";
import { IClaimsItem } from "../../../../classes/claim/Claim.Types";

export interface IClaimInfoRequestParams {
    sessionId: string;
    claimId: string;
}

export const requestClaimInfo = async (params: IClaimInfoRequestParams): Promise<IClaimsItem> => {
    const postClaimInfoRequest = new PostClaimInfo(params);

    const response: IPostClaimInfoResponse = await postClaimInfoRequest.send();
    
    return response.claim;
}
