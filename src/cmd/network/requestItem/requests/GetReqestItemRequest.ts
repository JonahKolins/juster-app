import PostRequest from "../../../api/requests/PostRequest";
import JSONResponseHandler from "../../../api/handlers/JSONResponseHandler";

export interface SendCommentParams {
    claimId: string;
    sessionId: string;
    text: string;
}

interface ICommentUserResponse {
    firstName: string;
    lastLame: string;
}

export interface SendCommentResponse {
    id: string;
    text: string;
    user: ICommentUserResponse;
    createdAt: string;
}

class SendCommentRequest extends PostRequest<SendCommentResponse> {
    public constructor(private query: SendCommentParams) {
        super();
    }

    protected responseHandler = new JSONResponseHandler<SendCommentResponse>();

    protected url = "/comment";

    protected additionalRequestInit: Partial<RequestInit> = {
        credentials: 'include'  // чтобы браузер отправил cookies с запросом
    }

    protected body = {
        query: this.query
    }
}

export default SendCommentRequest;