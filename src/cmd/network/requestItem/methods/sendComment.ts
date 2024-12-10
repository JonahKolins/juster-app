import SendCommentRequest, {SendCommentParams, SendCommentResponse} from "../requests/GetReqestItemRequest";

export const sendComment = async (params: SendCommentParams): Promise<SendCommentResponse> => {
    const sendCommentRequest = new SendCommentRequest(params);

    const data: SendCommentResponse = await sendCommentRequest.send();

    return data;
}