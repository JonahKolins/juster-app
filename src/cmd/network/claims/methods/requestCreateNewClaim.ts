import PostCreateNewClaimRequest, {ICreateNewClaimResponse} from "../requests/PostCreateNewClaimRequest";

export interface ICreateNewClaimRequest {
    sessionId: string;
    claimName: string;
    recipientInn: string;
    recipientName: string;
    recipientAddress: string;
    recipientEmail: string;
    contentType: string;
    contentSum: string;
    claimText: string;
    draftId: string;
}

export const requestCreateNewClaim = async (params: ICreateNewClaimRequest): Promise<ICreateNewClaimResponse> => {
    const postCreateNewClaimRequest = new PostCreateNewClaimRequest(params);

    const data: ICreateNewClaimResponse = await postCreateNewClaimRequest.send();

    return data
}