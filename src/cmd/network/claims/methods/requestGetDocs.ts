import GetDocsRequest, { IGetDocsResponse } from "../requests/GetDocsRequest";

export interface IGetDocParams {
    sessionId: string;
    claimId: string;
    fileId?: string;
}

export const requestGetDocs = async (params: IGetDocParams): Promise<IGetDocsResponse> => {
    console.log('requestGetDocs, params', params);
    
    const { sessionId, claimId, fileId } = params;
    const getDocsRequest = new GetDocsRequest(sessionId, claimId, fileId);

    const data: IGetDocsResponse = await getDocsRequest.send();

    return data;
}