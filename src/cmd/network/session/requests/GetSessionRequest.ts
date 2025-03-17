import GetRequest from "cmd/api/requests/GetRequest";
import JSONResponseHandler from "../../../api/handlers/JSONResponseHandler";
import { Roles } from "classes/role/roles";
import { IResponse } from "cmd/api/types";

export interface ISessionData {
    authenticated: boolean;
    user: {
        id: string;
        email: string;
        role: Roles;
    }
}

export type ISessionResponse = IResponse<ISessionData>;

const INFO_URL = '/auth/session';

class GetSessionRequest extends GetRequest<ISessionResponse> {
    public constructor() {
        super();
    }

    protected responseHandler = new JSONResponseHandler<ISessionResponse>();

    protected url = INFO_URL;

    protected requestInitPart: Partial<RequestInit> = {
        credentials: 'include'  // чтобы браузер отправил cookies с запросом
    }
}

export default GetSessionRequest;