import GetProfileRequest, { IProfileResponse } from "../requests/GetProfileRequest";

export const requestProfile = async (): Promise<IProfileResponse> => {
    const getProfileRequest = new GetProfileRequest();

    const data: IProfileResponse = await getProfileRequest.send();

    return data;
}