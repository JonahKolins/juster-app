import PostRequest from "../../../cmd/api/requests/PostRequest";
import JSONResponseHandler from "../../../cmd/api/handlers/JSONResponseHandler";

const url = "/suggestions/api/4_1/rs/suggest/party";
const token = "e609610cda4cf031e8f51bedefa7adaf4d805aaa";

interface IAddress {
    value: string;
    invalidity?: any;
    unrestricted_value?: string;
    data?: {
        postal_code: string;
    }
}

export interface ISuggestionData {
    name?: string;
    address?: IAddress;
    inn?: string;
    kpp?: string;
    ogrn?: string;
    secondName?: string;
}

// TODO надо допилить интерфейс ответа
export interface ISuggestions {
    id?: string;
    data: ISuggestionData;
    value?: string;
    unrestricted_value?: string;
}

type Data = {
    suggestions: ISuggestions[]
}

class GetOrganisationSuggestionsRequest extends PostRequest<Data> {
    public constructor(private query: string) {
        super();
    }
    protected responseHandler = new JSONResponseHandler<Data>();
    protected url = url;
    protected host = 'https://suggestions.dadata.ru';
    protected additionalHeaders = {
        "Accept": "application/json",
        "Authorization": "Token " + token
    }
    protected body = {
        query: this.query
    }
}

export default GetOrganisationSuggestionsRequest;