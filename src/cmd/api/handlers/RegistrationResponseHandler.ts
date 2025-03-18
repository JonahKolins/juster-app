import IResponseHandler from './IResponseHandler';
import JSONResponseParseError from '../errors/JSONResponseParseError';

export default class RegistrationResponseHandler<TData> implements IResponseHandler<TData> {
    public async handleResponse(response: Response): Promise<TData> {
        console.log('RegistrationResponseHandler, response', response);
        
        // if (response.status === 400) {
        //     const errorData = await response.json();
        //     console.log('errorData', errorData);
        //     throw new RegistrationError(response);
        // }

        // if (!response.ok) {
        //     throw new BadResponseError(response);
        // }

        try {
            const data: TData = await response.json();
            return data;
        } catch (err) {
            console.log('JSONResponseHandler -> err', {err})
            throw new JSONResponseParseError(response, err);
        }
    }
} 