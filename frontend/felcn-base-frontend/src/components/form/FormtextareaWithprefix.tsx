'use client';

import React, {
  TextareaHTMLAttributes,
  ReactNode,
} from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Icono } from '../Icono';

interface TextareaWithPrefixProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'prefix'> {
  prefix?: ReactNode;
  icon?: string;

  containerClassName?: string;
  prefixClassName?: string;
  textareaClassName?: string;

  register?: UseFormRegister<any>;
  error?: string;
}

const TextareaWithPrefix: React.FC<TextareaWithPrefixProps> = ({
  prefix,
  icon,
  containerClassName = '',
  prefixClassName = '',
  textareaClassName = '',
  register,
  error,
  name,
  ...textareaProps
}) => {
  const showLeftBox = Boolean(prefix || icon);

  return (
    <div className={`mb-5 ${containerClassName}`}>
      <div className="flex flex-col">

        <div className="flex">

          {/* LEFT BOX */}
          {showLeftBox && (
            <div
              className={`bg-[#eee] flex items-center gap-2
                ltr:rounded-l-md rtl:rounded-r-md 
                px-3 font-semibold border 
                ltr:border-r-0 rtl:border-l-0 
                border-white-light 
                dark:border-[#17263c] 
                dark:bg-[#1b2e4b]
                ${prefixClassName}
                ${error ? 'border-danger' : ''}`}
            >
              {icon && (
                <Icono fontSize="large">
                  {icon}
                </Icono>
              )}

              {prefix && (
                <span>{prefix}</span>
              )}
            </div>
          )}

          {/* TEXTAREA */}
          <textarea
            {...(register && name ? register(name) : {})}
            {...textareaProps}
            name={name}
            className={`form-textarea flex-1
              ${showLeftBox
                ? 'ltr:rounded-l-none rtl:rounded-r-none'
                : ''}
              ${textareaClassName}
              ${error ? 'border-danger focus:border-danger' : ''}`}
          />

        </div>

        {/* ERROR */}
        {error && (
          <span className="text-danger text-sm mt-1">
            {error}
          </span>
        )}

      </div>
    </div>
  );
};

export default TextareaWithPrefix;
