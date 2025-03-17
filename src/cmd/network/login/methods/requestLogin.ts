import PostLoginRequest, {ILoginResponse} from "../requests/PostLoginRequest";

export const requestLogin = async (email: string, password: string): Promise<ILoginResponse> => {
    const postLoginRequest = new PostLoginRequest(email, password);

    const data: ILoginResponse = await postLoginRequest.send();

    return data;
}