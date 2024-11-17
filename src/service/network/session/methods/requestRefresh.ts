import PostRefreshRequest, {RefreshResponse} from "../requests/PostRefreshRequest";
import {testRefresh} from "../../../../app/auth/methods/testRefresh";

export const requestRefresh = async (): Promise<RefreshResponse> => {
    const postRefreshRequest = new PostRefreshRequest();

    const data: RefreshResponse = await postRefreshRequest.send();

    // const data: RefreshResponse = await testRefresh();

    return data;
}