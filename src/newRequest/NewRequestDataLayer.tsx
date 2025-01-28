import React, {createContext, memo, useContext, useState} from "react";
import { ISuggestions } from "./api/requests/GetOrganisationSuggestionsRequest";
import { IClaimReason, IMinRespondentData } from "classes/claim/Claim.Types";

interface NewRequestDataLayerData {
    partnerId: string;
    reason: IClaimReason;
    claimTitle: string;
    claimText: string;
    organisationData: IOrganisationData;
    files: any[],
    setPartnerId: (id: string) => void;
    setReason: (item: IClaimReason) => void;
    setClaimTitle: (title: string) => void;
    setClaimText: (text: string) => void;
    setOrganisationData: (data: IOrganisationData) => void;
    setFiles: (files: any) => void;
}

export type IOrganisationData = IMinRespondentData | ISuggestions;

export const NewRequestDataLayerContext = createContext<NewRequestDataLayerData | undefined>(undefined);

export const useSafeNewRequestDataLayerContext = () => {
    const newRequestDataLayer = useContext(NewRequestDataLayerContext);

    if (!newRequestDataLayer) {
        throw new Error('no newRequestDataLayer context')
    }

    return newRequestDataLayer;
};

interface NewRequestDataLayerProviderProps {
    children: React.ReactNode
}

const NewRequestDataLayerProvider = memo<NewRequestDataLayerProviderProps>(({ children}) => {
    const [reason, setReason] = useState<IClaimReason>(null);
    const [partnerId, setPartnerId] = useState<string>('');
    const [organisationData, setOrganisationData] = useState<IOrganisationData>(null);

    const [claimTitle, setClaimTitle] = useState<string>('');
    const [claimText, setClaimText] = useState<string>('');
    const [files, setFiles] = useState<any>([]);

    // const saveNewOrganisationData = useCallback((data: Partial<IOrganisationData>) => {
    //     console.log('organisationData', organisationData)
    //     console.log('data', data)
    //     setOrganisationData({
    //         ...organisationData,
    //         ...data,
    //     })
    // }, [organisationData])

    return (
        <NewRequestDataLayerContext.Provider
            value={{
                partnerId,
                reason,
                claimTitle,
                claimText,
                organisationData,
                files,
                setPartnerId,
                setReason,
                setClaimTitle,
                setClaimText,
                setOrganisationData,
                setFiles
            }}
        >
            {children}
        </NewRequestDataLayerContext.Provider>
    )
})

export default NewRequestDataLayerProvider;