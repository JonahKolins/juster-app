import { Instance } from "../../core/entity";
import { Session } from "../session/Session";
import { EventEmitter } from "../../core/event";
import { ApiError, NetworkError } from "../../core/errors";
import UnauthorizedError from "cmd/api/errors/UnauthorizedError";
import { requestProfile } from "../../cmd/network/profile/methods/requestProfile";
import { IProfileResponse, IUserData } from "cmd/network/profile/requests/GetProfileRequest";

export class Profile {
    private _data: IUserData;
    // private _clientInfo: IProfileClientInfo;
    // private _profileSettings: IProfileSettings;
    private _isLoading: boolean;
    private _isProfileReady: boolean;
    private _error: ApiError | NetworkError;

    public readonly profileChanged: EventEmitter<void>;

    constructor() {
        this.init();

        this.profileChanged = new EventEmitter('profileChanged');

        Session.instance.loginEvent.subscribe(this.onLogin);

        if (Session.instance.loggedIn) {
            this.onLogin();
        }
    }

    // синглтон
    public static get instance() {
        return Instance.getOrCreate<Profile>(Profile, 'Profile');
    }

    public get clientInfo() {
        return this._data;
    }

    public get isLoading() {
        return this._isLoading
    }

    public get profileReady() {
        return this._isProfileReady
    }

    private onLogin = () => {
        console.log('Profile -> onLogin')
        this.readProfile();
    }

    public init = () => {
        this._data = null;
        // this._clientInfo = null;
        // this._profileSettings = null;
        this._isLoading = false;
        this._error = null;
        this._isProfileReady = false;
    }

    public readProfile = () => {
        this._isLoading = true;
        requestProfile()
            .then((response: IProfileResponse) => {
                this.applyReadProfileResponse(response);
            })
            .catch((error) => {
                // если ошибка авторизации, то попытаемся обновить сессию
                if (error instanceof UnauthorizedError) {
                    console.log('== UnauthorizedError in readProfile ==', {error});
                    // попытаемся обновить сессию
                    Session.instance.refresh();
                } else {
                    this._error = error;
                    this._isProfileReady = false;
                    this._isLoading = false;
                    this.profileChanged.emit();
                }
            })
    }

    private applyReadProfileResponse = (response: IProfileResponse) => {
        const profileData = response.data;

        this._data = profileData.user;
        // this._clientInfo = response.user;
        // this._profileSettings = response.profileSettings;
        this._isProfileReady = true;
        this._isLoading = false;
        this._error = null;

        this.profileChanged.emit();
    }
}