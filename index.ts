import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { NextJsSite } from "@whiskey/pulumi-opennext-site";

const stack = pulumi.getStack();

const table = new aws.dynamodb.Table("a-list-entries-table", {
  name: `a-list-entries-${stack}`,
  billingMode: "PAY_PER_REQUEST",
  attributes: [
    {
      name: "id",
      type: "N",
    },
    {
      name: "slug",
      type: "S",
    },
  ],
  hashKey: "id",
  globalSecondaryIndexes: [
    {
      name: "bySlug",
      keySchemas: [
        {
          attributeName: "slug",
          keyType: "HASH",
        },
      ],
      projectionType: "ALL",
    },
  ],
});

const siteName = `a-list-${stack}`;
const resourceNameBase = siteName;
const domainName =
  stack === "prod"
    ? "a-list.mattwyskiel.com"
    : `${stack}.a-list.mattwyskiel.com`;

const site = new NextJsSite(siteName, {
  path: "src",
  environment: {
    TABLE_NAME: table.name,
    NEXT_PUBLIC_STACK: stack,
  },
  resourceNameBase,
  customDomain: {
    mode: "create",
    domainName: domainName,
    hostedZoneName: "mattwyskiel.com",
    includeWWW: false,
  },
  serverFunctionPolicyStatements: [
    {
      Effect: "Allow",
      Action: [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:Query",
        "dynamodb:Scan",
      ],
      Resource: [table.arn, pulumi.interpolate`${table.arn}/index/*`],
    },
    {
      Effect: "Allow",
      Action: ["s3:ListObjects"],
      Resource: [
        "arn:aws:s3:::com.mattwyskiel.assets/*",
        "arn:aws:s3:::com.mattwyskiel.assets",
      ],
    },
  ],
});

export const url = site.url;
