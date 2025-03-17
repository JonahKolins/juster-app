// итерфейс стандартного ответа
export interface IResponse<TData> {
    success: boolean;
    data: TData;
}