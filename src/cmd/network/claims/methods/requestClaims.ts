import PostClaimsRequest, {IPostClaimsResponse} from "../requests/PostClaimsRequest";
import {testClaims} from "../../../../app/auth/methods/testClaims";

export const requestClaims = async (sessionId: string): Promise<IPostClaimsResponse> => {
    const postClaimsRequest = new PostClaimsRequest(sessionId);

    const data: IPostClaimsResponse = await postClaimsRequest.send();
    // const data: IPostClaimsResponse = await testClaims();

    return data;
}