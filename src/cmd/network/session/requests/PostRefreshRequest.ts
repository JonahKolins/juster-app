import PostRequest from "../../../api/requests/PostRequest";
import JSONResponseHandler from "../../../api/handlers/JSONResponseHandler";
import { Roles } from "classes/role/AccessControl";

export interface RefreshResponse {
    role: Roles,
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