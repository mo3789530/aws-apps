import unittest
import app

class TestApp(unittest.TestCase):
    def test_tags(self):
        yaml = {'sid': 'test', 'env': 'dev', 'region': 'ap-northeast-1'}
        tags = app.tags(yaml)
        self.assertEqual()