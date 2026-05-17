import React from 'react';
import './BrainButton.css';

export default function BrainButton({ children, ...rest }) {
  return (
    <button className="brain-button" {...rest}>
      {children}
    </button>
  );
}