import { BlobResponseHandler } from "cmd/api/handlers/BlobResponseHandler";
import GetRequest from "cmd/api/requests/GetRequest";

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
    document?: IDocumentInfo;
    error?: any;
}

const GET_DOCS_URL = '/claim/files';

class GetDocsRequest extends GetRequest<IGetDocsResponse> {
    constructor(
        private sessionId: string, 
        private claimId: string, 
        private fileId?: string
    ) {
        super();
    }

    protected get url(): string {
        let url = `${GET_DOCS_URL}/${this.sessionId}/${this.claimId}`;
        if (this.fileId) {
            url += `/${this.fileId}`;
        }
        return url;
    }

    protected responseHandler = new BlobResponseHandler<IGetDocsResponse>();

    protected requestInitPart: Omit<RequestInit, 'method'> = {
        credentials: 'include',
        headers: {
            'Accept': '*/*'
        }
    };
}

export default GetDocsRequest; 