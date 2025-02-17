import PostRequest from "cmd/api/requests/PostRequest";
import JSONResponseHandler from "cmd/api/handlers/JSONResponseHandler";
import { IChangeClaimStatusRequestParams } from "../methods/requestChangeClaimStatus";

export interface IPostChangeClaimStatusResponse {
    status: string;
    message: string;
}

const CLAIM_ACTION_URL = '/claim/changestatus';

class PostChangeClaimStatusRequest extends PostRequest<IPostChangeClaimStatusResponse> {

    public constructor(private params: IChangeClaimStatusRequestParams) {
        super();
    }

    protected responseHandler = new JSONResponseHandler<IPostChangeClaimStatusResponse>();

    protected url = CLAIM_ACTION_URL;

    protected additionalRequestInit: Partial<RequestInit> = {
        credentials: 'include'  // чтобы браузер отправил cookies с запросом
    }

    protected body = {
        ...this.params
    }
}

export default PostChangeClaimStatusRequest;