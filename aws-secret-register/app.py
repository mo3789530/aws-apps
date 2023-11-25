import yaml
import boto3
from botocore.config import Config
import os


def get_client(key: str, region: str = "ap-northeast-1"):
    return boto3.client(
        key,
        region_name=region,
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


def is_exist_ssm(name: str, app: dict) -> bool:
    client = get_client('ssm', app.get("region"))
    try:
        # Retrieve the parameter value
        response = client.get_parameter(Name=name, WithDecryption=True)
        parameter_value = response['Parameter']['Value']
        return True
    except client.exceptions.ParameterNotFound:
        return False
    except Exception as e:
        print(e)


def register_ssm(name: str, value: str | list, description: str, parameter_type: str, tags: [], app: dict):
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


def is_exist_secretsmanager(id: str, app: dict = {}) -> bool:
    client = get_client('secretsmanager', app.get("region"))
    try:
        response = client.get_secret_value(SecretId=id)
        return True
    except client.exceptions.ResourceNotFoundException:
        return False


def tags(app) -> []:
    return [
        {"SID": app.get("sid")},
        {"Environment": app.get("env")}
    ]


def register_secretsmanager(app: dict, name: str, secret: dict, tags: []):
    client = get_client('secretsmanager', app.get("resgion"))
    try:
        client.create_secret(
            name=name,
            SecretString=str(secret),
            Tags=tags
        )
        print("success to register to secret manager")
    except Exception as e:
        print("error: " + e)


def resource_name_format(app: dict, name: str, is_ssm: bool) -> str:
    if is_ssm:
        return f'/{app.get("env")}-{app.get("sid")}-{name}'
    return f'{app.get("env")}-{app.get("sid")}-{name}'


def main():
    yaml = config_open('application.yaml')
    print(yaml.get('app'))
    app = yaml.get('app')
    print(tags(app=app))
    print(resource_name_format(app, "test", True))
    print(is_exist_secretsmanager("test"))
    print(is_exist_ssm("test", app=app))
    secret = yaml.get("secret")
    for k in secret.keys():
        print(secret[k])


if __name__ == '__main__':
    main()
