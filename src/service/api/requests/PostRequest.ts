import RequestSender from '../RequestSender';
import IResponseHandler from '../handlers/IResponseHandler';

const HOST = 'http://juster-test-ift.ru';

export default abstract class PostRequest<TData> {
  protected abstract url: string;

  protected abstract body: unknown;

  protected abstract responseHandler: IResponseHandler<TData>;

  protected additionalHeaders: Record<string, string> = {};

  protected timeout = 15000;

  protected host: string;

  private get requestInit(): RequestInit {
    const { body, additionalHeaders } = this;

    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...additionalHeaders,
      },
      body: JSON.stringify(body),
    };
  }

  public async send() {
    const { url, requestInit, timeout, responseHandler, host } = this;
    const requestHost = host ? host : HOST;

    const response = await RequestSender.sendRequest(`${requestHost}${url}`, requestInit, timeout);

    const data = await responseHandler.handleResponse(response);

    return data;
  }
}
