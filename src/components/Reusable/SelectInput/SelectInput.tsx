/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { UseFormRegisterReturn, FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

type SelectInputProps = {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  register: UseFormRegisterReturn;
  errorMessage?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  defaultValue?: string;
  isMandatory?: boolean;
};

const SelectInput = ({ label, name, options, register, errorMessage, defaultValue, isMandatory }: SelectInputProps) => {
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue || "");

  useEffect(() => {
    if (defaultValue) {
      setSelectedValue(defaultValue);
    }
  }, [defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(e.target.value);
    register.onChange(e);
  };

  return (
    <div className="space-y-2 text-sm">
      <label htmlFor={name} className="text-zinc-700 dark:text-zinc-300 font-medium flex items-center gap-1">
        {label} {isMandatory ? <span className="text-red-500 text-lg">*</span> : ''}
      </label>
      <select
        id={name}
        value={selectedValue}
        onChange={handleChange}
        onBlur={register.onBlur}
        name={register.name}
        ref={register.ref}
        className="flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus-visible:outline-none dark:border-zinc-700"
      >
        <option value="" disabled selected>
          Select {label}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage as string}</p>}
    </div>
  );
};

export default SelectInput;
