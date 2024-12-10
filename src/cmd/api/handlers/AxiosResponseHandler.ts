import IAxiosResponseHandler from "./IAxiosResponseHandler";
import {AxiosResponse} from "axios";

export default class AxiosResponseHandler<TData> implements IAxiosResponseHandler<TData>  {

    public async handleResponse(response: AxiosResponse) {
        if (response.status === 200) {
            try {
                const data: TData = await response.data;
                return data;
            } catch (err) {
                console.log('handleResponse error', err)
            }
        }
    }
}