import { Session } from "../session/Session";
import { EventEmitter } from "../../core/event";
import { Instance } from "../../core/entity";
import { Profile } from "../profile/Profile";
import { ICreateNewClaimResponse } from "../../cmd/network/claims/requests/PostCreateNewClaimRequest";
import { ICreateNewClaimRequest, requestCreateNewClaim } from "../../cmd/network/claims/methods/requestCreateNewClaim";
import { requestClaimDraft } from "cmd/network/claims/methods/requestClaimDraft";
import { IClaimDraftResponse } from "cmd/network/claims/requests/PostClaimDraftRequest";
import { ISuggestions } from "newRequest/api/requests/GetOrganisationSuggestionsRequest";
import { getRespondentSuggestions } from "newRequest/api/methods/getOrganisationSuggestionsRequest";
import { requestSaveDocs } from "cmd/network/claims/methods/requestSaveDocs";
import { ICreateClaimInfo } from "./ClaimCreator.Types";
import { IClaimReason, IMinRespondentData } from "./Claim.Types";
import UnauthorizedError from "../../cmd/api/errors/UnauthorizedError";

export class ClaimCreator {
    private _claimInfo: ICreateClaimInfo;
    private _isLoading: boolean;
    //
    private _errorClaim: any;
    private _errorDraft: any;

    public readonly claimCreatorDataChanged: EventEmitter<void>;

    constructor() {
        this.initClaimInfo();
        this._isLoading = false;
        this._errorClaim = null;
        this._errorDraft = null;

        this.claimCreatorDataChanged = new EventEmitter('claimCreatorDataChanged');

        Profile.instance.profileChanged.subscribe(this.onProfileChanged);
    }

    // синглтон
    public static get instance() {
        return Instance.getOrCreate<ClaimCreator>(ClaimCreator, 'ClaimCreator');
    }

    public dispose = () => {
        this.initClaimInfo();
        this._errorClaim = null;
        this._errorDraft = null;
        this._isLoading = false;
    }

    private onProfileChanged = () => {
        // мы посылали запрос создания нового Обращения, но сессия протухла
        // мы ее обновили -> обновился профиль -> теперь можем снова запросить Обращения
        if (!!this._claimInfo && Profile.instance.profileReady) {
            // есть ошибка при создании Обращения
            if (this._errorClaim) {
                this.createClaim(); 
            } 
            // есть ошибка при создании черновика
            if (this._errorDraft) {
                this.createDraft();
            }
        }
    }

    // инициализация данных для нового обращения
    private initClaimInfo = () => {
        this._claimInfo = {
            draftId: '',
            name: '',
            text: '',
            files: [],
            partnerId: '',
            respondent: null,
            reason: null,
            claimAmount: ''
        };
    }   

    // геттеры

    public get claimInfo(): ICreateClaimInfo {
        return this._claimInfo;
    }

    // минимальные данные "Ответчика" для отправки в черновик
    public get minRespondentData(): IMinRespondentData {
        if (!this._claimInfo) return null;
        if (!this._claimInfo.respondent) return null;
        return {
            inn: this._claimInfo.respondent.inn,
            name: this._claimInfo.respondent.name,
            address: this._claimInfo.respondent.address
        }
    }

    // id партнера
    public get partnerId(): string {
        return this._claimInfo.partnerId || null;
    }

    // есть ли черновик
    public get isCreatedDraft(): boolean {
        return !!this._claimInfo.draftId;
    }

    public get files(): File[] {
        if (!this._claimInfo) return [];
        return this._claimInfo.files?.length ? this._claimInfo.files : [];
    }

    public get isLoading(): boolean {
        return this._isLoading;
    }

    // сеттеры

    public setReason = (reason: IClaimReason) => {
        this._claimInfo.reason = reason;
        this.claimCreatorDataChanged.emit();
    }

    public setName = (name: string) => {
        this._claimInfo.name = name;
        this.claimCreatorDataChanged.emit();
    }

    public setText = (text: string) => {
        this._claimInfo.text = text;
        this.claimCreatorDataChanged.emit();
    }

    // public setFiles = (files: UploadFile[]) => {
    //     this._claimInfo.files.push(...files);
    //     this.claimCreatorDataChanged.emit();
    // }

    // устанавливает "Ответчик" (компания, учреждение, ИП ...)
    public setRespondent = (newRespondent: IMinRespondentData) => {
        this._claimInfo.respondent = newRespondent;
        this.claimCreatorDataChanged.emit();
    }

    public setPartnerId = (partnerId: string) => {
        this._claimInfo.partnerId = partnerId;
        this.claimCreatorDataChanged.emit();
    }

    /*
    * черновик
    */

    // создает или обновляет черновик
    public createOrUpdateDraft = (): Promise<IClaimDraftResponse> => {
        if (this.isCreatedDraft) {
            return this.updateDraft();
        }
        return this.createDraft();
    }

