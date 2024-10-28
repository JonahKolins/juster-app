import PostProfileRequest, {IProfileResponse} from "../requests/PostProfileRequest";
import {Session} from "../../../../classes/session/Session";
import {testProfile} from "../../../../app/auth/methods/testProfile";


export const requestProfile = async (): Promise<IProfileResponse> => {
    const token = Session.instance.sessionToken;
    if (!token) {
        Promise.reject(null);
        return;
    }

    const postProfileRequest = new PostProfileRequest(token);

    // const data: IProfileResponse = await postProfileRequest.send();

    const data: IProfileResponse = await testProfile();

    return data
}