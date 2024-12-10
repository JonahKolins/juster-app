import {useEffect, useState} from "react";
import {IProfileClientInfo} from "../../cmd/network/profile/requests/PostProfileRequest";
import {Profile} from "../../classes/profile/Profile";

interface IProfileInfo {
    clientInfo: IProfileClientInfo;
    isProfileLoading: boolean;
    isProfileReady: boolean;
}

export const useProfile = (): IProfileInfo => {
    const [clientInfo, setClientInfo] = useState<IProfileClientInfo>(Profile.instance.clientInfo);
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