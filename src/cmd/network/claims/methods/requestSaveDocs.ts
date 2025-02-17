import PostSaveDocsRequest, { ISaveDocsRequestParams, ISaveDocsResponse } from "../requests/PostSaveDocs";


export const requestSaveDocs = async (params: ISaveDocsRequestParams): Promise<ISaveDocsResponse> => {
    console.log('requestSaveDocs, params', params);
    
    const postSaveDocsRequest = new PostSaveDocsRequest(params);

    const data: ISaveDocsResponse = await postSaveDocsRequest.send();

    return data;
}