import yaml
import boto3
from botocore.config import Config
import os
import subprocess


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


def is_exist_ssm():
    pass


def register_ssm():
    pass


def is_exist_secretsmanager(id: str):
    client = client('secretsmanager')
    try:
        response = client.get_secret_value(SecretId=id)
        return True
    except:
        return False
    
def tags(app):
    return [
        {"SID": app.sid},
        {"Environment": app.env }
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


def resource_name_format(app: dict):
    pass


def main():
    yaml = config_open('application.yaml')
    print(yaml.get('app'))
    app = yaml.get('app')
    


if __name__ == '__main__':
    main()