    // только создает черновик (не обновляет)
    public createDraft = (): Promise<IClaimDraftResponse> => {
        const sessionId = Session.instance.sessionId;

        if (!sessionId || !this._claimInfo) return;

        this._errorDraft = null;
        this._isLoading = true;

        return new Promise((resolve, reject) => {
            requestClaimDraft({
                sessionId,
                claimName: "",       
                contentType: this._claimInfo.reason?.text || "",         
                contentSum: "",          
                claimText: "",           
                recipientInn: "",        
                recipientName: "",       
                recipientAddress: "",    
                recipientEmail: "",      
                draftId: ""             
            }).then((response: IClaimDraftResponse) => {
                this._claimInfo.draftId = response.claimId;
                this._isLoading = false;
                //
                resolve(response);
            }).catch((error) => {
                console.log('== error ==', {error});
                this._errorDraft = error;
                this._isLoading = false;
                //
                reject(error);
            })
        })
    }

    // обновляет черновик
    public updateDraft = (): Promise<IClaimDraftResponse> => {
        const sessionId = Session.instance.sessionId;

        if (!sessionId || !this._claimInfo) return;  

        this._errorDraft = null;
        this._isLoading = true;

        return new Promise((resolve, reject) => {
            requestClaimDraft({
                sessionId,
                claimName: this._claimInfo.name || "",       
                contentType: this._claimInfo.reason?.text || "",         
                contentSum: "",          
                claimText: this._claimInfo.text || "",           
                recipientInn: this._claimInfo.respondent?.inn || "",        
                recipientName: this._claimInfo.respondent?.name || "",       
                recipientAddress: this._claimInfo.respondent?.address || "",    
                recipientEmail: "",      
                draftId: this._claimInfo.draftId || ""              
            }).then((response: IClaimDraftResponse) => {
                console.log('== response ==', {response});
                this._isLoading = false;
                resolve(response);
            }).catch((error) => {
                console.log('== error ==', {error});
                this._errorDraft = error;
                this._isLoading = false;
                reject(error);
            })
        })
    }

    // поиск рекомендуемых "Ответчиков" по введенному значению
    public searchSuggestion = (value: string): Promise<ISuggestions[]> => {
        return new Promise((resolve, reject) => {
            getRespondentSuggestions(value)
                .then((res) => {
                    resolve(res.suggestions);
                })
                .catch((err) => {
                    reject(err);
                })
        })
    }

    /*
    * создание обращения (финальный запрос)
    */

    // запрос на создание обращения
    public createClaim = (): Promise<ICreateNewClaimResponse> => {
        const sessionId = Session.instance.sessionId;

        if (!sessionId || !this._claimInfo) return;

        this._errorClaim = null;
        this._isLoading = true;

        const readyClaimInfo: ICreateNewClaimRequest = {
            sessionId,
            claimName: this._claimInfo.name || "",
            recipientInn: this._claimInfo.respondent?.inn || "",
            recipientName: this._claimInfo.respondent?.name || "",
            recipientAddress: this._claimInfo.respondent?.address || "",
            recipientEmail: "",
            contentType: this._claimInfo.reason.text || "",
            contentSum: "",
            claimText: this._claimInfo.text || "",
            draftId: this._claimInfo.draftId || ""
        }

        return new Promise((resolve, reject) => {
            requestCreateNewClaim(readyClaimInfo)
                .then((response: ICreateNewClaimResponse) => {
                    if (response.error) {
                        reject(response.error);
                        return;
                    }
                    // остановим загрузку
                    this._isLoading = false;
                    // вернем ответ
                    resolve(response);
                })
                .catch((error) => {
                    // мы не авторизованны
                    if (error instanceof UnauthorizedError) {
                        console.log('== UnauthorizedError in createClaim ==', {error});
                        // обновим сессию
                        Session.instance.refresh();
                    }
                    // сохраним ошибку
                    this._errorClaim = error;
                    // остановим загрузку
                    this._isLoading = false;
                    // пошлем событие изменения подписчикам
                    this.claimCreatorDataChanged.emit();
                    //
                    reject(error);
                })
        })
    }

    /*
    * работа с файлами
    */

    // сохранение файлов
    public saveFiles = (files: File[], withUpload: boolean = true): Promise<void> => {
        // добавим файл в список файлов
        this._claimInfo.files = [...this._claimInfo.files, ...files];

        const sessionId = Session.instance.sessionId;
        const claimId = this._claimInfo.draftId;

        if (!sessionId || !claimId) return Promise.reject(`sessionId or claimId not found. sessionId: ${sessionId}, claimId: ${claimId}`);

        if (!withUpload) return Promise.resolve();

        return new Promise((resolve, reject) => {
            requestSaveDocs({sessionId, claimId, files})
                .then((response) => {
                    if (response.error) {
                        console.log('Ошибка при сохранении файла:', response.error);
                        reject(response.error);
                        return;
                    }
                    console.log('Файл успешно сохранен:', response);
                    resolve();
                })
                .catch((error) => {
                    console.log('Ошибка при выполнении запроса сохранения файла:', error);
                    reject(error);
                });
        })
    }

    public deleteFile = (fileId: string): Promise<void> => {


        return new Promise((resolve, reject) => {

        })
    }

}
