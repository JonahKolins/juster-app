import {useEffect, useState} from "react";
import {IClaimsItem} from "../../classes/claim/Claim.Types";
import {BaseClaims} from "../../classes/claim/BaseClaims";

interface IClaimsContext {
    claims: IClaimsItem[];
    isClaimsLoading: boolean;
    isClaimsReady: boolean
}

export const useClaims = (): IClaimsContext => {
    const [claims, setClaims] = useState<IClaimsItem[]>(BaseClaims.instance.claims);
    const [isClaimsLoading, setIsClaimsLoading] = useState<boolean>(BaseClaims.instance.isLoading);
    const [isClaimsReady, setIsClaimsReady] = useState<boolean>(BaseClaims.instance.isReady);

    useEffect(() => {
        const claimsChanged = BaseClaims.instance.claimsChanged.subscribe(handleClaimsChanged);
        BaseClaims.instance.readClaims();
        return () => {
            claimsChanged?.dispose();
        }
    }, [])

    const handleClaimsChanged = () => {
        setClaims(BaseClaims.instance.claims);
        setIsClaimsLoading(BaseClaims.instance.isLoading);
        setIsClaimsReady(BaseClaims.instance.isReady);
    }

    return {
        claims,
        isClaimsLoading,
        isClaimsReady
    }
}