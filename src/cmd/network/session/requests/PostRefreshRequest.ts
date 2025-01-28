import PostRequest from "../../../api/requests/PostRequest";
import JSONResponseHandler from "../../../api/handlers/JSONResponseHandler";

export interface RefreshResponse {
    role: string,
    sessionId: string
}

const INFO_URL = '/auth/refreshtoken';

class PostRefreshRequest extends PostRequest<RefreshResponse> {
    public constructor() {
        super();
    }

    protected responseHandler = new JSONResponseHandler<RefreshResponse>();

    protected url = INFO_URL;

    protected additionalRequestInit: Partial<RequestInit> = {
        credentials: 'include'  // чтобы браузер отправил cookies с запросом
    }

    protected body = {}
}

export default PostRefreshRequest;