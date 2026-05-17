import React from 'react';
import './BrainInput.css';

export default function BrainInput({ label, ...rest }) {
  return (
    <div className="brain-input-container">
      {label && <label className="brain-input-label">{label}</label>}
      <input 
        className="brain-input" 
        {...rest} 
      />
    </div>
  );
}