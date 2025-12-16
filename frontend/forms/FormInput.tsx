import React from "react";
import {
    FieldError,
    FieldValues,
    RegisterOptions,
    UseFormRegister,
    Path,
} from "react-hook-form";

interface FormInputProps<T extends FieldValues> {
    label?: string;
    name: Path<T>;
    type?: string;
    placeholder?: string;
    register: UseFormRegister<T>;
    rules?: RegisterOptions<T>;
    error?: FieldError;
    className?: string;
}

const FormInput = <T extends FieldValues>({
    label,
    name,
    type = "text",
    placeholder = "",
    register,
    rules = {},
    error,
    className = "",
}: FormInputProps<T>) => {
    return (
        <div className="mb-4">
            {label && (
                <label className="block mb-1 text-gray-700 font-medium">{label}</label>
            )}

            <input
                type={type}
                placeholder={placeholder}
                {...register(name, rules)}
                className={`w-full bg-input px-5 text-white h-[45px] rounded-lg focus:outline-none ${className}`}
            />

            {error && <p className="mt-1 text-sm text-error">{error.message}</p>}
        </div>
    );
};

export default FormInput;
