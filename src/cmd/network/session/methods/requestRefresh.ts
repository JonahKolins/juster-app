import PostRefreshRequest, {IRefreshResponse} from "../requests/PostRefreshRequest";

export const requestRefresh = async (): Promise<IRefreshResponse> => {
    const postRefreshRequest = new PostRefreshRequest();

    const data: IRefreshResponse = await postRefreshRequest.send();

    return data;
}