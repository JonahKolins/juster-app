import {Instance} from "../../core/entity";
import {Session} from "../session/Session";
import {requestProfile} from "../../cmd/network/profile/methods/requestProfile";
import {
    IProfileClientInfo,
    IProfileResponse,
    IProfileSettings
} from "../../cmd/network/profile/requests/PostProfileRequest";
import {EventEmitter} from "../../core/event";
import {ApiError, NetworkError} from "../../core/errors";

export class Profile {

    private _clientInfo: IProfileClientInfo;
    private _profileSettings: IProfileSettings;
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
        return this._clientInfo;
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
        this._clientInfo = null;
        this._profileSettings = null;
        this._isLoading = false;
        this._error = null;
        this._isProfileReady = false;
    }

    public readProfile = () => {
        const sessionId = Session.instance.sessionId;
        if (!sessionId) return;

        this._isLoading = true;
        requestProfile(sessionId)
            .then((response) => {
                this.applyReadProfileResponse(response);
            })
            .catch((error) => {
                this._error = error;
                this._isProfileReady = false;
                this._isLoading = false;
                this.profileChanged.emit();
            })
    }

    private applyReadProfileResponse = (response: IProfileResponse) => {
        this._clientInfo = response.clientInfo.user;
        this._profileSettings = response.profileSettings;
        this._isProfileReady = true;
        this._isLoading = false;
        this._error = null;

        this.profileChanged.emit();
    }
}