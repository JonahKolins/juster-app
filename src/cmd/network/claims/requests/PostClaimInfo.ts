import PostRequest from "../../../api/requests/PostRequest";
import JSONResponseHandler from "../../../api/handlers/JSONResponseHandler";
import {IClaimsItem} from "../../../../classes/claim/Claim.Types";

export interface IPostClaimInfoParams {
    sessionId: string;
    claimId: string;
}

export interface IPostClaimInfoResponse {
    claim: IClaimsItem;
}

const CLAIM_INFO_URL = '/claim/info';

class PostClaimInfo extends PostRequest<IPostClaimInfoResponse> {
    public constructor(private params: IPostClaimInfoParams) {
        super();
    }

    protected responseHandler = new JSONResponseHandler<IPostClaimInfoResponse>();

    protected url = CLAIM_INFO_URL;

    protected additionalRequestInit: Partial<RequestInit> = {
        credentials: 'include'  // чтобы браузер отправил cookies с запросом
    }

    protected body = this.params;
}

export default PostClaimInfo;
