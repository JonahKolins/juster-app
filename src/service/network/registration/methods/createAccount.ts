import CreateAccountRequest, {CreateAccountParams, CreateAccountResponse} from "../requests/CreateAccountRequest";
import {IUserRegistrationResponse, testUserRegistration} from "../../../../app/auth/methods/testUserRegistration";

//TODO registration убрать testUserRegistration

export const requestCreateAccount = async (params: CreateAccountParams): Promise<CreateAccountResponse> => {
    const createAccountRequest = new CreateAccountRequest(params);

    const data: CreateAccountResponse = await createAccountRequest.send();
    // const data = await testUserRegistration(params, 300);

    return data;
}