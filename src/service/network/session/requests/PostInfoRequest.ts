import PostRequest from "../../../api/requests/PostRequest";
import JSONResponseHandler from "../../../api/handlers/JSONResponseHandler";

export interface InfoResponse {
    sessionId: string;
    accessToken: string;
    role: string;
}

export interface IUserData {
    id: number;
    firstName: string;
    lastLame: string;
    patronymic: string;
    email: string;
    phone: string;
    address: string;
    inn: string;
    status: string;
}

const INFO_URL = '/session/info';

class PostInfoRequest extends PostRequest<InfoResponse> {
    public constructor(private clientId: string, private token: string) {
        super();
    }

    protected responseHandler = new JSONResponseHandler<InfoResponse>();
    protected url = INFO_URL;
    protected additionalHeaders = {
        "Authorization": `Bearer ${this.token}`
    }
    protected body = {
        sessionId: this.clientId,
    }
}

export default PostInfoRequest;