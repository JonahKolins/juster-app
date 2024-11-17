import React from "react";
import {Claim} from "../classes/claim/Claim";

export interface IClaimInfoContext {
    manager: Claim;
}

// обертка для компонента, который находится внутри Обращения
export function withClaimInfoHOC<T extends IClaimInfoContext>(component: React.ComponentType<T>): React.FunctionComponent<Omit<T, keyof IClaimInfoContext>> {
    const claimManager = new Claim();
    return (props: T) => {
        return React.createElement<T>(component, {...props, manager: claimManager });
    }
}