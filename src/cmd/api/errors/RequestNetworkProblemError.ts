import NetworkError from './NetworkError';

export default class RequestNetworkProblemError extends NetworkError {
  public name = 'RequestNetworkProblemError';

  public constructor(public url: string, public requestInit: RequestInit, public originalError: unknown) {
    super('Ошибка сети во время выполнения запроса');
  }
}
