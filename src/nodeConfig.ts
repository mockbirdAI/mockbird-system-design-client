// src/nodeConfig.ts

import { StartNode, CodeExecutionNode, SNSNode, BlobStorageNode, LLMNode, DataNode } from '@/components/nodes';
import { NodeTypes } from '@xyflow/react';

const nodeTypes: NodeTypes = {
  startNode: StartNode,
  codeExecutionNode: CodeExecutionNode,
  snsNode: SNSNode,
  blobStorageNode: BlobStorageNode,
  llmNode: LLMNode,
  dataNode: DataNode
};

export default nodeTypes;
