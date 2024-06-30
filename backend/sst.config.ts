/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "a-list-backend",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const bucket = new sst.aws.Bucket("Bucket");

    const api = new sst.aws.ApiGatewayV2("Api");
    api.route("GET /", "functions/list-mixes.handler");
  },
});
