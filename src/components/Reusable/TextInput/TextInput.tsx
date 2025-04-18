/* eslint-disable @typescript-eslint/no-explicit-any */

import { FieldError, FieldErrorsImpl, Merge, UseFormRegisterReturn } from "react-hook-form";

type TextInputProps = {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  register?: UseFormRegisterReturn;
  errorMessage?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: any;
  onKeyDown? : any;
  isMandatory?: boolean;
};

const TextInput = ({
  label,
  name,
  type,
  placeholder,
  register,
  errorMessage,
  value,
  onChange,
  defaultValue,
  onKeyDown,
  isMandatory,
}: TextInputProps) => {
  return (
    <div className="space-y-2 text-sm">
      <label htmlFor={name} className="text-zinc-700 dark:text-zinc-300 font-medium flex items-center gap-1">
        {label} {isMandatory ? <span className="text-red-500 text-lg">*</span> : ''}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register}
        value={value}
        onChange={onChange}
        defaultValue={defaultValue}
        onKeyDown={onKeyDown}
        className="flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus-visible:outline-none dark:border-zinc-700"
      />
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage as string}</p>}
    </div>
  );
};

export default TextInput;
