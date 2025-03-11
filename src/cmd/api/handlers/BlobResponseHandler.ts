import IResponseHandler from "./IResponseHandler";

export class BlobResponseHandler<TData> implements IResponseHandler<TData> {
    public async handleResponse(response: Response) {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get('Content-Type');
        
        // если ответ в формате JSON, парсим его как обычно
        if (contentType && contentType.includes('application/json')) {
            return await response.json() as TData;
        }
        
        // для бинарных данных создаем специальный ответ
        const blob = await response.blob();
        const fileName = this.getFileNameFromHeaders(response.headers) || 'document';
        
        return {
            status: 'success',
            documents: [{
                id: '1',
                name: fileName,
                type: blob.type,
                size: blob.size,
                uploadDate: Date.now(),
                contentUrl: URL.createObjectURL(blob)
            }]
        } as TData;
    }

    private getFileNameFromHeaders(headers: Headers): string | null {
        const contentDisposition = headers.get('Content-Disposition');
        if (!contentDisposition) return null;
        
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
        if (matches && matches[1]) {
            return matches[1].replace(/['"]/g, '');
        }
        return null;
    }
}