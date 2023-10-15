/*
Copyright © 2023 NAME HERE <EMAIL ADDRESS>
*/
package main

import (
	"mo3789530/aws-apps/cf-edge/cmd"
	"os"

	"golang.org/x/exp/slog"
)

func main() {
	slog.SetDefault(slog.New(slog.NewTextHandler(os.Stdout, nil)))
	cmd.Execute()
}
