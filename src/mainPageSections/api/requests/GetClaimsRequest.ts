import AxiosResponseHandler from "../../../service/api/handlers/AxiosResponseHandler";
import AxiosPostRequest from "../../../service/api/requests/AxiosPostRequest";
import {IClaimsItemResponse} from "../../../classes/claim/Claim.Types";

export interface ClaimsResponse {
    claims: IClaimsItemResponse[];
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