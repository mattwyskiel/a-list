import { SSTConfig } from "sst";
import { API } from "./stacks/MyStack";

export default {
  config(_input) {
    return {
      name: "a-list",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.setDefaultFunctionProps({
      runtime: "nodejs20.x",
    });
    if (app.stage === "prod") app.setDefaultRemovalPolicy("retain");
    app.stack(API);
  },
} satisfies SSTConfig;
