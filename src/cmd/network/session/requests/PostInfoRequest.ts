import PostRequest from "../../../api/requests/PostRequest";
import JSONResponseHandler from "../../../api/handlers/JSONResponseHandler";
import { Roles } from "classes/role/AccessControl";

export interface InfoResponse {
    sessionId: string;
    accessToken: string;
    role: Roles;
}

const INFO_URL = '/session/info';

class PostInfoRequest extends PostRequest<InfoResponse> {
    public constructor(private clientId: string) {
        super();
    }

    protected responseHandler = new JSONResponseHandler<InfoResponse>();

    protected url = INFO_URL;

    protected additionalRequestInit: Partial<RequestInit> = {
        credentials: 'include'  // чтобы браузер отправил cookies с запросом
    }

    protected body = {
        sessionId: this.clientId,
    }
}

export default PostInfoRequest;