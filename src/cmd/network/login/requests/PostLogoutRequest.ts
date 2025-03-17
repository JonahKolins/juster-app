import PostRequest from "../../../api/requests/PostRequest";
import JSONResponseHandler from "../../../api/handlers/JSONResponseHandler";
import { IResponse } from "cmd/api/types";

export interface ILogoutData {
    message: string;
}

export type ILogoutResponse = IResponse<ILogoutData>;

const LOGOUT_URL = '/auth/logout';

class PostLogoutRequest extends PostRequest<ILogoutResponse> {
    public constructor() {
        super();
    }

    protected responseHandler = new JSONResponseHandler<ILogoutResponse>();

    protected url = LOGOUT_URL;

    protected additionalRequestInit: Partial<RequestInit> = {
        credentials: 'include'  // чтобы браузер отправил cookies с запросом
    }

    protected body = {}
}

export default PostLogoutRequest;