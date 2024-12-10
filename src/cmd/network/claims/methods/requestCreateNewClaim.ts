import PostCreateNewClaimRequest, {ICreateNewClaimResponse} from "../requests/PostCreateNewClaimRequest";
import {INewClaimsItem} from "../../../../classes/claim/Claim.Types";

export const requestCreateNewClaim = async (sessionId: string, claimInfo: INewClaimsItem): Promise<ICreateNewClaimResponse> => {
    const postCreateNewClaimRequest = new PostCreateNewClaimRequest(sessionId, claimInfo);

    const data: ICreateNewClaimResponse = await postCreateNewClaimRequest.send();

    return data
}