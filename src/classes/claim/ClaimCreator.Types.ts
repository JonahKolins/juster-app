import { UploadFile } from "antd";
import { IClaimReason, IMinRespondentData } from "./Claim.Types";

export interface ICreateClaimInfo {
    draftId: string;
    name: string;
    text: string;
    respondent: IMinRespondentData; // TODO дополнить интерфейс до полных данных организации
    files: UploadFile[];
    partnerId: string;
    reason: IClaimReason;
    claimAmount: string;
}