import PostLogoutRequest, { ILogoutResponse } from "../requests/PostLogoutRequest";

export const requestLogout = async (): Promise<ILogoutResponse> => {
    const postLogoutRequest = new PostLogoutRequest();

    const data: ILogoutResponse = await postLogoutRequest.send();

    return data;
}