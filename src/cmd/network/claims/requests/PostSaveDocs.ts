import JSONResponseHandler from "cmd/api/handlers/JSONResponseHandler";
import PostFormDataRequest from "cmd/api/requests/PostFormDataRequest";

export interface ISaveDocsRequestParams {
    claimId: string;
    sessionId: string;
    files: File[];
}

export interface ISaveDocsResponse {
    status: string;
    error?: any;
}

const SAVE_DOCS_URL = '/saveclaimsdoc';

class PostSaveDocsRequest extends PostFormDataRequest<ISaveDocsResponse> {
    protected formData: FormData;

    public constructor(private params: ISaveDocsRequestParams) {
        super();
        
        this.formData = new FormData();
        this.formData.append('claimId', params.claimId);
        this.formData.append('sessionId', params.sessionId);
        
        params.files.forEach((file, index) => {
            this.formData.append(`files`, file, file.name);
        });
    }

    protected url = SAVE_DOCS_URL;
    
    protected responseHandler = new JSONResponseHandler<ISaveDocsResponse>();

    protected additionalRequestInit: Partial<RequestInit> = {
        credentials: 'include'
    }
}

export default PostSaveDocsRequest;
