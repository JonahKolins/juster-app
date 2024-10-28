import PostLoginRequest, {LoginResponse} from "../requests/PostLoginRequest";
import {testUserLogin} from "../../../../app/auth/methods/testUserLogin";

export const requestLogin = async (email: string, password: string): Promise<LoginResponse> => {
    const postLoginRequest = new PostLoginRequest(email, password);

    // const data: LoginResponse = await postLoginRequest.send();

    const data =  await testUserLogin({email, password});

    return data
}