import {
  StackContext,
  Api,
  EventBus,
  Table,
  Script,
  Bucket,
  ApiDomainProps,
} from "sst/constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import { DomainName } from "aws-cdk-lib/aws-apigatewayv2";
import { StringParameter } from "aws-cdk-lib/aws-ssm";

export function API({ stack, app }: StackContext) {
  const table = new Table(stack, "Table", {
    fields: {
      id: "number",
    },
    primaryIndex: {
      partitionKey: "id",
    },
  });

  let customDomain: ApiDomainProps | undefined;
  if (!app.local && app.stage !== "local") {
    customDomain = {
      path: "a-list",
      cdk: {
        domainName: DomainName.fromDomainNameAttributes(stack, "ApiDomain", {
          name: StringParameter.valueFromLookup(
            stack,
            `/sst-outputs/${app.stage}-infra-API/domainName`
          ),
          regionalDomainName: StringParameter.valueFromLookup(
            stack,
            `/sst-outputs/${app.stage}-infra-API/regionalDomainName`
          ),
          regionalHostedZoneId: StringParameter.valueFromLookup(
            stack,
            `/sst-outputs/${app.stage}-infra-API/regionalHostedZoneId`
          ),
        }),
      },
    };
  }

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [table],
      },
    },
    routes: {
      "GET /": "packages/functions/src/get-entries/function.handler",
      "GET /podcast-feed":
        "packages/functions/src/podcast-feed/function.handler",
      "POST /": "packages/functions/src/add-entry/function.handler",
    },
    customDomain,
  });

  const assetsBucket = new Bucket(stack, "MWAssetsBucket", {
    cdk: {
      bucket: s3.Bucket.fromBucketName(
        stack,
        "MWAssetsBucketCDK",
        "com.mattwyskiel.assets"
      ),
    },
  });
  new Script(stack, "SeedDb", {
    onCreate: "packages/functions/src/seed-db/function.handler",
    defaults: {
      function: {
        bind: [table, assetsBucket],
      },
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
