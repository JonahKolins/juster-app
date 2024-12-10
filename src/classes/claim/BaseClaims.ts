import {IClaimsItem} from "./Claim.Types";
import {Instance} from "../../core/entity";
import {ApiError, NetworkError} from "../../core/errors";
import {EventEmitter} from "../../core/event";
import {Profile} from "../profile/Profile";
import {requestClaims} from "../../cmd/network/claims/methods/requestClaims";
import UnauthorizedError from "../../cmd/api/errors/UnauthorizedError";
import {Session} from "../session/Session";

export class BaseClaims {
    private _claims: IClaimsItem[];
    private _isLoading: boolean;
    private _isClaimsReady: boolean;
    private _error: any;

    public readonly claimsChanged: EventEmitter<void>;

    constructor() {
        this._claims = [];
        this._isLoading = false;
        this._isClaimsReady = false;
        this._error = null;
        //
        this.claimsChanged = new EventEmitter('claimsChanged');

        Profile.instance.profileChanged.subscribe(this.onProfileChanged);
    }

    // синглтон
    public static get instance() {
        return Instance.getOrCreate<BaseClaims>(BaseClaims, 'BaseClaims');
    }

    private onProfileChanged = () => {
        // мы посылали запрос на Обращения, но сессия протухла
        // мы ее обновили -> обновился профиль -> теперь можем снова запросить Обращения
        // if (
        //     this._error &&
        //     this._isClaimsReady &&
        //     Profile.instance.profileReady
        // ) {
        //     this.readClaims();
        // }
    }

    public get claims(): IClaimsItem[] {
        return this._claims;
    }

    public get isLoading(): boolean {
        return this._isLoading;
    }

    public get isReady(): boolean {
        return this._isClaimsReady;
    }

    public getClaimById = (id: string): IClaimsItem => {
        if (!this._claims.length) return null;

        const claim = this._claims.find((claim) => claim.id == id);
        return !!claim ? claim : null;
    }

    public addNewClaim = (claimInfo: IClaimsItem) => {
        this._claims.push(claimInfo);
        this.claimsChanged.emit();
    }

    public readClaims = () => {
        const sessionId = Session.instance.sessionId;
        if (!sessionId) return;

        this._error = null;
        this._isLoading = true;
        this.claimsChanged.emit();

        requestClaims(sessionId)
            .then((response) => {
                this._claims = response.claims;
                this._isClaimsReady = true;
            })
            .catch((error) => {
                // мы не авторизованны
                if (error instanceof UnauthorizedError) {
                    console.log('== UnauthorizedError in readClaims ==', {error});
                }
                // сохраним ошибку
                this._error = error;
                this._isClaimsReady = false;
            })
            .finally(() => {
                // остановим загрузку
                this._isLoading = false;
                // пошлем событие изменения подписчикам
                this.claimsChanged.emit();
            })
    }
}