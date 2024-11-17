import {IClaimsItemResponse, TClaimAction} from "./Claim.Types";
import {EventEmitter} from "../../core/event";
import {testClaimInfo} from "../../app/auth/methods/testClaimInfo";
import {ICreateClaimActionRequestParams, testCreateClaimAction} from "../../app/auth/methods/testCreateClaimAction";
import {ApiError, NetworkError} from "../../core/errors";

export class Claim {
    private _claimData: IClaimsItemResponse;
    //
    private _isLoading: boolean;
    private _error: ApiError | NetworkError;
    //
    public readonly claimDataChanged: EventEmitter<void>;

    constructor() {
        this._claimData = null;
        //
        this._isLoading = false;
        this._error = null;
        //
        this.claimDataChanged = new EventEmitter('claimDataChanged');
    }

    public dispose = () => {
        this._claimData = null;
        //
        this._isLoading = false;
        this._error = null;
    }

    public get actions(): TClaimAction[] {
        if (!this._claimData) return null;
        return this._claimData.actions;
    }

    public get claimData(): IClaimsItemResponse {
        return this._claimData
    }

    public get isLoading(): boolean {
        return this._isLoading
    }

    public get error(): ApiError | NetworkError {
        return this._error
    }

    private setLoadingState = (value: boolean) => {
        this._isLoading = value;
        this.claimDataChanged.emit();
    }

    public readClaimInfo = (id: string) => {
        this.setLoadingState(true);
        //
        this.readClaimInfoRequest(id)
            .then((response) => {
                console.log('readClaimInfoRequest', response)
                this._claimData = response;
                //
                this._error = null;
            })
            .catch((error) => {
                this._error = error;
                console.log('Claim, readClaimInfo -> error:', error);
            })
            .finally(() => {
                this.setLoadingState(false);
                this.claimDataChanged.emit();
            })
    }

    public addAction = (action: Omit<TClaimAction, 'id'>) => {
        this.addNewActionRequest({claimId: this._claimData.id, action: action})
            .then((response) => {
                this._claimData = response;
                //
                this._error = null;
            })
            .catch((error) => {
                this._error = error;
                console.log('Claim, addAction -> error:', error);
            })
            .finally(() => {
                this.setLoadingState(false);
                this.claimDataChanged.emit();
            })
    }

    private readClaimInfoRequest = (id: string): Promise<IClaimsItemResponse> => {
        return testClaimInfo({id: id})
    }

    private addNewActionRequest = (params: ICreateClaimActionRequestParams) => {
        return testCreateClaimAction(params)
    }
}