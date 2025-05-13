interface Flow {
  flowId: number;
  tenantId: string;
  flowType: string;
  flowName: string;
  channels: any[];
  createdDate: string;
  lastModifiedDate: string;
  transferable: boolean;
  definitionId: number;
  definitionVersion: string;
  deployedVersion: string;
}

interface FlowHandler {
  handlerId: string;
  handlerName: string;
  initialCommandId: string;
  definitionVersion: string;
  lastModifiedDate: string;
  errorCount: number;
  referencedHandlers: FlowHandler[];
  commands: Record<string, any>;
}

interface FlowCommand {
  id: string;
  name: string;
  type: string;
  positionX: number;
  positionY: number;
  errors: FlowValidationError[];
  fields: Record<string, any>;
  edges?: Record<string, any>;
}

interface FlowValidationError {
  field: string;
  errorMessage: string;
}

interface DefaultBody {
  status: string;
  message: string;
  data: any;
}

export type {
  Flow,
  FlowHandler,
  FlowCommand,
  FlowValidationError,
  DefaultBody,
};
