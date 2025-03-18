import CreateAccountRequest, {CreateAccountParams, ICreateAccountResponse} from "../requests/CreateAccountRequest";

export const requestCreateAccount = async (params: CreateAccountParams): Promise<ICreateAccountResponse> => {
    const createAccountRequest = new CreateAccountRequest(params);

    const data: ICreateAccountResponse = await createAccountRequest.send();

    return data;
}