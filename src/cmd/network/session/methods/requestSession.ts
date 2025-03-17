import GetSessionRequest, {ISessionResponse} from "../requests/GetSessionRequest";

export const requestSession = async (): Promise<ISessionResponse> => {
    const getSessionRequest = new GetSessionRequest();

    const data: ISessionResponse = await getSessionRequest.send();

    return data
}