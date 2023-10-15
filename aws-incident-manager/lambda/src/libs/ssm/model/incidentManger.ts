export enum Impact {
  Critical,
  High,
  Medium,
  Low,
  No,
}

export type TriggerDto = {
  RawData: string | undefined;
  Source: string | undefined;
  Timestamp: Date | undefined;
  TriggerArn: string | undefined;
};

export type StartIncidentCommandDto = {
  Impact: Impact;
  ResponsePlanArn: string;
  Title: string;
  Trigger: TriggerDto;
};

export type IncidentTemplate = {
  Impact: Impact;
  Title: string | undefined;
  InsidentTags: Record<string, string>;
  Summary: string | undefined;
  NotificationTargets: string[] | undefined;
};

export type CreateResponsePlanCommandDto = {
  DisplayName: string;
  Name: string;
  Tags: Record<string, string>;
  Engagements: string[]; //The contacts and escalation plans that the response plan engages during an incident.
  IncidentTemplate: IncidentTemplate;
};

export enum AcceptType {
  DELIVERED = "DELIVERED",
  READ = "READ",
}

export type AcceptPageCommandDto = {
  AcceptCode: string | undefined;
  AcceptType: string | undefined | AcceptType;
  PageId: string | undefined;
  ContactChannelId: string | undefined;
};

export type ActivateContactChannelCommandDto = {
  ActivationCode: string | undefined;
  ContactChannelId: string | undefined;
};

export enum ChannelType {
  SSM = "SSM",
  VOICE = "VOICE",
  EMAIL = "EMAIL",
}

export type CreateContactChannelCommandDto = {
  ContactId: string | undefined; // The Amazon Resource Name (ARN) of the contact you are adding the contact channel to.
  Name: string | undefined;
  Type: ChannelType | undefined;
  DeliveryAddress: undefined | string;
  DeferActivation: boolean | undefined;
};

export enum ContactType {
  ESCALATION = "ESCALATION",
  PERSONAL = "PERSONAL",
}

export type CreateContactCommandDto = {
  Alias: string | undefined;
  DisplayName: string;
  // tags:
  Type: ContactType | undefined;
  Plan: PlanDto;
};

export type PlanDto = {
  Stages: StageDto[];
};

export type StageDto = {
  DurationInMinutes: number;
  Targets: TargetDto[];
};

export type TargetDto = {
  ChannelTargetInfo: ChannelTargetInfoDto;
  ContactTargetInfo: ContactTargetInfoDto;
};

export type ChannelTargetInfoDto = {
  ContactChannelId: string | undefined; //The Amazon Resource Name (ARN) of the contact channel.
  RetryIntervalInMinutes?: number | undefined;
};

export type ContactTargetInfoDto = {
  /**
   * <p>The Amazon Resource Name (ARN) of the contact.</p>
   */
  ContactId?: string;

  /**
   * <p>A Boolean value determining if the contact's acknowledgement stops the progress of
   *          stages in the plan.</p>
   */
  IsEssential: boolean | undefined;
};

export type UpdateContactsChannelDto = {
  ContactChannelId: string;
  DeliveryAddress?: string;
  Name?: string;
};

export type UpdateContactDto = {
  ContactId: string;
  DisplayName: string;
  Plan: PlanDto;
};

export type StartEngagementDto = {
  ContactId: string;
  Contact: string;
  IncidentId?: string;
  Subject: string | undefined;
  Sender: string | undefined;
};

export type StopEngagementDto = {
  EngagementId: string;
  Reason?: string;
};
