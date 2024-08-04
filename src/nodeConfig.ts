// src/nodeConfig.ts

import { StartNode, CodeExecutionNode, SNSNode, BlobStorageNode } from '@/components/nodes';
import { NodeTypes } from '@xyflow/react';

const nodeTypes: NodeTypes = {
  startNode: StartNode,
  codeExecutionNode: CodeExecutionNode,
  snsNode: SNSNode,
  blobStorageNode: BlobStorageNode, // Add the Blob Storage Node
};

export default nodeTypes;
