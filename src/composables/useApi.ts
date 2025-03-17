import { ref, type Ref } from 'vue';

type ApiRequestOptions = {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: any;
};

type ApiResponse<T> = {
    data: Ref<T | null>;
    status: Ref<number | null>;
    isLoading: Ref<boolean>;
    isSuccess: Ref<boolean>;
    isError: Ref<boolean>;
    error: Ref<any>;
    execute: () => Promise<void>;
};

export function useApi<T>(options: ApiRequestOptions): ApiResponse<T> {
    const data = ref<T | null>(null) as Ref<T | null>;
    const status = ref<number | null>(null);
    const isLoading = ref(false);
    const isSuccess = ref(false);
    const isError = ref(false);
    const error = ref<any>(null);

    const execute = async () => {
        isLoading.value = true;
        isSuccess.value = false;
        isError.value = false;
        error.value = null;

        try {
            const response = await fetch(options.url, {
                method: options.method || 'GET',
                headers: options.headers || {},
                body: options.body ? JSON.stringify(options.body) : null,
            });

            status.value = response.status;

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            data.value = responseData;
            isSuccess.value = true;
        } catch (err) {
            isError.value = true;
            error.value = err;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        data,
        status,
        isLoading,
        isSuccess,
        isError,
        error,
        execute,
    };
}