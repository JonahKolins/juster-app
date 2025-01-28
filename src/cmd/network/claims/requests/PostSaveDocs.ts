import PostRequest from "cmd/api/requests/PostRequest";
import JSONResponseHandler from "cmd/api/handlers/JSONResponseHandler";
import { UploadFile } from "antd";

export interface ISaveDocsRequestParams {
    claimId: string;
    sessionId: string;
    files: UploadFile[];
}

export interface ISaveDocsResponse {
    status: string;
    error?: any;
}

const SAVE_DOCS_URL = '/saveclaimsdoc';

class PostSaveDocsRequest extends PostRequest<ISaveDocsResponse> {
    public constructor(private params: ISaveDocsRequestParams) {
        super();
    }

    protected responseHandler = new JSONResponseHandler<ISaveDocsResponse>();

    protected url = SAVE_DOCS_URL;

    protected additionalRequestInit: Partial<RequestInit> = {
        credentials: 'include'  // чтобы браузер отправил cookies с запросом
    }

    protected body = {
        ...this.params
    }
}

export default PostSaveDocsRequest;
