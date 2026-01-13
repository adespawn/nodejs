"use strict";

const { assert } = require("chai");
const {
    RoundRobinPolicy,
    DCAwareRoundRobinPolicy,
    TokenAwarePolicy,
    AllowListPolicy,
    DefaultLoadBalancingPolicy,
    LoadBalancingConfig,
} = require("../../lib/policies/load-balancing");

describe("LoadBalancingRustImplemented Policies", () => {
    describe("RoundRobinPolicy", () => {
        it("should create instance with index property", () => {
            const policy = new RoundRobinPolicy();
            assert.instanceOf(policy, RoundRobinPolicy);
            assert.strictEqual(policy.index, 0);
        });

        it("should return correct configuration from getRustConfiguration", () => {
            const policy = new RoundRobinPolicy();
            const config = policy.getRustConfiguration();
            assert.deepEqual(config, { tokenAware: false });
        });

        it("should throw not supported error when calling init", () => {
            const policy = new RoundRobinPolicy();
            assert.throws(
                () => policy.init(null, null, null),
                ReferenceError,
                "This load balancing policy is implemented in Rust",
            );
        });

        it("should throw not supported error when calling getDistance", () => {
            const policy = new RoundRobinPolicy();
            assert.throws(
                () => policy.getDistance(null),
                ReferenceError,
                "This load balancing policy is implemented in Rust",
            );
        });

        it("should throw not supported error when calling newQueryPlan", () => {
            const policy = new RoundRobinPolicy();
            assert.throws(
                () => policy.newQueryPlan(null, null, null),
                ReferenceError,
                "This load balancing policy is implemented in Rust",
            );
        });
    });

    describe("DCAwareRoundRobinPolicy", () => {
        it("should create instance with localDc parameter", () => {
            const policy = new DCAwareRoundRobinPolicy("dc1");
            assert.instanceOf(policy, DCAwareRoundRobinPolicy);
            assert.strictEqual(policy.localDc, "dc1");
        });

        it("should create instance with undefined localDc", () => {
            const policy = new DCAwareRoundRobinPolicy();
            assert.instanceOf(policy, DCAwareRoundRobinPolicy);
            assert.isUndefined(policy.localDc);
        });

        it("should return correct map from getOptions", () => {
            const policy = new DCAwareRoundRobinPolicy("dc1");
            const options = policy.getOptions();
            assert.instanceOf(options, Map);
            assert.strictEqual(options.get("localDataCenter"), "dc1");
        });

        it("should return correct configuration from getRustConfiguration", () => {
            const policy = new DCAwareRoundRobinPolicy("dc1");
            const config = policy.getRustConfiguration();
            assert.deepEqual(config, {
                preferDatacenter: "dc1",
                permitDcFailover: false,
                tokenAware: false,
            });
        });

        it("should return configuration with undefined preferDatacenter when localDc is not set", () => {
            const policy = new DCAwareRoundRobinPolicy();
            const config = policy.getRustConfiguration();
            assert.deepEqual(config, {
                preferDatacenter: undefined,
                permitDcFailover: false,
                tokenAware: false,
            });
        });

        it("should throw not supported error when calling init", () => {
            const policy = new DCAwareRoundRobinPolicy("dc1");
            assert.throws(
                () => policy.init(null, null, null),
                ReferenceError,
                "This load balancing policy is implemented in Rust",
            );
        });

        it("should throw not supported error when calling getDistance", () => {
            const policy = new DCAwareRoundRobinPolicy("dc1");
            assert.throws(
                () => policy.getDistance(null),
                ReferenceError,
                "This load balancing policy is implemented in Rust",
            );
        });

        it("should throw not supported error when calling newQueryPlan", () => {
            const policy = new DCAwareRoundRobinPolicy("dc1");
            assert.throws(
                () => policy.newQueryPlan(null, null, null),
                ReferenceError,
                "This load balancing policy is implemented in Rust",
            );
        });
    });

    describe("TokenAwarePolicy", () => {
        it("should create instance with child policy", () => {
            const childPolicy = new RoundRobinPolicy();
            const policy = new TokenAwarePolicy(childPolicy);
            assert.instanceOf(policy, TokenAwarePolicy);
            assert.strictEqual(policy.childPolicy, childPolicy);
        });

        it("should throw error when child policy is not provided", () => {
            assert.throws(
                () => new TokenAwarePolicy(),
                Error,
                "You must specify a child load balancing policy",
            );
        });

        it("should throw error when child policy is null", () => {
            assert.throws(
                () => new TokenAwarePolicy(null),
                Error,
                "You must specify a child load balancing policy",
            );
        });

        it("should return correct map from getOptions with RoundRobinPolicy child", () => {
            const childPolicy = new RoundRobinPolicy();
            const policy = new TokenAwarePolicy(childPolicy);
            const options = policy.getOptions();
            assert.instanceOf(options, Map);
            assert.strictEqual(options.get("childPolicy"), "RoundRobinPolicy");
        });

        it("should return correct map from getOptions with DCAwareRoundRobinPolicy child", () => {
            const childPolicy = new DCAwareRoundRobinPolicy("dc1");
            const policy = new TokenAwarePolicy(childPolicy);
            const options = policy.getOptions();
            assert.instanceOf(options, Map);
            assert.strictEqual(
                options.get("childPolicy"),
                "DCAwareRoundRobinPolicy",
            );
            assert.strictEqual(options.get("localDataCenter"), "dc1");
        });

        it("should return configuration with tokenAware set to true", () => {
            const childPolicy = new RoundRobinPolicy();
            const policy = new TokenAwarePolicy(childPolicy);
            const config = policy.getRustConfiguration();
            assert.strictEqual(config.tokenAware, true);
        });

        it("should preserve child policy configuration and add tokenAware", () => {
            const childPolicy = new DCAwareRoundRobinPolicy("dc1");
            const policy = new TokenAwarePolicy(childPolicy);
            const config = policy.getRustConfiguration();
            assert.deepEqual(config, {
                preferDatacenter: "dc1",
                permitDcFailover: false,
                tokenAware: true,
            });
        });

        it("should throw not supported error when calling init", () => {
            const childPolicy = new RoundRobinPolicy();
            const policy = new TokenAwarePolicy(childPolicy);
            assert.throws(
                () => policy.init(null, null, null),
                ReferenceError,
                "This load balancing policy is implemented in Rust",
            );
        });

        it("should throw not supported error when calling getDistance", () => {
            const childPolicy = new RoundRobinPolicy();
            const policy = new TokenAwarePolicy(childPolicy);
            assert.throws(
                () => policy.getDistance(null),
                ReferenceError,
                "This load balancing policy is implemented in Rust",
            );
        });

        it("should throw not supported error when calling newQueryPlan", () => {
            const childPolicy = new RoundRobinPolicy();
            const policy = new TokenAwarePolicy(childPolicy);
            assert.throws(
                () => policy.newQueryPlan(null, null, null),
                ReferenceError,
                "This load balancing policy is implemented in Rust",
            );
        });
    });

    describe("AllowListPolicy", () => {
        it("should create instance with child policy and allowList", () => {
            const childPolicy = new RoundRobinPolicy();
            const allowList = ["127.0.0.1:9042", "127.0.0.2:9042"];
            const policy = new AllowListPolicy(childPolicy, allowList);
            assert.instanceOf(policy, AllowListPolicy);
            assert.strictEqual(policy.childPolicy, childPolicy);
            assert.deepEqual(policy.allowList, allowList);
        });

        it("should throw error when child policy is not provided", () => {
            const allowList = ["127.0.0.1:9042"];
            assert.throws(
                () => new AllowListPolicy(null, allowList),
                Error,
                "You must specify a child load balancing policy",
            );
        });

        it("should throw error when allowList is not provided", () => {
            const childPolicy = new RoundRobinPolicy();
            assert.throws(
                () => new AllowListPolicy(childPolicy),
                Error,
                "You must provide the list of allowed host addresses",
            );
        });

        it("should throw error when allowList is not an array", () => {
            const childPolicy = new RoundRobinPolicy();
            assert.throws(
                () => new AllowListPolicy(childPolicy, "127.0.0.1:9042"),
                Error,
                "You must provide the list of allowed host addresses",
            );
        });

        it("should return correct map from getOptions", () => {
            const childPolicy = new RoundRobinPolicy();
            const allowList = ["127.0.0.1:9042", "127.0.0.2:9042"];
            const policy = new AllowListPolicy(childPolicy, allowList);
            const options = policy.getOptions();
            assert.instanceOf(options, Map);
            assert.strictEqual(options.get("childPolicy"), "RoundRobinPolicy");
            assert.deepEqual(options.get("allowList"), allowList);
        });

        it("should return configuration with allowList from getRustConfiguration", () => {
            const childPolicy = new RoundRobinPolicy();
            const allowList = ["127.0.0.1:9042", "127.0.0.2:9042"];
            const policy = new AllowListPolicy(childPolicy, allowList);
            const config = policy.getRustConfiguration();
            assert.deepEqual(config, {
                tokenAware: false,
                allowList: allowList,
            });
        });

        it("should preserve child policy configuration and add allowList", () => {
            const childPolicy = new DCAwareRoundRobinPolicy("dc1");
            const allowList = ["127.0.0.1:9042"];
            const policy = new AllowListPolicy(childPolicy, allowList);
            const config = policy.getRustConfiguration();
            assert.deepEqual(config, {
                preferDatacenter: "dc1",
                permitDcFailover: false,
                tokenAware: false,
                allowList: allowList,
            });
        });

        it("should handle intersection of allowLists when child policy has one", () => {
            const childPolicy = new RoundRobinPolicy();
            const childAllowList = [
                "127.0.0.1:9042",
                "127.0.0.2:9042",
                "127.0.0.3:9042",
            ];
            const allowList = ["127.0.0.1:9042", "127.0.0.2:9042"];

            // Manually set allowList on child policy config
            childPolicy.getRustConfiguration = () => ({
                tokenAware: false,
                allowList: childAllowList,
            });

            const policy = new AllowListPolicy(childPolicy, allowList);
            const config = policy.getRustConfiguration();

            // Should have intersection of both lists
            assert.deepEqual(config.allowList, [
                "127.0.0.1:9042",
                "127.0.0.2:9042",
            ]);
        });

        it("should throw not supported error when calling init", () => {
            const childPolicy = new RoundRobinPolicy();
            const allowList = ["127.0.0.1:9042"];
            const policy = new AllowListPolicy(childPolicy, allowList);
            assert.throws(
                () => policy.init(null, null, null),
                ReferenceError,
                "This load balancing policy is implemented in Rust",
            );
        });

        it("should throw not supported error when calling getDistance", () => {
            const childPolicy = new RoundRobinPolicy();
            const allowList = ["127.0.0.1:9042"];
            const policy = new AllowListPolicy(childPolicy, allowList);
            assert.throws(
                () => policy.getDistance(null),
                ReferenceError,
                "This load balancing policy is implemented in Rust",
            );
        });

        it("should throw not supported error when calling newQueryPlan", () => {
            const childPolicy = new RoundRobinPolicy();
            const allowList = ["127.0.0.1:9042"];
            const policy = new AllowListPolicy(childPolicy, allowList);
            assert.throws(
                () => policy.newQueryPlan(null, null, null),
                ReferenceError,
                "This load balancing policy is implemented in Rust",
            );
        });
    });

    describe("DefaultLoadBalancingPolicy", () => {
        it("should create instance without config", () => {
            const policy = new DefaultLoadBalancingPolicy();
            assert.instanceOf(policy, DefaultLoadBalancingPolicy);
        });

        it("should create instance with config", () => {
            const config = new LoadBalancingConfig();
            config.preferDatacenter = "dc1";
            config.tokenAware = true;
            const policy = new DefaultLoadBalancingPolicy(config);
            assert.instanceOf(policy, DefaultLoadBalancingPolicy);
        });

        it("should return config from getRustConfiguration", () => {
            const config = new LoadBalancingConfig();
            config.preferDatacenter = "dc1";
            config.tokenAware = true;
            config.permitDcFailover = false;
            const policy = new DefaultLoadBalancingPolicy(config);
            const returnedConfig = policy.getRustConfiguration();
            assert.strictEqual(returnedConfig.preferDatacenter, "dc1");
            assert.strictEqual(returnedConfig.tokenAware, true);
            assert.strictEqual(returnedConfig.permitDcFailover, false);
        });

        it("should return empty config when created without config", () => {
            const policy = new DefaultLoadBalancingPolicy();
            const config = policy.getRustConfiguration();
            assert.instanceOf(config, LoadBalancingConfig);
        });

        it("should throw not supported error when calling getOptions", () => {
            const policy = new DefaultLoadBalancingPolicy();
            assert.throws(
                () => policy.getOptions(),
                ReferenceError,
                "Not implemented. is not supported by our driver",
            );
        });

        it("should throw not supported error when calling init", () => {
            const policy = new DefaultLoadBalancingPolicy();
            assert.throws(
                () => policy.init(null, null, null),
                ReferenceError,
                "This load balancing policy is implemented in Rust",
            );
        });

        it("should throw not supported error when calling getDistance", () => {
            const policy = new DefaultLoadBalancingPolicy();
            assert.throws(
                () => policy.getDistance(null),
                ReferenceError,
                "This load balancing policy is implemented in Rust",
            );
        });

        it("should throw not supported error when calling newQueryPlan", () => {
            const policy = new DefaultLoadBalancingPolicy();
            assert.throws(
                () => policy.newQueryPlan(null, null, null),
                ReferenceError,
                "This load balancing policy is implemented in Rust",
            );
        });
    });

    describe("LoadBalancingConfig", () => {
        it("should create instance with properties", () => {
            const config = new LoadBalancingConfig();
            assert.instanceOf(config, LoadBalancingConfig);
        });

        it("should allow setting preferDatacenter", () => {
            const config = new LoadBalancingConfig();
            config.preferDatacenter = "dc1";
            assert.strictEqual(config.preferDatacenter, "dc1");
        });

        it("should allow setting preferRack", () => {
            const config = new LoadBalancingConfig();
            config.preferRack = "rack1";
            assert.strictEqual(config.preferRack, "rack1");
        });

        it("should allow setting tokenAware", () => {
            const config = new LoadBalancingConfig();
            config.tokenAware = true;
            assert.strictEqual(config.tokenAware, true);
        });

        it("should allow setting permitDcFailover", () => {
            const config = new LoadBalancingConfig();
            config.permitDcFailover = true;
            assert.strictEqual(config.permitDcFailover, true);
        });

        it("should allow setting enableShufflingReplicas", () => {
            const config = new LoadBalancingConfig();
            config.enableShufflingReplicas = false;
            assert.strictEqual(config.enableShufflingReplicas, false);
        });

        it("should allow setting allowList", () => {
            const config = new LoadBalancingConfig();
            const allowList = ["127.0.0.1:9042", "127.0.0.2:9042"];
            config.allowList = allowList;
            assert.deepEqual(config.allowList, allowList);
        });

        it("should allow setting multiple properties", () => {
            const config = new LoadBalancingConfig();
            config.preferDatacenter = "dc1";
            config.preferRack = "rack1";
            config.tokenAware = true;
            config.permitDcFailover = false;
            config.enableShufflingReplicas = true;
            config.allowList = ["127.0.0.1:9042"];

            assert.strictEqual(config.preferDatacenter, "dc1");
            assert.strictEqual(config.preferRack, "rack1");
            assert.strictEqual(config.tokenAware, true);
            assert.strictEqual(config.permitDcFailover, false);
            assert.strictEqual(config.enableShufflingReplicas, true);
            assert.deepEqual(config.allowList, ["127.0.0.1:9042"]);
        });
    });
});
