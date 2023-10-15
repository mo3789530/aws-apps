package aws

import (
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/ec2"
)

func GetEc2Metadata(cfg aws.Config) {
	svc := ec2.NewFromConfig(cfg)
	res, err := svc.DescribeInstances()

}
