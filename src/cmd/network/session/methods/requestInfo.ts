import PostInfoRequest, {InfoResponse} from "../requests/PostInfoRequest";
import {testSessionInfo} from "../../../../app/auth/methods/testSessionInfo";

export const requestSessionInfo = async (clientId: string): Promise<InfoResponse> => {
    const postInfoRequest = new PostInfoRequest(clientId);

    const data: InfoResponse = await postInfoRequest.send();

    // const data: InfoResponse = await testSessionInfo({clientId, token}, 300);

    return data
}