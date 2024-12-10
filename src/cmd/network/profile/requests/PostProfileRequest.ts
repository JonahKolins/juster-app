import PostRequest from "../../../api/requests/PostRequest";
import JSONResponseHandler from "../../../api/handlers/JSONResponseHandler";

export interface IProfileClientInfo {
    id: string;
    role: string;
    firstName: string;
    lastName: string;
    userName?: string;
    email: string;
    address: string;
    inn: string;
    integrationId?: string;
}

export interface IProfileSettings {}

export interface IProfileResponse {
    clientInfo: {
        sessionId: string;
        user: IProfileClientInfo;
    };
    profileSettings: IProfileSettings;
}

const INFO_URL = '/profile';

class PostProfileRequest extends PostRequest<IProfileResponse> {
    public constructor(private sessionId: string) {
        super();
    }

    protected responseHandler = new JSONResponseHandler<IProfileResponse>();

    protected url = INFO_URL;

    protected additionalRequestInit: Partial<RequestInit> = {
        credentials: 'include'  // чтобы браузер отправил cookies с запросом
    }

    protected body = {
        sessionId: this.sessionId,
    }
}

export default PostProfileRequest;