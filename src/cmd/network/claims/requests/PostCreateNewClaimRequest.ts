import PostRequest from "../../../api/requests/PostRequest";
import JSONResponseHandler from "../../../api/handlers/JSONResponseHandler";
import { IClaimsItem } from "../../../../classes/claim/Claim.Types";
import { ICreateNewClaimRequest } from "../methods/requestCreateNewClaim";

export interface ICreateNewClaimResponse {
    claim: IClaimsItem;
    error?: any;
}

const CREATE_NEW_CLAIM_URL = '/claim/create';

class PostCreateNewClaimRequest extends PostRequest<ICreateNewClaimResponse> {
    public constructor(private params: ICreateNewClaimRequest) {
        super();
    }

    protected responseHandler = new JSONResponseHandler<ICreateNewClaimResponse>();

    protected url = CREATE_NEW_CLAIM_URL;

    protected additionalRequestInit: Partial<RequestInit> = {
        credentials: 'include'  // чтобы браузер отправил cookies с запросом
    }

    protected body = {
        ...this.params
    }
}

export default PostCreateNewClaimRequest;