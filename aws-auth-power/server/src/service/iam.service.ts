import {
  IAMClient, CreateGroupCommand, ListGroupsCommand,
  GetGroupCommand, GetGroupCommandInput, AddUserToGroupCommand,
  RemoveUserFromGroupCommand, CreateUserCommand, GetUserCommand
} from "@aws-sdk/client-iam";

import { Logger } from '../utils/logger';

export class IamService {

  private logger = new Logger();

  iam = (): IAMClient => {
    return new IAMClient({});
  }

  createIamUserGroup = async (groupName: string) => {
    const client: IAMClient = this.iam();
    const command = new CreateGroupCommand({ GroupName: groupName });

    try {
      const response = await client.send(command);
      return {
        arn: response.Group?.Arn,
        groupName: response.Group?.GroupName
      }
    } catch (e) {
      this.logger.error(String(e));
    }
  }

  listGroup = async () => {
    const client: IAMClient = this.iam();

    let input = {}
    const allGroups = [];

    let i = 0;

    while (i < 10) {
      const command = new ListGroupsCommand(input);
      const response = await client.send(command);
      if (response.Groups) {
        allGroups.push(...response.Groups)
      }
      if (!response.IsTruncated) {
        break;
      }

      input = {
        Marker: response.Marker
      }

      i++;
    }
    return allGroups;
  }


  getGroup = async (groupName: string) => {
    const client = this.iam();

    const input: GetGroupCommandInput = {
      GroupName: groupName,
    };

    let i = 0;

    const allGroups = [];
    const allUsers = [];
    try {
      while (i < 10) {
        const command = new GetGroupCommand(input);
        const response = await client.send(command);
        if (response.Group && response.Users) {
          allGroups.push(response.Group);
          allUsers.push(response.Users);
        }
        if (!response.IsTruncated) {
          break;
        }

        input.Marker = response.Marker;
        i++;
      }
    } catch (e) {
      this.logger.error(String(e));
    }
  }


  findGroup = async (groupName: string) => {
    const client = this.iam();

    const input: GetGroupCommandInput = {
      GroupName: groupName,
    };
    try {
      const command = new GetGroupCommand(input);
      const response = await client.send(command);
      return {
        "groupName": response.Group?.GroupName,
        "groupId": response.Group?.GroupId,
      }
    } catch (e) {
      this.logger.error(String(e));
    }

  }


  addUserToGroup = async (groupName: string, userName: string) => {
    const client = this.iam();
    try {
      const command = new AddUserToGroupCommand({
        GroupName: groupName,
        UserName: userName
      });
      await client.send(command)
    } catch (e) {
      this.logger.error(String(e));
    }
  }


  removeUserFromGroup = async (groupName: string, userName: string) => {
    const client = this.iam();

    try {
      const command = new RemoveUserFromGroupCommand({
        GroupName: groupName,
        UserName: userName
      });
      await client.send(command);
    } catch (e) {
      this.logger.error(String(e));
    }

  }

  createIamUser = async (username: string) => {
    const client = this.iam();
    const createUserCommand = new CreateUserCommand({ UserName: username });

    try {
      const results = await client.send(createUserCommand);
      console.log("Success", results);
    } catch (e) {
      this.logger.error(String(e));
    }
  }

  findUser = async (username: string) => {
    const client = this.iam();

    const getUserCommand = new GetUserCommand({ UserName: username });

    try {
      const result = await client.send(getUserCommand);
      return {
        "userId": result.User?.UserId,
        "userName": result.User?.UserId,
        "arn": result.User?.Arn
      }
    } catch (e) {
      this.logger.error(String(e));
    }
  }

}