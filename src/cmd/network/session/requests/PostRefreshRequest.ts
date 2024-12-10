import PostRequest from "../../../api/requests/PostRequest";
import JSONResponseHandler from "../../../api/handlers/JSONResponseHandler";

export interface RefreshResponse {
    accessToken: string;
}

const INFO_URL = '/auth/refreshToken';

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