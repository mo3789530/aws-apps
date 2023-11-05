import {
  IAMClient, CreateGroupCommand, ListGroupsCommand,
  GetGroupCommand, GetGroupCommandInput, AddUserToGroupCommand,
  RemoveUserFromGroupCommand
} from "@aws-sdk/client-iam";

const iam = (): IAMClient => {
  return new IAMClient({});
}

const createIamUserGroup = async (groupName: string) => {
  const client: IAMClient = iam();
  const command = new CreateGroupCommand({ GroupName: groupName });

  try {
    const response = await client.send(command);
    return {
      arn: response.Group?.Arn,
      groupName: response.Group?.GroupName
    }
  } catch (e) {
    console.error(e);
  }
}

const listGroup = async () => {
  const client: IAMClient = iam();

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
}


const getGroup = async (groupName: string) => {
  const client = iam();

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
  } catch (error) {
    console.error(error);
    throw error;
  }
}


const addUserToGroup = async (groupName: string, userName: string) => {
  const client = iam();

  try {
    const command = new AddUserToGroupCommand({
      GroupName: groupName,
      UserName: userName
    });
    await client.send(command)
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const removeUserFromGroup = async (groupName: string, userName: string) => {
  const client = iam();

  try {
    const command = new RemoveUserFromGroupCommand({
      GroupName: groupName,
      UserName: userName
    });
    await client.send(command);
  } catch (error) {
    console.error(error);
    throw error;
  }

}


// const listGroupUsers = async (groupName: string) => {

// }