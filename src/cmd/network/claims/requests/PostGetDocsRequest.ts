import { BlobResponseHandler } from "cmd/api/handlers/BlobResponseHandler";
import PostRequest from "cmd/api/requests/PostRequest";

export interface IGetDocsRequestParams {
    claimId: string;
    sessionId: string;
    documentId?: string; // опциональный параметр для запроса конкретного документа
}

export interface IDocumentInfo {
    id: string;
    name: string;
    type: string;
    size: number;
    uploadDate: number;
    contentUrl?: string;
}

export interface IGetDocsResponse {
    status: string;
    documents: IDocumentInfo[];
    error?: any;
}

const GET_DOCS_URL = '/getclaimsdoc';

class PostGetDocsRequest extends PostRequest<IGetDocsResponse> {
    protected url = GET_DOCS_URL;

    constructor(private params: IGetDocsRequestParams) {
        super();
    }

    protected body = {
        ...this.params
    }

    protected responseHandler = new BlobResponseHandler<IGetDocsResponse>();

    protected additionalRequestInit: Partial<RequestInit> = {
        credentials: 'include'
    };
}

export default PostGetDocsRequest;
