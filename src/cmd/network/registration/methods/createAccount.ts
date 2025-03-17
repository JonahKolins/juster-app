import CreateAccountRequest, {CreateAccountParams, CreateAccountResponse} from "../requests/CreateAccountRequest";

export const requestCreateAccount = async (params: CreateAccountParams): Promise<CreateAccountResponse> => {
    const createAccountRequest = new CreateAccountRequest(params);

    const data: CreateAccountResponse = await createAccountRequest.send();

    return data;
}