import PutRequest from "../../../api/requests/PutRequest";
import JSONResponseHandler from "../../../api/handlers/JSONResponseHandler";
import { IResponse } from "cmd/api/types";
import { Roles } from "classes/role/roles";

// Повторно используем интерфейсы из PostProfileRequest
export interface IProfileData {
    id: string;
    email: string;
    name: string;
    role: Roles;
    createdAt: Date;
    updatedAt: Date;
}

// Интерфейс для данных обновления профиля
export interface IUpdateProfileData {
    firstName?: string;
    lastName?: string;
    email?: string;
    address?: string;
}

export type IProfileResponse = IResponse<IProfileData>

const UPDATE_PROFILE_URL = '/user/profile';

class PutProfileRequest extends PutRequest<IProfileResponse> {
    public constructor(private updateData: IUpdateProfileData) {
        super();
    }

    protected responseHandler = new JSONResponseHandler<IProfileResponse>();

    protected url = UPDATE_PROFILE_URL;

    protected additionalRequestInit: Partial<RequestInit> = {
        credentials: 'include'  // чтобы браузер отправил cookies с запросом
    }

    protected body = {
        ...this.updateData
    }
}

export default PutProfileRequest; 