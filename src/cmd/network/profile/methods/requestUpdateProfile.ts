import PutProfileRequest, { IProfileResponse, IUpdateProfileData } from "../requests/PutProfileRequest";

export const requestUpdateProfile = async (params: IUpdateProfileData): Promise<IProfileResponse> => {
    const putProfileRequest = new PutProfileRequest(params);

    const data: IProfileResponse = await putProfileRequest.send();

    return data;
}