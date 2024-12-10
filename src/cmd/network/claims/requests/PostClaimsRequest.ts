import PostRequest from "../../../api/requests/PostRequest";
import JSONResponseHandler from "../../../api/handlers/JSONResponseHandler";
import {IClaimsItemResponse} from "../../../../classes/claim/Claim.Types";

export interface IPostClaimsResponse {
    claims: IClaimsItemResponse[];
}

const CLAIMS_URL = '/claims';

class PostClaimsRequest extends PostRequest<IPostClaimsResponse> {
    public constructor(private sessionId: string) {
        super();
    }

    protected responseHandler = new JSONResponseHandler<IPostClaimsResponse>();

    protected url = CLAIMS_URL;

    protected additionalRequestInit: Partial<RequestInit> = {
        credentials: 'include'  // чтобы браузер отправил cookies с запросом
    }

    protected body = {
        sessionId: this.sessionId
    }
}

export default PostClaimsRequest;