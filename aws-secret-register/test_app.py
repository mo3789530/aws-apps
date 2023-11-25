import unittest
import app


class TestApp(unittest.TestCase):
    def test_tags(self):
        yaml = {'sid': 'test', 'env': 'dev', 'region': 'ap-northeast-1'}
        tags = app.tags(yaml)
        _except = [{'SID': 'test'}, {'Environment': 'dev'}]
        self.assertEqual(_except, tags)

    def test_resource_name(self):
        yaml = {'sid': 'test', 'env': 'dev', 'region': 'ap-northeast-1'}
        _except = "/dev-test-test"
        name = app.resource_name_format(yaml, "test", True)
        self.assertEqual(_except, name)
        _except = "dev-test-test"
        name = app.resource_name_format(yaml, "test", False)
        self.assertEqual(_except, name)
