import PostRequest from "../../../api/requests/PostRequest";
import JSONResponseHandler from "../../../api/handlers/JSONResponseHandler";

export interface IProfileClientInfo {
    clientId: string;
    role: string;
    firstName: string;
    lastName: string;
    userName?: string;
    email: string;
    integrationId?: string;
}

export interface IProfileSettings {

}

export interface IProfileResponse {
    clientInfo: IProfileClientInfo
    profileSettings: IProfileSettings
}

const INFO_URL = '/profile';

class PostProfileRequest extends PostRequest<IProfileResponse> {
    public constructor(private token: string, private sessionId: string) {
        super();
    }

    protected responseHandler = new JSONResponseHandler<IProfileResponse>();
    protected url = INFO_URL;
    protected additionalHeaders = {
        "Authorization": `Bearer ${this.token}`
    }
    protected body = {
        sessionId: this.sessionId
    }
}

export default PostProfileRequest;