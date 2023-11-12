import yaml
import boto3
from botocore.config import Config
import os


def get_client(key, env):
    config = Config(
        region_name=env
    )
    return boto3.client(
        key,
        config=config,
        aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
        aws_session_token=os.environ.get("AWS_SESSION_TOKEN")
    )


def config_open(filename: str) -> dict:
    try:
        with open(filename) as f:
            return yaml.safe_load(f)
    except Exception as e:
        print(e)
        print('Error opening config file')
        exit(-1)


def is_exist_ssm(name: str) -> bool:
    client = get_client('ssm')
    try:
        # Retrieve the parameter value
        response = client.get_parameter(Name=name, WithDecryption=True)
        parameter_value = response['Parameter']['Value']
        return True
    except client.exceptions.ParameterNotFound:
        print(f"Parameter '{name}' not found.")
        return False


def register_ssm(name: str, value: str | [], description: str, parameter_type: str, tags: []):
    client = get_client('ssm')
    try:
        response = client.put_parameter(
            Name=name,
            Value=value,
            Description=description,
            Type=parameter_type,
            Overwrite=True,  # Set to True if you want to update the parameter if it already exists
            Tags=tags
        )
    except Exception as e:
        print(e)

def is_exist_secretsmanager(id: str) -> bool:
    client = get_client('secretsmanager')
    try:
        response = client.get_secret_value(SecretId=id)
        return True
    except:
        return False


def tags(app) -> []:
    return [
        {"SID": app.sid},
        {"Environment": app.env}
    ]


def register_secretsmanager(name: str, secret: dict, tags: []):
    client = get_client('secretsmanager')
    try:
        client.create_secret(
            name=name,
            SecretString=str(secret),
            Tags=tags
        )
        print("success to register to secret manager")
    except:
        print("error")


def resource_name_format(app: dict, name: str) -> str:
    return f'{app.get("env")}-{app.get("sid")}-{name}'


def main():
    yaml = config_open('application.yaml')
    print(yaml.get('app'))
    app = yaml.get('app')
    print(resource_name_format(app, "test"))


if __name__ == '__main__':
    main()
