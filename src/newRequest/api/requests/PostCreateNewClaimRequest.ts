import JSONResponseHandler from "../../../cmd/api/handlers/JSONResponseHandler";
import PostFormDataRequest from "../../../cmd/api/requests/PostFormDataRequest";

export interface CreateNewClaimResponse {
    errorCode: number;
    message: string;
}

export interface CreateNewClaimParams {
    sessionId: string;
    claimName: string;
    recipientInn: string;
    recipientName: string;
    recipientAddress: string;
    recipientEmail: string;
    contentType: string;
    contentSum: string;
    claimText: string;
    file?: File;
}

const NEW_CLAIM_URL = '/newclaim';

class PostCreateNewClaimRequest extends PostFormDataRequest<CreateNewClaimResponse> {
    private token: string = localStorage.getItem("token");

    public constructor(private params: CreateNewClaimParams) {
        super();
    }

    protected responseHandler = new JSONResponseHandler<CreateNewClaimResponse>();
    protected url = NEW_CLAIM_URL;
    protected additionalHeaders = {
        "Authorization": `Bearer ${this.token}`
    }
    protected body = {
        ...this.params
    }
}

export default PostCreateNewClaimRequest;