import PostRequest from "cmd/api/requests/PostRequest";
import JSONResponseHandler from "cmd/api/handlers/JSONResponseHandler";
import { IAddClaimActionRequestParams } from "../methods/requestAddClaimAction";

export interface IPostAddClaimActionResponse {
    actionId: number;
}

const CLAIM_ACTION_URL = '/action';

class PostAddClaimAction extends PostRequest<IPostAddClaimActionResponse> {

    public constructor(private params: IAddClaimActionRequestParams) {
        super();
    }

    protected responseHandler = new JSONResponseHandler<IPostAddClaimActionResponse>();

    protected url = CLAIM_ACTION_URL;

    protected additionalRequestInit: Partial<RequestInit> = {
        credentials: 'include'  // чтобы браузер отправил cookies с запросом
    }

    protected body = {
        ...this.params
    }
}

export default PostAddClaimAction;