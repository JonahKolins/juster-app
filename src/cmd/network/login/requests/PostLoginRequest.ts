import PostRequest from "../../../api/requests/PostRequest";
import JSONResponseHandler from "../../../api/handlers/JSONResponseHandler";

export interface LoginResponse {
    accessToken: string;
    sessionId: string;
    role: string;
    // error
    errorCode?: number;
    message?: string;
}

const LOGIN_URL = '/auth/login';

class PostLoginRequest extends PostRequest<LoginResponse> {
    public constructor(private email: string, private pwd: string) {
        super();
    }

    protected responseHandler = new JSONResponseHandler<LoginResponse>();

    protected url = LOGIN_URL;

    protected additionalRequestInit: Partial<RequestInit> = {
        credentials: 'include'  // чтобы браузер отправил cookies с запросом
    }

    protected body = {
        email: this.email,
        password: this.pwd
    }
}

export default PostLoginRequest;