import PostRequest from "../../../api/requests/PostRequest";
import JSONResponseHandler from "../../../api/handlers/JSONResponseHandler";

export interface RefreshResponse {
    accessToken: string;
}

const INFO_URL = '/refresh';

class PostRefreshRequest extends PostRequest<RefreshResponse> {
    public constructor() {
        super();
    }

    protected responseHandler = new JSONResponseHandler<RefreshResponse>();

    protected url = INFO_URL;

    protected body = {}
}

export default PostRefreshRequest;