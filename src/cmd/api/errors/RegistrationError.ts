import ApplicationError from './ApplicationError';

export default class RegistrationError extends ApplicationError {
    public name = 'RegistrationError';
  
    public constructor(public response: Response) {
      super(`RegistrationError error when performing ${response.url} request: ${response.status}`);
    }
}