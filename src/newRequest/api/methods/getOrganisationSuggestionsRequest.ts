import GetOrganisationSuggestionsRequest, { IRespondentSuggestionsResponse } from "../requests/GetOrganisationSuggestionsRequest";

export const getRespondentSuggestions = async (query: string): Promise<IRespondentSuggestionsResponse> => {
    const getRespondentSuggestionsRequest = new GetOrganisationSuggestionsRequest(query);

    const data = await getRespondentSuggestionsRequest.send();

    return data;
}