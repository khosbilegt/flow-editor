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
  deployedVersion: string;
}

export type { Flow };
