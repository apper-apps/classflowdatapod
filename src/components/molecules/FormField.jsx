import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";

const FormField = ({ 
  label, 
  error, 
  required, 
  type = "input", 
  options = [],
  children,
  className,
  ...props 
}) => {
  const renderField = () => {
    if (type === "select") {
      return (
        <Select error={error} {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          {children}
        </Select>
      );
    }
    
    return <Input error={error} {...props} />;
  };

  return (
    <div className={className}>
      {label && (
        <Label required={required} htmlFor={props.id}>
          {label}
        </Label>
      )}
      {renderField()}
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default FormField;