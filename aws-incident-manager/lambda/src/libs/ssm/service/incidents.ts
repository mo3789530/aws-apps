import {
  SSMIncidentsClient,
  CreateReplicationSetCommand,
  StartIncidentCommand,
  CreateResponsePlanCommandOutput,
  StartIncidentCommandOutput,
  CreateResponsePlanCommand,
} from "@aws-sdk/client-ssm-incidents";
import {
  CreateResponsePlanCommandDto,
  StartIncidentCommandDto,
} from "../model/incidentManger";

export class SSMIncidents {
  private region: string;
  private client: SSMIncidentsClient;

  constructor(region: string) {
    this.region = region;
    this.client = new SSMIncidentsClient({ region: this.region });
  }

  public async createReplication(token: string) {
    const command = new CreateReplicationSetCommand({
      clientToken: token,
      regions: undefined,
    });
    try {
      const response: CreateResponsePlanCommandOutput = await this.client.send(
        command
      );
      return response.arn;
    } catch (error) {
      throw error;
    }
  }

  public async createResponsePlan(
    token: string,
    command: CreateResponsePlanCommandDto
  ) {
    const cmd = new CreateResponsePlanCommand({
      clientToken: token,
      displayName: command.DisplayName,
      name: command.Name,
      tags: command.Tags,
      engagements: command.Engagements,
      incidentTemplate: {
        impact: command.IncidentTemplate.Impact,
        title: command.IncidentTemplate.Title,
      },
    });
    const response: CreateResponsePlanCommandOutput = await this.client.send(
      cmd
    );
    return response.arn;
  }

  public async startIncident(
    token: string,
    startCommand: StartIncidentCommandDto
  ) {
    const command = new StartIncidentCommand({
      clientToken: token,
      responsePlanArn: startCommand.ResponsePlanArn,
      title: startCommand.Title,
      impact: startCommand.Impact,
      triggerDetails: {
        source: startCommand.Trigger.Source,
        rawData: startCommand.Trigger.RawData,
        triggerArn: startCommand.Trigger.TriggerArn,
        timestamp: startCommand.Trigger.Timestamp,
      },
    });
    const response: StartIncidentCommandOutput = await this.client.send(
      command
    );
    return response.incidentRecordArn;
  }
}
