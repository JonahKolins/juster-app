import PostRequest from "../../../api/requests/PostRequest";
import RegistrationResponseHandler from "../../../api/handlers/RegistrationResponseHandler";
import { IUserData } from "cmd/network/profile/requests/GetProfileRequest";
import { IResponse } from "cmd/api/types";

export interface CreateAccountParams {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    hasCheckbox: boolean;
    //
    userAgent?: string;
    ipAddress?: string;
}

interface ICreatedUserData {
    user: IUserData;
}

export type ICreateAccountResponse = IResponse<ICreatedUserData>;

const REGISTER_URL = '/auth/register';

class CreateAccountRequest extends PostRequest<ICreateAccountResponse> {
    public constructor(private query: CreateAccountParams) {
        super();
    }

    protected responseHandler = new RegistrationResponseHandler<ICreateAccountResponse>();

    protected url = REGISTER_URL;

    protected additionalRequestInit: Partial<RequestInit> = {
        credentials: 'include'  // чтобы браузер отправил cookies с запросом
    }

    protected body = this.query;
}

export default CreateAccountRequest;