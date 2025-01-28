import PostRequest from "../../../api/requests/PostRequest";
import JSONResponseHandler from "../../../api/handlers/JSONResponseHandler";
import { IClaimDraftRequestParams } from "../methods/requestClaimDraft";

export interface IClaimDraftResponse {
    claimId: string;
    error?: any;
}

const CLAIM_DRAFT_URL = '/claim/draft';

class PostClaimDraftRequest extends PostRequest<IClaimDraftResponse> {
    public constructor(private params: IClaimDraftRequestParams) {
        super();
    }

    protected responseHandler = new JSONResponseHandler<IClaimDraftResponse>();

    protected url = CLAIM_DRAFT_URL;

    protected additionalRequestInit: Partial<RequestInit> = {
        credentials: 'include'  // чтобы браузер отправил cookies с запросом
    }

    protected body = {
        ...this.params
    }
}

export default PostClaimDraftRequest;