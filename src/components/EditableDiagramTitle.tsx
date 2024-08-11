// src/components/EditableField.tsx (Client Component)

'use client';

import { useState } from 'react';

interface EditableDiagramTitleProps {
  diagramId: string;
  initialValue: string;
  field: string;
}

export default function EditableDiagramTitle({ diagramId, initialValue, field }: EditableDiagramTitleProps) {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  const handleValueChange = async () => {
    setIsEditing(false);
    // API call to update the specified field in the database
    await fetch(`/api/diagrams/${diagramId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ [field]: value }),
    });
  };

  return (
    <div className="flex items-center">
      {isEditing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleValueChange}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleValueChange();
            }
          }}
          className="text-2xl font-semibold border-b-2 border-blue-500 focus:outline-none"
          autoFocus
        />
      ) : (
        <h1
          className="text-2xl font-semibold cursor-pointer hover:underline"
          onClick={() => setIsEditing(true)}
        >
          {value}
        </h1>
      )}
    </div>
  );
}
