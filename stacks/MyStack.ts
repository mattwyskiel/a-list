import {
  StackContext,
  Api,
  EventBus,
  Table,
  Script,
  Bucket,
} from "sst/constructs";
import * as s3 from "aws-cdk-lib/aws-s3";

export function API({ stack }: StackContext) {
  const table = new Table(stack, "Table", {
    fields: {
      id: "number",
    },
    primaryIndex: {
      partitionKey: "id",
    },
  });

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [table],
      },
    },
    routes: {
      "GET /": "packages/functions/src/get-entries/function.handler",
      "POST /": "packages/functions/src/add-entry/function.handler",
    },
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
