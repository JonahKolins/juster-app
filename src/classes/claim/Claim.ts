import {IAction, IClaimsItem, IClaimStatus} from "./Claim.Types";
import {EventEmitter} from "../../core/event";
import {ICreateClaimActionRequestParams, testCreateClaimAction} from "../../app/auth/methods/testCreateClaimAction";
import {ApiError, NetworkError} from "../../core/errors";
import { BaseClaims } from "./BaseClaims";
import { IAddClaimActionRequestParams, IClaimActionRequestInfo, requestAddClaimAction } from "cmd/network/claims/methods/requestAddClaimAction";
import { Session } from "classes/session/Session";
import { IPostAddClaimActionResponse } from "cmd/network/claims/requests/PostAddClaimAction";
import { IChangeClaimStatusRequestParams, requestChangeClaimStatus } from "cmd/network/claims/methods/requestChangeClaimStatus";
import { IPostChangeClaimStatusResponse } from "cmd/network/claims/requests/PostChangeClaimStatusRequest";
import { requestGetDocs } from "cmd/network/claims/methods/requestGetDocs";
import { IDocumentInfo, IGetDocsResponse } from "cmd/network/claims/requests/PostGetDocsRequest";

export class Claim {
    private _claimData: IClaimsItem;
    private _docs: IDocumentInfo[];
    //
    private _isLoading: boolean;
    private _error: ApiError | NetworkError;
    //
    public readonly claimDataChanged: EventEmitter<void>;

    // private _claimsChanged: VoidFunction;

    constructor() {
        this._claimData = null;
        this._docs = [];
        //
        this._isLoading = false;
        this._error = null;
        //
        this.claimDataChanged = new EventEmitter('claimDataChanged');
        // this._claimsChanged = BaseClaims.instance.claimsChanged.subscribe(onClaimsChanged);
    }

    public dispose = () => {
        this._claimData = null;
        //
        this._isLoading = false;
        this._error = null;
    }

    public get actions(): IAction[] {
        if (!this._claimData) return null;
        return this._claimData.claimInfo.actions || [];
    }

    public get claimData(): IClaimsItem {   
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
            .then((response: IClaimsItem) => {
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

    // чтение документов обращения
    public readClaimDocs = (id: string) => {
        const sessionId = Session.instance.sessionId;
        if (!sessionId || !id) return;
        //
        requestGetDocs({claimId: id, sessionId})
            .then((response: IGetDocsResponse) => {
                console.log('readClaimDocs', response)
                this._docs = response.documents;
                this._error = null;
            })
            .catch((error) => {
                this._error = error;
                console.log('Claim, readClaimDocs -> error:', error);
            })
            .finally(() => {
                this.claimDataChanged.emit();
            })
    }

    public addAction = (actionInfo: IClaimActionRequestInfo) => {
        const sessionId = Session.instance.sessionId;
        const claimId = this._claimData.genId;

        if (!sessionId || !claimId) return;

        const payload: IAddClaimActionRequestParams = {
            sessionId,
            claimId,
            action: actionInfo
        }

        requestAddClaimAction(payload)
            .then((response: IPostAddClaimActionResponse) => {
                // this._claimData = response;
                //
                this._error = null;
                BaseClaims.instance.readClaims();
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

    // меняет статус -> создает экшен 
    public changeStatus = (status: IClaimStatus) => {
        const sessionId = Session.instance.sessionId;
        const claimId = this._claimData.genId;

        if (!sessionId || !claimId) return;

        const payload: IChangeClaimStatusRequestParams = {
            sessionId,
            claimId,
            status
        }

        requestChangeClaimStatus(payload)
            .then((response: IPostChangeClaimStatusResponse) => {
                // this._claimData = response;
                //
                this._error = null;
                BaseClaims.instance.readClaims();
            })
            .catch((error) => {
                this._error = error;
                console.log('Claim, changeStatus -> error:', error);
            })
            .finally(() => {
                this.setLoadingState(false);
                this.claimDataChanged.emit();
            })
    }    

    // TODO сделать отдельный запрос 
    private readClaimInfoRequest = (id: string): Promise<IClaimsItem> => {
        return new Promise((resolve, reject) => {
            const data = BaseClaims.instance.getClaimById(id);

            if (!data) {
                BaseClaims.instance.readClaims();

                // TODO убрать этот костыль когда будет отдельный запрос
                window.setTimeout(() => {
                    const secondData = BaseClaims.instance.getClaimById(id);
                    resolve(secondData);
                }, 1000);
            } else {
                resolve(data);
            }
        })
    }

    private addNewActionRequest = (params: ICreateClaimActionRequestParams) => {
        return testCreateClaimAction(params)
    }
}