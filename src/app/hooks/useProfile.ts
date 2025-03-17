import {useEffect, useState} from "react";
import {Profile} from "../../classes/profile/Profile";
import { IUserData } from "cmd/network/profile/requests/GetProfileRequest";

interface IProfileInfo {
    clientInfo: IUserData;
    isProfileLoading: boolean;
    isProfileReady: boolean;
}

export const useProfile = (): IProfileInfo => {
    const [clientInfo, setClientInfo] = useState<IUserData>(Profile.instance.clientInfo);
    const [isProfileLoading, setIsProfileLoading] = useState<boolean>(Profile.instance.isLoading);
    const [isProfileReady, setIsProfileReady] = useState<boolean>(Profile.instance.profileReady);

    useEffect(() => {
        const profileChangeEvent = Profile.instance.profileChanged.subscribe(handleProfileChange);

        return () => {
            profileChangeEvent?.dispose();
        }
    }, [])

    const handleProfileChange = () => {
        setClientInfo(Profile.instance.clientInfo);
        setIsProfileLoading(Profile.instance.isLoading);
        setIsProfileReady(Profile.instance.profileReady);
    }

    return {
        clientInfo,
        isProfileLoading,
        isProfileReady
    }
}