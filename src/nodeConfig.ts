// src/nodeConfig.ts

import { StartNode, CodeExecutionNode, SNSNode } from '@/components/nodes';
import { NodeTypes } from '@xyflow/react';

const nodeTypes: NodeTypes = {
  startNode: StartNode,
  codeExecutionNode: CodeExecutionNode,
  snsNode: SNSNode,
};

export default nodeTypes;
