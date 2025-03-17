import RequestSender from '../RequestSender';
import IResponseHandler from '../handlers/IResponseHandler';
import { HOST } from '../host';

export default abstract class DeleteRequest<TData> {
  protected abstract url: string;

  protected requestInitPart: Omit<RequestInit, 'method'> = {};

  protected timeout = 15000;

  protected abstract responseHandler: IResponseHandler<TData>;

  protected body?: unknown;

  protected additionalHeaders: Record<string, string> = {};

  protected host: string;

  private get requestInit(): RequestInit {
    const { requestInitPart, body, additionalHeaders } = this;
    
    const init: RequestInit = {
      ...requestInitPart,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...additionalHeaders,
      },
    };

    if (body) {
      init.body = JSON.stringify(body);
    }

    return init;
  }

  public async send() {
    const { url, requestInit, timeout, responseHandler, host } = this;
    const requestHost = host ? host : HOST;

    const response = await RequestSender.sendRequest(`${requestHost}${url}`, requestInit, timeout);

    const data = await responseHandler.handleResponse(response);

    return data;
  }
} 