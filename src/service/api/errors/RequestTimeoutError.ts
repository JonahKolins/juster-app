import NetworkError from './NetworkError';

export default class RequestTimeoutError extends NetworkError {
  public name = 'RequestTimeoutError';

  public constructor(public url: string, public requestInit: RequestInit, public timeout: number) {
    super('Сервер не отвечает');
  }
}
