import IResponseHandler from './IResponseHandler';
import JSONResponseParseError from '../errors/JSONResponseParseError';
import ExpectedErrorCodeResponseHandler from './ExpectedErrorCodeResponseHandler';

export default class JSONResponseHandler<TData> implements IResponseHandler<TData> {
  private expectedErrorCodeResponseHandler = new ExpectedErrorCodeResponseHandler();

  public async handleResponse(response: Response) {
    const { expectedErrorCodeResponseHandler } = this;

    const handledResponse = await expectedErrorCodeResponseHandler.handleResponse(response);

    try {
      const data: TData = await handledResponse.json();

      return data;
    } catch (err) {
      console.log('JSONResponseHandler -> err', {err})
      throw new JSONResponseParseError(handledResponse, err);
    }
  }
}
