import PostProfileRequest, {IProfileResponse} from "../requests/PostProfileRequest";
import {testProfile} from "../../../../app/auth/methods/testProfile";


export const requestProfile = async (sessionId: string): Promise<IProfileResponse> => {
    const postProfileRequest = new PostProfileRequest(sessionId);

    const data: IProfileResponse = await postProfileRequest.send();

    // const data: IProfileResponse = await testProfile();

    return data
}