import PostRequest from "../../../api/requests/PostRequest";
import JSONResponseHandler from "../../../api/handlers/JSONResponseHandler";
import {IClaimsItem, INewClaimsItem} from "../../../../classes/claim/Claim.Types";

export interface ICreateNewClaimResponse {
    claim: IClaimsItem;
    error?: any;
}

const CREATE_NEW_CLAIM_URL = '/createNewClaim';

class PostCreateNewClaimRequest extends PostRequest<ICreateNewClaimResponse> {
    public constructor(private sessionId: string, private claimInfo: INewClaimsItem) {
        super();
    }

    protected responseHandler = new JSONResponseHandler<ICreateNewClaimResponse>();

    protected url = CREATE_NEW_CLAIM_URL;

    protected additionalRequestInit: Partial<RequestInit> = {
        credentials: 'include'  // чтобы браузер отправил cookies с запросом
    }

    protected body = {
        sessionId: this.sessionId,
        claimInfo: this.claimInfo
    }
}

export default PostCreateNewClaimRequest;