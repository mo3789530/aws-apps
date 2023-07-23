import yaml
import boto3

def ssm():
    pass

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

def is_exist_secretsmanager():
    pass

def register_secretsmanager():
    pass

def resource_name_format(app: dict):
    pass

def main():
    yaml = config_open('application.yaml')
    print(yaml.get('app'))


if __name__ == '__main__':
    main()
