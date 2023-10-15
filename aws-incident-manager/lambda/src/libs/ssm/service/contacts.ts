import {
  AcceptPageCommand,
  AcceptPageCommandInput,
  AcceptPageCommandOutput,
  ActivateContactChannelCommand,
  ActivateContactChannelCommandOutput,
  CreateContactChannelCommand,
  CreateContactChannelCommandOutput,
  CreateContactCommand,
  CreateContactCommandOutput,
  SSMContactsClient,
  ChannelTargetInfo,
  ContactTargetInfo,
  Plan,
  Target,
  Stage,
  UpdateContactChannelCommand,
  UpdateContactCommand,
  SendActivationCodeCommand,
  StartEngagementCommand,
  StartEngagementCommandOutput,
  SendActivationCodeCommandOutput,
  UpdateContactChannelCommandOutput,
  StopEngagementCommand,
} from "@aws-sdk/client-ssm-contacts";
import {
  AcceptPageCommandDto,
  ActivateContactChannelCommandDto,
  CreateContactChannelCommandDto,
  CreateContactCommandDto,
  PlanDto,
  StartEngagementDto,
  StopEngagementDto,
  UpdateContactDto,
  UpdateContactsChannelDto,
} from "../model/incidentManger";

export class SSMContacts {
  private region: string;
  private client: SSMContactsClient;
  constructor(region: string) {
    this.region = region;
    this.client = new SSMContactsClient({ region: this.region });
  }

  public async acceptPage(acceptPageCommand: AcceptPageCommandDto) {
    const params: AcceptPageCommandInput = {
      AcceptCode: acceptPageCommand.AcceptCode,
      AcceptType: acceptPageCommand.AcceptType,
      PageId: acceptPageCommand.PageId,
      ContactChannelId: acceptPageCommand.ContactChannelId,
    };
    const cmd = new AcceptPageCommand(params);
    try {
      const data: AcceptPageCommandOutput = await this.client.send(cmd);
      return data.$metadata.httpStatusCode;
    } catch (err) {
      throw err;
    }
  }

  public async activateContactChannel(
    command: ActivateContactChannelCommandDto
  ) {
    const cmd = new ActivateContactChannelCommand({
      ActivationCode: command.ActivationCode,
      ContactChannelId: command.ContactChannelId,
    });
    const response: ActivateContactChannelCommandOutput =
      await this.client.send(cmd);
    return response.$metadata.httpStatusCode;
  }

  public async createContactChannel(command: CreateContactChannelCommandDto) {
    const cmd = new CreateContactChannelCommand({
      ContactId: command.ContactId,
      Name: command.Name,
      Type: command.Type,
      DeliveryAddress: { SimpleAddress: command.DeliveryAddress },
      DeferActivation: command.DeferActivation,
    });
    const response: CreateContactChannelCommandOutput = await this.client.send(
      cmd
    );
    return response.ContactChannelArn;
  }

  public async createContact(command: CreateContactCommandDto) {
    const cmd = new CreateContactCommand({
      Alias: command.Alias,
      DisplayName: command.DisplayName,
      Type: command.Type,
      Plan: this.toPlan(command.Plan),
    });

    const response: CreateContactCommandOutput = await this.client.send(cmd);
    return response.ContactArn;
  }

  public async UpdateContactChannel(command: UpdateContactsChannelDto) {
    const cmd = new UpdateContactChannelCommand({
      ContactChannelId: command.ContactChannelId,
      DeliveryAddress: { SimpleAddress: command.DeliveryAddress },
      Name: command.Name,
    });
    const response = await this.client.send(cmd);
    return response.$metadata.httpStatusCode;
  }

  public async UpdateContact(command: UpdateContactDto) {
    const cmd = new UpdateContactCommand({
      ContactId: command.ContactId,
      Plan: this.toPlan(command.Plan),
      DisplayName: command.DisplayName,
    });

    const response = await this.client.send(cmd);
    return response.$metadata.httpStatusCode;
  }

  public async StartActivationCode(channelId: string) {
    const response: SendActivationCodeCommandOutput = await this.client.send(
      new SendActivationCodeCommand({ ContactChannelId: channelId })
    );
    return response.$metadata.httpStatusCode;
  }

  public async StartEngagement(command: StartEngagementDto) {
    const cmd = new StartEngagementCommand({
      ContactId: command.ContactId,
      Content: command.Contact,
      Subject: command.Subject,
      Sender: command.Sender,
    });

    const response: StartEngagementCommandOutput = await this.client.send(cmd);
    return response.EngagementArn;
  }

  public async StopEngagement(command: StopEngagementDto) {
    const response = await this.client.send(
      new StopEngagementCommand({
        EngagementId: command.EngagementId,
        Reason: command.Reason,
      })
    );

    return response.$metadata.httpStatusCode;
  }

  private toPlan = (plan: PlanDto): Plan => {
    const stages: Stage[] = plan.Stages.map((s) => {
      const targets: Target[] = s.Targets.map((t) => {
        const chTargetInfo: ChannelTargetInfo = {
          ContactChannelId: t.ChannelTargetInfo.ContactChannelId,
          RetryIntervalInMinutes: t.ChannelTargetInfo.RetryIntervalInMinutes,
        };
        const contactTargetInfo: ContactTargetInfo = {
          ContactId: t.ContactTargetInfo.ContactId,
          IsEssential: t.ContactTargetInfo.IsEssential,
        };
        const target: Target = {
          ChannelTargetInfo: chTargetInfo,
          ContactTargetInfo: contactTargetInfo,
        };
        return target;
      });
      const stage: Stage = {
        DurationInMinutes: s.DurationInMinutes,
        Targets: targets,
      };
      return stage;
    });
    return { Stages: stages };
  };
}
