import PostProfileRequest, {IProfileResponse} from "../requests/PostProfileRequest";
import {Session} from "../../../../classes/session/Session";
import {testProfile} from "../../../../app/auth/methods/testProfile";


export const requestProfile = async (): Promise<IProfileResponse> => {
    const token = Session.instance.sessionToken;
    const sessionId = Session.instance.sessionId;

    const postProfileRequest = new PostProfileRequest(token, sessionId);

    const data: IProfileResponse = await postProfileRequest.send();

    // const data: IProfileResponse = await testProfile();

    return data
}