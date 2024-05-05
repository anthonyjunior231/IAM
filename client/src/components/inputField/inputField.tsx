// import relevant modules
import React, { useState, useEffect, forwardRef } from "react";

//style imports
import { InputContainer } from "./inputField";

//import relevant icons
import eye_hide_icon from "../../assets/images/HideEye.svg";
import eye_icon from "../../assets/images/Eye.svg";

import { isStrongPassword, isValidEmail } from "../../utils/validate";

// input field component
type Ref = HTMLInputElement;
type InputFieldProps = {
  value: string;
  type?: string;
  name?: string;
  id?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  shouldValidate?: boolean;
  minLength?: number;

  onValidityChange?: (isValid: boolean) => void;
  inputAttrs?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  className?: {
    inputContainer?: string;
    label?: string;
  };
  style?: React.CSSProperties;
};

const InputField = forwardRef<Ref, InputFieldProps>(function InputField(
  {
    type,
    name,
    value,
    onChange,
    label,
    placeholder,
    shouldValidate,
    minLength,
    onValidityChange,
    inputAttrs = {},
    className = {},
    style = {},
  },
  forwardedRef
) {
  // initial use state values
  const [error, setError] = useState("");
  const [revealPassword, setRevealPassword] = useState(false);

  // use effect
  useEffect(() => {
    if (shouldValidate) {
      //when type is email
      if (type === "email") {
        if (value.trim().length > 0 && !isValidEmail(value.trim())) {
          setError("Invalid email address. Please enter a valid email.");
        } else {
          setError("");
        }
      }

      if (type === "website") {
        if (
          value.trim().length > 0 &&
          !/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(
            value.trim()
          )
        ) {
          setError("Invalid website name. Please enter a valid domain.");
        } else {
          setError("");
        }
      }

      // when type is password
      if (type === "password") {
        if (value.trim().length > 0 && !isStrongPassword(value.trim())) {
          setError(
            "Password must contain between 12 and 16 characters, including at least one lowercase letter, one uppercase letter, one number, and one special character !,@,#,$,%,^,&,*"
          );
        } else {
          setError("");
        }
      }

      // check when there is a password and repeat password field
      if (name === "repeatNewPassword") {
        if (
          value.trim().length > 0 &&
          value.trim() !==
            (document.getElementById("newPassword")! as HTMLInputElement).value
        ) {
          setError("Passwords do not match. Please try again.");
        } else {
          setError("");
        }
      }

      // when type is name
      if (minLength !== undefined) {
        if (value.trim().length > 0 && value.trim().length < 3) {
          setError(
            `${label} is too short. Please enter at least 3 characters.`
          );
        } else {
          setError("");
        }
      }
    }
  }, [minLength, shouldValidate, type, value, name]);

  useEffect(() => {
    if (shouldValidate) {
      const isValid = !error === true;
      onValidityChange?.(isValid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldValidate, error]);

  // Building block;
  return (
    <InputContainer>
      <div className={`input__container ${style}`}>
        <label
          htmlFor={name}
          className={`input__container__label ${className.label}`}
        >
          {label}
        </label>
        <div className={`input__container__div ${className.inputContainer}`}>
          <input
            className={`input__container__div__input ${
              error ? "border-danger" : ""
            }`}
            type={
              type === "password"
                ? revealPassword
                  ? "text"
                  : "password"
                : type
            }
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            ref={forwardedRef}
            {...inputAttrs}
          />
          {type === "password" && (
            <img
              onClick={() => setRevealPassword(!revealPassword)}
              src={revealPassword ? eye_icon : eye_hide_icon}
              alt="eye icon"
              className="input__container__div__input__icon"
            />
          )}
        </div>
        <p className="input__container__div__error">{error}</p>
      </div>
    </InputContainer>
  );
});

export default InputField;