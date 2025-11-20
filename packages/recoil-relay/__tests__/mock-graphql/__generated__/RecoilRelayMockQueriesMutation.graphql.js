/**
 * @generated SignedSource<<79724a41ab9a60f382f0fbcd3bc03b4f>>
 * @flow
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest, Mutation } from 'relay-runtime';
export type FeedbackLikeData = {|
  feedback_id: string,
  actor_id: string,
|};
export type RecoilRelayMockQueriesMutation$variables = {|
  data: FeedbackLikeData,
|};
export type RecoilRelayMockQueriesMutation$data = {|
  +feedback_like: ?{|
    +feedback: ?{|
      +id: string,
    |},
    +liker: ?{|
      +id: string,
    |},
  |},
|};
export type RecoilRelayMockQueriesMutation$rawResponse = {|
  +feedback_like: ?{|
    +feedback: ?{|
      +id: string,
    |},
    +liker: ?{|
      +id: string,
    |},
  |},
|};
export type RecoilRelayMockQueriesMutation = {|
  variables: RecoilRelayMockQueriesMutation$variables,
  response: RecoilRelayMockQueriesMutation$data,
  rawResponse: RecoilRelayMockQueriesMutation$rawResponse,
|};
*/

var node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "data"
  }
],
v1 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "id",
    "storageKey": null
  }
],
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "data",
        "variableName": "data"
      }
    ],
    "concreteType": "FeedbackLikeResponsePayload",
    "kind": "LinkedField",
    "name": "feedback_like",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Feedback",
        "kind": "LinkedField",
        "name": "feedback",
        "plural": false,
        "selections": (v1/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Actor",
        "kind": "LinkedField",
        "name": "liker",
        "plural": false,
        "selections": (v1/*: any*/),
        "storageKey": null
      }
    ],
    "storageKey": null
  }
],
v3 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RecoilRelayMockQueriesMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RecoilRelayMockQueriesMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "349a26a589d8e634caf2a31c6ee06d8f",
    "id": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "feedback_like": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "FeedbackLikeResponsePayload"
        },
        "feedback_like.feedback": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Feedback"
        },
        "feedback_like.feedback.id": (v3/*: any*/),
        "feedback_like.liker": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Actor"
        },
        "feedback_like.liker.id": (v3/*: any*/)
      }
    },
    "name": "RecoilRelayMockQueriesMutation",
    "operationKind": "mutation",
    "text": "mutation RecoilRelayMockQueriesMutation(\n  $data: FeedbackLikeData!\n) {\n  feedback_like(data: $data) {\n    feedback {\n      id\n    }\n    liker {\n      id\n    }\n  }\n}\n"
  }
};
})();

(node/*: any*/).hash = "8acd9c045c42f0db0da9581df52fdeaf";

module.exports = ((node/*: any*/)/*: Mutation<
  RecoilRelayMockQueriesMutation$variables,
  RecoilRelayMockQueriesMutation$data,
  RecoilRelayMockQueriesMutation$rawResponse,
>*/);
