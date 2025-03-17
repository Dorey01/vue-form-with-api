import { reactive, computed, watch, type ComputedRef } from 'vue';

type ValidationRule = (value: any) => string | null;
type ValidationRules = Record<string, ValidationRule[]>;
type ErrorsState = Record<string, string[] | null>;
type DirtyState = Record<string, boolean>;

export function useFormValidation(
    rules: ValidationRules,
    formValues: Record<string, any>
) {
    const errors = reactive<ErrorsState>({});
    const dirty = reactive<DirtyState>({});

    // Инициализация состояний
    Object.keys(rules).forEach((field) => {
        errors[field] = null;
        dirty[field] = false;
    });

    // Валидация конкретного поля
    const validateField = (field: string) => {
        const value = formValues[field];
        const fieldRules = rules[field];
        if (!fieldRules) return;

        const fieldErrors: string[] = [];
        for (const rule of fieldRules) {
            const error = rule(value);
            if (error) fieldErrors.push(error);
        }
        errors[field] = fieldErrors.length ? fieldErrors : null;
    };

    // Валидация всех полей
    const validateAll = (): boolean => {
        Object.keys(rules).forEach((field) => validateField(field));
        return !Object.values(errors).some((error) => error !== null);
    };

    // Автоматическая валидация при изменении значений
    watch(
        () => ({ ...formValues }),
        (newValues, oldValues) => {
            Object.keys(newValues).forEach((field) => {
                if (newValues[field] !== oldValues[field]) validateField(field);
            });
        },
        { deep: true }
    );

    // Вычисляемое свойство валидности формы
    const isValid: ComputedRef<boolean> = computed(() => {
        return Object.keys(errors).every((field) => !errors[field]);
    });

    // Метод для отметки поля
    const touch = (field: string) => {
        dirty[field] = true;
    };

    return { errors, dirty, isValid, validateAll, touch };
}