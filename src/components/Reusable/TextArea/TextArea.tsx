/* eslint-disable @typescript-eslint/no-explicit-any */

import { FieldError, FieldErrorsImpl, Merge, UseFormRegisterReturn } from "react-hook-form";

type TextAreaProps = {
    label: string;
    name: string;
    placeholder: string;
    rows: number;
    register: UseFormRegisterReturn;
    errorMessage?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
    defaultValue? : any;
    isMandatory? : boolean;
};

const TextArea = ({
    label,
    name,
    placeholder,
    rows,
    register,
    errorMessage,
    defaultValue,
    isMandatory,
}: TextAreaProps) => {
    return (
        <div className="space-y-2 text-sm">
            <label htmlFor={name} className="text-zinc-700 dark:text-zinc-300 font-medium flex items-center gap-1">
                {label} {isMandatory ? <span className="text-red-500 text-lg">*</span> : ''}
            </label>
            <textarea
                id={name}
                placeholder={placeholder}
                rows={rows}
                defaultValue={defaultValue}
                {...register}
                className="flex w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus-visible:outline-none dark:border-zinc-700"
            />
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage as string}</p>}
        </div>
    );
};

export default TextArea;
