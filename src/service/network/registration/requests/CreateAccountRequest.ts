import PostRequest from "../../../api/requests/PostRequest";
import JSONResponseHandler from "../../../api/handlers/JSONResponseHandler";

export interface CreateAccountParams {
    userName?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string,
    hasCheckbox: boolean
}

export interface CreateAccountResponse {
    email: string;
    error?: any;
}

const REGISTER_URL = '/auth/registration';

class CreateAccountRequest extends PostRequest<CreateAccountResponse> {
    public constructor(private query: CreateAccountParams) {
        super();
    }
    protected responseHandler = new JSONResponseHandler<CreateAccountResponse>();
    protected url = REGISTER_URL;
    protected body = this.query;
}

export default CreateAccountRequest;