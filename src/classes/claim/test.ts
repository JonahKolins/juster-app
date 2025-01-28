
interface ClaimsResponse {
    claims: [
        {
            id: string;
            isDraft: boolean;
            name: string;
            reason: string;
            status: string;
            text: string;
            createdDate: number; // в миллисекундах - по UTC
            lastUpdate: number;  // в миллисекундах - по UTC
            company: {  // из апишки поиска по компаниям (можно ввести свой)
                id?: string;
                data: {
                    name: string; // полное имя
                    address?: {
                        value: string; // улица и дом
                        invalidity?: any;
                        unrestricted_value?: string;
                        data: {
                            postal_code: string;
                        }
                    };
                    inn: string;
                    kpp: string;
                    ogrn: string;
                    secondName?: string;
                };
                value: string; // имя
            };
            files?: any[]; // пока любой тип документа в массиве
            actions: [     // события и комментарии к жалобе
                {
                    type: 'action' | 'message';
                    id: string;
                    createdAt: number; // в миллисекундах - по UTC
                    text: string; // текст события или комментария (см. ниже)
                    actionType?: string; // тип события если type: 'action' (см. ниже)
                    status?: string; // статус (см. ниже)
                    user: {
                        firstName: string;
                        lastName?: string;
                        title?: string;   // "юрист", "администратор", ...
                    };
                },
                // { ... },
                // { ... }
            ]
        },
        // { ... },
        // { ... }
    ]
}


// === ACTIONS ===

// text - должен быть основан на шаблонах, например
`%user% поменял статус на %status% %date%`
`%user% создал обращение %date%`
// - чтобы парсить на клиенте
// либо формировать уже готовые фразы как-то на сервере

// Тип события - чтобы отслеживать работу по обращению в Активности
type actionType = 'claimCreated' | 'statusChanged' | 'addDocs' | '...'

// Статус события - нужен для визуального понимания что сейчас делается
type claimStatus = 'CREATED' | 'IN_PROCESS' | 'WAIT_FOR_ACTION' | 'RESOLVED' | 'DECLINED' | '...'