import PostClaimDraftRequest, { IClaimDraftResponse } from "../requests/PostClaimDraftRequest";

export interface IClaimDraftRequestParams {
    sessionId: string;           // id сессии
    claimName: string;           // название обращения
    contentType: string;         // тип обращения "Возврат"
    contentSum: string;          // сумма обращения "78"
    claimText: string;           // текст обращения
    recipientInn: string;        // ИНН организации (получателя)
    recipientName: string;       // название организации (получателя)
    recipientAddress: string;    // адрес организации (получателя)
    recipientEmail: string;      // email организации (получателя)
    draftId: string;             // id черновика
}

export const requestClaimDraft = async (params: IClaimDraftRequestParams): Promise<IClaimDraftResponse> => {
    const postClaimDraftRequest = new PostClaimDraftRequest(params);

    const data: IClaimDraftResponse = await postClaimDraftRequest.send();

    return data;
}