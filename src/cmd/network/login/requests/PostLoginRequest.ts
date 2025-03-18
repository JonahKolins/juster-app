import PostRequest from "../../../api/requests/PostRequest";
import JSONResponseHandler from "../../../api/handlers/JSONResponseHandler";
import { Roles } from "classes/role/roles";
import { IResponse } from "cmd/api/types";

export interface ILoginData {
    id: string;
    email: string;
    name: string;
    role: Roles;
    createdAt: Date;
    updatedAt: Date;
    // error
    errorCode?: number;
    message?: string;
    status?: number;
    errors?: Record<string, string[]> | undefined;
}

interface ILoginUser {
    user: ILoginData;
}

export type ILoginResponse = IResponse<ILoginUser>;

const LOGIN_URL = '/auth/login';

class PostLoginRequest extends PostRequest<ILoginResponse> {
    public constructor(private email: string, private pwd: string) {
        super();
    }

    protected responseHandler = new JSONResponseHandler<ILoginResponse>();

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