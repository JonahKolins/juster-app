import GetRequest from "../../../api/requests/GetRequest";
import JSONResponseHandler from "../../../api/handlers/JSONResponseHandler";
import { IResponse } from "cmd/api/types";
import { Roles } from "classes/role/roles";

export interface IUserData {
    id: string;
    email: string;
    name: string;
    role: Roles;
    createdAt: Date;
    updatedAt: Date;
}

export interface IProfileData {
    user: {
        id: string;
        email: string;
        name: string;
        role: Roles;
        createdAt: Date;
        updatedAt: Date;
    }
}

export type IProfileResponse = IResponse<IProfileData>

const PROFILE_URL = '/user/profile';

class GetProfileRequest extends GetRequest<IProfileResponse> {
    public constructor() {
        super();
    }

    protected responseHandler = new JSONResponseHandler<IProfileResponse>();

    protected url = PROFILE_URL;

    protected requestInitPart: Omit<RequestInit, 'method'> = {
        credentials: 'include',  // чтобы браузер отправил cookies с запросом
        headers: {
            'Accept': 'application/json'
        }
    };
}

export default GetProfileRequest; 