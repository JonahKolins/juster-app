import RequestSender from '../RequestSender';
import IResponseHandler from '../handlers/IResponseHandler';

const HOST = 'http://juster-test-ift.ru/api';

export default abstract class PostFormDataRequest<TData> {
  protected abstract url: string;

  protected abstract body: Record<string, string | Blob>;

  protected abstract responseHandler: IResponseHandler<TData>;

  protected timeout = 15000;

  protected additionalHeaders: Record<string, string> = {};

  private get requestInit(): RequestInit {
    const { body, additionalHeaders } = this;

    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      console.log('[key, value]', [key, value])
      formData.append(key, value);
    });

    return {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        ...additionalHeaders,
      },
      body: formData,
    };
  }

  public async send() {
    const { url, requestInit, timeout, responseHandler } = this;

    const response = await RequestSender.sendRequest(`${HOST}${url}`, requestInit, timeout);

    const data = await responseHandler.handleResponse(response);

    return data;
  }
}
