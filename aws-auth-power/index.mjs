import {
  AttachRolePolicyCommand,
  IAMClient,
  ListRolesCommand,
} from "@aws-sdk/client-iam";

const iam = new IAMClient({ region: "us-east-1" });
const policyArn = process.env.POLICY_ARN;

export const handler = async (event) => {
  try {
    await attachPolicy(event.role, policyArn);
  } catch (e) {
    console.log(e);
    return {
      statusCode: 400,
      body: JSON.stringify(e),
    };
  }
};

const getRole = async (role) => {
  const params = new ListRolesCommand({
    PathPrefix: role,
  });
  return await iam.send(params);
};

const setCondition = async (policy, condition) => {
  const params = new PutRolePolicyCommand({
    PolicyName: policy,
    PolicyDocument: condition,
  });

  const cmd = new PutRolePolicyCommand(params);
  await iam.send(cmd);
};

const attachPolicy = async (role, policy) => {
  const params = new AttachRolePolicyCommand({
    RoleName: role,
    PolicyArn: policy,
  });

  const cmd = new AttachRolePolicyCommand(params);
  await iam.send(cmd);
};
