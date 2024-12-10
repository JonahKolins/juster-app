import {Instance} from "../../core/entity";
import {requestLogin} from "../../cmd/network/login/methods/requestLogin";
import {EventEmitter, EventHandle} from "../../core/event";
import {ApiError, NetworkError, RuntimeError} from "../../core/errors";
import {requestSessionInfo} from "../../cmd/network/session/methods/requestInfo";
import {requestRefresh} from "../../cmd/network/session/methods/requestRefresh";
import {RefreshResponse} from "../../cmd/network/session/requests/PostRefreshRequest";
import UnauthorizedError from "../../cmd/api/errors/UnauthorizedError";

// описание типов для события loginStateChanged
export type LoginStateChangedMessage = void;
export type LoginStateChangedHandle = EventHandle<LoginStateChangedMessage>;
export type LoginStateChangedEmitter = EventEmitter<LoginStateChangedMessage>;

// описание типов для события login
export type LoginMessage = void;
export type LoginHandle = EventHandle<LoginMessage>;
export type LoginEmitter = EventEmitter<LoginMessage>;

// описание типов для события logout
export type LogoutMessage = void;
export type LogoutHandle = EventHandle<LogoutMessage>;
export type LogoutEmitter = EventEmitter<LogoutMessage>;

// описание типов для события sessionDataChanged
export type SessionDataChangedMessage = void;
export type SessionDataChangedHandle = EventHandle<SessionDataChangedMessage>;
export type SessionDataChangedEmitter = EventEmitter<SessionDataChangedMessage>;

export enum LoginState {
    // пользователь не авторизован
    loggedOut = 'loggedOut',
    // приложение в состоянии выполнения логина
    loginInProgress = 'loginInProgress',
    // пользователь авторизован
    loggedIn = 'loggedIn',
    // приложение восстанавливает сессию при старте
    restoreSessionInProgress = 'restoreSessionInProgress',
    // ошибка авторизации код ошибки можно прочитать в .error
    error = 'error',
}

export class Session {
    private _sessionId: string;
    private _loginState: LoginState;
    private _error: ApiError | NetworkError;

    public readonly loginStateChanged: LoginStateChangedEmitter;
    public readonly loginEvent: LoginEmitter;
    public readonly logoutEvent: LogoutEmitter;
    public readonly sessionDataChangedEvent: SessionDataChangedEmitter;

    constructor() {
        this._sessionId = localStorage.getItem("sessionId") || '';
        this._loginState = LoginState.loggedOut;
        this._error = null;

        // Создаем EventEmitter для отслеживания состояний процесса логина
        this.loginStateChanged = new EventEmitter('loginStateChanged');
        //  события login и logout
        this.loginEvent = new EventEmitter('login');
        this.logoutEvent = new EventEmitter('logout');
        // событие sessionDataChanged
        this.sessionDataChangedEvent = new EventEmitter('sessionDataChanged');
    }

    // синглтон
    public static get instance() {
        return Instance.getOrCreate<Session>(Session, 'Session');
    }

    public get sessionId(): string {
        return this._sessionId
    }

    public get loginState(): LoginState {
        return this._loginState;
    }

    public get loggedIn(): boolean {
        //TODO убрать !==
        return this._loginState == LoginState.loggedIn;
    }

    public get loggedOut(): boolean {
        return this._loginState == LoginState.loggedOut || this._loginState == LoginState.error;
    }

    public get isLoading(): boolean {
        return this._loginState == LoginState.loginInProgress || this._loginState == LoginState.restoreSessionInProgress;
    }

    public get error(): ApiError | NetworkError {
        return this._error;
    }

    private setLoginState = (loginState: LoginState) => {
        if (loginState == LoginState.error) {
            throw new RuntimeError(`Session.setLoginState: loginState has LoginState.error`);
        }

        if (this._loginState == loginState) return;
        const prevLoginState = this._loginState;
        this._loginState = loginState;
        this.loginStateChanged.emit();

        if (prevLoginState == LoginState.loggedIn) {
            this.onLogout();
        }

        if (this._loginState == LoginState.loggedIn) {
            this.onLogin();
        }
    }

    private setLoginError = (error: ApiError | NetworkError) => {
        const prevLoginState = this._loginState;
        this._loginState = LoginState.error;
        this._error = error;

        this.loginStateChanged.emit();

        if (prevLoginState == LoginState.loggedIn) {
            this.onLogout();
        }
    }

    // логин
    public login = (email: string, password: string): Promise<void> => {
        this.setLoginState(LoginState.loginInProgress);
        this._error = null;

        return new Promise((resolve, reject) => {
            requestLogin(email, password)
                .then((response) => {
                    console.log('session login response', response)
                    if (!response) return;

                    this._sessionId = response.sessionId;
                    localStorage.setItem('sessionId', response.sessionId);
                    this.setLoginState(LoginState.loggedIn);
                    this.sessionDataChangedEvent.emit();

                    resolve();
                })
                .catch((error) => {
                    console.log('session login error', error)
                    this.setLoginError(error);
                    this.setLoginState(LoginState.loggedOut);
                    reject(error);
                })
        })
    }

    // восстановление сессии
    public restore = (): Promise<void> => {
        if (!this._sessionId) {
            this.setLoginState(LoginState.loggedOut);
            return Promise.reject('no clientId to restore');
        }

        this.setLoginState(LoginState.restoreSessionInProgress);

        return new Promise((resolve, reject) => {
            requestSessionInfo(this._sessionId)
                .then((response) => {
                    console.log('session restore response', response)
                    if (!response) return;

                    this._sessionId = response.sessionId;
                    localStorage.setItem('sessionId', response.sessionId);
                    this.setLoginState(LoginState.loggedIn);
                    this.sessionDataChangedEvent.emit();

                    resolve();
                })
                .catch((error) => {
                    if (error instanceof UnauthorizedError) {
                        console.log('== UnauthorizedError in restore ==', {error});
                    }
                    this.setLoginError(error);
                    this.setLoginState(LoginState.loggedOut);
                    reject();
                })
        })
    }

    public refresh = async (): Promise<void> => {
        try {
            const refreshResponse: RefreshResponse = await requestRefresh();
            console.log('session refresh refreshResponse', refreshResponse)
            if (refreshResponse) {
                this.setLoginState(LoginState.loggedIn);
                this.sessionDataChangedEvent.emit();
            }
        } catch (error) {
            console.log('session refresh catch', error)
            this.setLoginError(error);
            this.setLoginState(LoginState.loggedOut);
        }
    }

    public logout = () => {
        this._sessionId = null;
        this._error = null;
        this.setLoginState(LoginState.loggedOut);
        localStorage.removeItem('token');
        // тут будет код логаута
    }

    private onLogin() {
        this.loginEvent.emit();
    }

    private onLogout() {
        this.logoutEvent.emit();
    }
}