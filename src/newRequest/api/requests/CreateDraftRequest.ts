import PostRequest from "../../../cmd/api/requests/PostRequest";
import JSONResponseHandler from "../../../cmd/api/handlers/JSONResponseHandler";
import {ISuggestions} from "./GetOrganisationSuggestionsRequest";

export interface CreateDraftParams {
    userId: number;
    draftId?: string;
    name?: string;
    text?: string;
    file?: File | Blob;
    orgData?: ISuggestions;
    orgName?: string;
    orgInn?: string;
    orgAddress?: string;
}

export interface CreateDraftResponse {
    id: string;
    draft: CreateDraftParams;
}

class CreateDraftRequest extends PostRequest<CreateDraftResponse> {
    public constructor(private params: CreateDraftParams) {
        super();
    }

    protected responseHandler = new JSONResponseHandler<CreateDraftResponse>();
    protected url = '/createDraft';
    // protected additionalHeaders = {
    //     "Authorization": `Bearer ${localStorage.getItem("token")}`
    // }

    protected body = {
        ...this.params
    };
}

export default CreateDraftRequest;