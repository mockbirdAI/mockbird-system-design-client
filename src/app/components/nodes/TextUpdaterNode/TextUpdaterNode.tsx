// components/nodes/TextUpdaterNode.tsx

import React, { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';

interface TextUpdaterNodeProps {
  data: {
    label: string;
  };
}

const handleStyle = { left: 10 };

const TextUpdaterNode: React.FC<TextUpdaterNodeProps> = ({ data }) => {
  const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    console.log(evt.target.value);
  }, []);

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div>
        <label htmlFor="text">Text:</label>
        <input id="text" name="text" onChange={onChange} className="nodrag" />
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle type="source" position={Position.Bottom} id="b" style={handleStyle} />
    </>
  );
};

export default TextUpdaterNode;
