import PostGetDocsRequest, { IGetDocsRequestParams, IGetDocsResponse } from "../requests/PostGetDocsRequest";

export const requestGetDocs = async (params: IGetDocsRequestParams) : Promise<IGetDocsResponse> => {
    console.log('requestGetDocs, params', params);
    
    const postGetDocsRequest = new PostGetDocsRequest(params);

    const data: IGetDocsResponse = await postGetDocsRequest.send();

    return data;
}