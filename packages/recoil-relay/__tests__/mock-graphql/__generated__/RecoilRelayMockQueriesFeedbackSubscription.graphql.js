/**
 * @generated SignedSource<<226af8378e64227b56bfc98a08daddde>>
 * @flow
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type FeedbackLikeSubscribeData = {|
  feedback_id: string,
|};
export type RecoilRelayMockQueriesFeedbackSubscription$variables = {|
  input: FeedbackLikeSubscribeData,
|};
export type RecoilRelayMockQueriesFeedbackSubscription$data = {|
  +feedback_like_subscribe: ?{|
    +feedback?: ?{|
      +id: string,
      +seen_count: ?number,
    |},
  |},
|};
export type RecoilRelayMockQueriesFeedbackSubscription = {|
  variables: RecoilRelayMockQueriesFeedbackSubscription$variables,
  response: RecoilRelayMockQueriesFeedbackSubscription$data,
|};
*/

var node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "data",
    "variableName": "input"
  }
],
v2 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Feedback",
      "kind": "LinkedField",
      "name": "feedback",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "id",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "seen_count",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "FeedbackLikeResponsePayload",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RecoilRelayMockQueriesFeedbackSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "feedback_like_subscribe",
        "plural": false,
        "selections": [
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RecoilRelayMockQueriesFeedbackSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "feedback_like_subscribe",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "9f5b6a9a0b7946dbc0367dd617ad390d",
    "id": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "feedback_like_subscribe": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "FeedbackLikeSubscribeResponsePayload"
        },
        "feedback_like_subscribe.__typename": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "String"
        },
        "feedback_like_subscribe.feedback": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Feedback"
        },
        "feedback_like_subscribe.feedback.id": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "ID"
        },
        "feedback_like_subscribe.feedback.seen_count": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Int"
        }
      }
    },
    "name": "RecoilRelayMockQueriesFeedbackSubscription",
    "operationKind": "subscription",
    "text": "subscription RecoilRelayMockQueriesFeedbackSubscription(\n  $input: FeedbackLikeSubscribeData!\n) {\n  feedback_like_subscribe(data: $input) {\n    __typename\n    ... on FeedbackLikeResponsePayload {\n      feedback {\n        id\n        seen_count\n      }\n    }\n  }\n}\n"
  }
};
})();

(node/*: any*/).hash = "e964d286d0cbe2790d03aad9290ed5b8";

module.exports = ((node/*: any*/)/*: GraphQLSubscription<
  RecoilRelayMockQueriesFeedbackSubscription$variables,
  RecoilRelayMockQueriesFeedbackSubscription$data,
>*/);
