import AxiosResponseHandler from "../../../service/api/handlers/AxiosResponseHandler";
import AxiosPostRequest from "../../../service/api/requests/AxiosPostRequest";

type IUserTitle = {
    id: 'iam' | 'admin' | 'lawyer', // и другие
    value: string;
}

export interface IUserInfo {
    firstName: string;
    lastName?: string;
    title?: IUserTitle;
}

export interface IComment {
    createdAt: string;
    id: number;
    text: string;
    user: IUserInfo
}

export interface ClaimsItemResponse {
    contentType: string;
    createdDate: string; // "2023-06-12 16:52:48.343"
    genId: string; //"1e3ec6b0-0d2e-4671-89a1-a637ae4b7986"
    name: string; //"Жалоба на врача"
    status: string; //"RESOLVED"
    text: string; //"Колоноскопия прошла не успешно - я обосрался"
    comments: IComment[];
}
export interface ClaimsResponse {
    claims: ClaimsItemResponse[]
}

class GetClaimsRequest extends AxiosPostRequest<ClaimsResponse> {
    public constructor(private sessionId: string) {
        super();
    }

    protected responseHandler = new AxiosResponseHandler<ClaimsResponse>();
    protected url = "/claims";
    protected body = {
        sessionId: this.sessionId
    }

}

export default GetClaimsRequest;