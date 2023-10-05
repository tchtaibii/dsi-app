import React from 'react';

interface InputTextProps {
  mwidth?: string;
  mheight?: string;
  mbackground?: string;
  placeholder : string;
  value: string;
  border? : string;
}

const InputText = ({
  mwidth = '45.5rem',
  mheight = '4.625rem',
  mbackground = '#2A2D3E',
  placeholder,
  value,
  border,
}: InputTextProps) => (
  <div
    style={{
      width: mwidth,
      height: mheight,
      borderRadius: '1.875rem',
      background: mbackground,
      border : border,
    }}
    className='InputText'
  >
    {/* Add your input elements here if needed */}
  </div>
);

export default InputText;
