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
import { IGetDocParams, requestGetDocs } from "cmd/network/claims/methods/requestGetDocs";
import { IDocumentInfo, IGetDocsResponse } from "cmd/network/claims/requests/GetDocsRequest";
import { requestClaimInfo } from "cmd/network/claims/methods/requestClaimInfo";

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

    public get documents(): IDocumentInfo[] {
        return this._docs;
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

    // чтение списка документов обращения (без содержимого)
    public readClaimDocs = (id: string) => {
        const sessionId = Session.instance.sessionId;
        if (!sessionId || !id) return;
        //
        const params: IGetDocParams = {
            sessionId,
            claimId: id
        };
        
        requestGetDocs(params)
            .then((response: IGetDocsResponse) => {
                console.log('readClaimDocs', response);
                if (response.document) {
                    this._docs = [response.document];
                } else {
                    this._docs = [];
                }
                this._error = null;
            })
            .catch((error) => {
                this._error = error;
                console.log('Claim, readClaimDocs -> error:', error);
            })
            .finally(() => {
                this.claimDataChanged.emit();
            });
    }
    
    // получение конкретного документа по его ID
    public getDocument = (fileId: string): Promise<IGetDocsResponse> => {
        const sessionId = Session.instance.sessionId;
        const claimId = this._claimData?.genId;
        
        if (!sessionId || !claimId || !fileId) {
            return Promise.reject(new Error('Отсутствует sessionId, claimId или fileId'));
        }
        
        const params: IGetDocParams = {
            sessionId,
            claimId,
            fileId
        };
        
        return requestGetDocs(params);
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
                this.readClaimInfo(claimId);
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

    private readClaimInfoRequest = (id: string): Promise<IClaimsItem> => {
        const sessionId = Session.instance.sessionId;
        
        if (!sessionId || !id) {
            return Promise.reject(new Error('Отсутствует sessionId или id обращения'));
        }
        
        return requestClaimInfo({ sessionId, claimId: id });
    }
}