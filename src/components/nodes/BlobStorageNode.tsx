// src/components/nodes/BlobStorageNode.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import Modal from '../common/Modal';

interface BlobStorageNodeProps extends NodeProps {
  data: {
    label: string;
    inputData: any;
    executeChain: boolean;
    onExecutionComplete: () => void;
  };
}

const BlobStorageNode: React.FC<BlobStorageNodeProps> = ({ data }) => {
  const [storedObjects, setStoredObjects] = useState<any[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedObject, setSelectedObject] = useState<any | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const maxDisplayCount = 5; // Maximum number of object IDs to display

  const storeObject = useCallback(() => {
    if (data.inputData) {
      setIsExecuting(true); // Start execution highlight
      const newObject = {
        id: storedObjects.length + 1,
        data: data.inputData,
      };
      setStoredObjects((prevObjects) => [...prevObjects, newObject]);
      console.log('Stored object:', newObject);
      setTimeout(() => {
        setIsExecuting(false); // Stop execution highlight after storing
        data.onExecutionComplete();
      }, 1000); // 1-second delay for visual effect
    }
  }, [data.onExecutionComplete]);

  useEffect(() => {
    if (data.executeChain && data.inputData) {
      storeObject(); // Store the object when input data is received
    }
  }, [data.executeChain]);

  const openModal = (object: any) => {
    setSelectedObject(object);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedObject(null);
  };

  return (
    <div
      style={{
        padding: 10,
        border: `2px solid ${isExecuting ? '#007bff' : '#ff9800'}`,
        borderRadius: 5,
        width: 250,
        backgroundColor: isExecuting ? '#e7f1ff' : '#fff3e0',
        transition: 'background-color 0.3s ease',
      }}
    >
      <strong>{data.label}</strong>
      <div
        style={{
          marginTop: 10,
          maxHeight: 100, // Set a fixed height for scrollable area
          overflowY: 'auto', // Enable vertical scrolling
        }}
      >
        {storedObjects.slice(0, maxDisplayCount).map((obj) => (
          <div
            key={obj.id}
            onClick={() => openModal(obj)}
            style={{
              cursor: 'pointer',
              backgroundColor: '#ffe0b2',
              padding: '5px',
              margin: '2px 0',
              borderRadius: '3px',
            }}
          >
            {
              obj.data['id'] != null ? 
              obj.data['id'] :
              <p>Object {obj.id}</p>
            }
          </div>
        ))}
        {storedObjects.length > maxDisplayCount && (
          <div style={{ fontStyle: 'italic' }}>
            + {storedObjects.length - maxDisplayCount} more...
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h3>Object Details</h3>
        {selectedObject ? (
          <div>
            <pre>{JSON.stringify(selectedObject.data, null, 2)}</pre>
          </div>
        ) : (
          <p>No object selected.</p>
        )}
      </Modal>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default BlobStorageNode;
