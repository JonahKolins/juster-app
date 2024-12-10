import {AxiosResponse} from "axios";

export default interface IAxiosResponseHandler<TData> {
    handleResponse(response: AxiosResponse): Promise<TData>;
}
