// nodeConfig.ts

import InputNode from "./components/nodes/InputNode/InputNode";
import DefaultNode from "./components/nodes/DefaultNode/DefaultNode";
import OutputNode from "./components/nodes/OutputNode/OutputNode";
import TextUpdaterNode from "./components/nodes/TextUpdaterNode/TextUpdaterNode"
import CodeExecutionNode from "./components/nodes/CodeExecutionNode/CodeExecutionNode";
import StartNode from "./components/nodes/StartNode/StartNode";
import DatabaseNode from "./components/nodes/DatabaseNode/DatabaseNode";
import CacheNode from "./components/nodes/CacheNode/CacheNode";
import APIGatewayNode from "./components/nodes/APIGatewayNode/APIGatewayNode";
import SNSNode from "./components/nodes/SNSNode/SNSNode";

export interface NodeType {
  type: string;
  label: string;
  component: React.ComponentType<any>;
}

const nodeTypes: NodeType[] = [
  {
    type: 'input',
    label: 'Input Node',
    component: InputNode,
  },
  {
    type: 'default',
    label: 'Default Node',
    component: DefaultNode,
  },
  {
    type: 'output',
    label: 'Output Node',
    component: OutputNode,
  },
  {
    type: 'textUpdaterNode',
    label: 'Text Updater Node',
    component: TextUpdaterNode,
  },
  {
    type: 'codeExecutionNode',
    label: 'Code Execution Node',
    component: CodeExecutionNode,
  },
  {
    type: 'startNode',
    label: "Start Node",
    component: StartNode,
  },
  {
    type: 'databaseNode',
    label: "Database Node",
    component: DatabaseNode,
  },
  {
    type: 'cacheNode',
    label: "Cache Node",
    component: CacheNode,
  },
  {
    type: 'API Gateway Node',
    label: "API Gateway Node",
    component: APIGatewayNode,
  },
  {
    type: 'snsNode',
    label: "SNS Node",
    component: SNSNode,
  },
];

export default nodeTypes;
