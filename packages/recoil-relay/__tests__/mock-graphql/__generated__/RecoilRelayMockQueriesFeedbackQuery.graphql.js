/**
 * @generated SignedSource<<dce8821f99b2cf3de39cc1b463d43072>>
 * @flow
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest, Query } from 'relay-runtime';
export type RecoilRelayMockQueriesFeedbackQuery$variables = {|
  id: string,
|};
export type RecoilRelayMockQueriesFeedbackQuery$data = {|
  +feedback: ?{|
    +id: string,
    +seen_count: ?number,
  |},
|};
export type RecoilRelayMockQueriesFeedbackQuery = {|
  variables: RecoilRelayMockQueriesFeedbackQuery$variables,
  response: RecoilRelayMockQueriesFeedbackQuery$data,
|};
*/

var node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RecoilRelayMockQueriesFeedbackQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RecoilRelayMockQueriesFeedbackQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "7ecd8df19519a86d28338981aee7fc0e",
    "id": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "feedback": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Feedback"
        },
        "feedback.id": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "ID"
        },
        "feedback.seen_count": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Int"
        }
      }
    },
    "name": "RecoilRelayMockQueriesFeedbackQuery",
    "operationKind": "query",
    "text": "query RecoilRelayMockQueriesFeedbackQuery(\n  $id: ID!\n) {\n  feedback(id: $id) {\n    id\n    seen_count\n  }\n}\n"
  }
};
})();

(node/*: any*/).hash = "441867e637cf9396a4e268667901476e";

module.exports = ((node/*: any*/)/*: Query<
  RecoilRelayMockQueriesFeedbackQuery$variables,
  RecoilRelayMockQueriesFeedbackQuery$data,
>*/);
