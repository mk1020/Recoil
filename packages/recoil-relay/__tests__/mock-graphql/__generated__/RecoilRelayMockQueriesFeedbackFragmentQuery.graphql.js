/**
 * @generated SignedSource<<60148e49892a7167f811b300e52d67bd>>
 * @flow
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest, Query } from 'relay-runtime';
type RecoilRelayMockQueriesFeedbackFragment$fragmentType = any;
export type RecoilRelayMockQueriesFeedbackFragmentQuery$variables = {|
  id: string,
|};
export type RecoilRelayMockQueriesFeedbackFragmentQuery$data = {|
  +feedback: ?{|
    +$fragmentSpreads: RecoilRelayMockQueriesFeedbackFragment$fragmentType,
  |},
|};
export type RecoilRelayMockQueriesFeedbackFragmentQuery = {|
  variables: RecoilRelayMockQueriesFeedbackFragmentQuery$variables,
  response: RecoilRelayMockQueriesFeedbackFragmentQuery$data,
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
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = [
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RecoilRelayMockQueriesFeedbackFragmentQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Feedback",
        "kind": "LinkedField",
        "name": "feedback",
        "plural": false,
        "selections": [
          {
            "kind": "InlineDataFragmentSpread",
            "name": "RecoilRelayMockQueriesFeedbackFragment",
            "selections": (v2/*: any*/)
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RecoilRelayMockQueriesFeedbackFragmentQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Feedback",
        "kind": "LinkedField",
        "name": "feedback",
        "plural": false,
        "selections": (v2/*: any*/),
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "c1606f60aaaa8995b00aff47cfbb08c7",
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
    "name": "RecoilRelayMockQueriesFeedbackFragmentQuery",
    "operationKind": "query",
    "text": "query RecoilRelayMockQueriesFeedbackFragmentQuery(\n  $id: ID!\n) {\n  feedback(id: $id) {\n    ...RecoilRelayMockQueriesFeedbackFragment\n    id\n  }\n}\n\nfragment RecoilRelayMockQueriesFeedbackFragment on Feedback {\n  id\n  seen_count\n}\n"
  }
};
})();

(node/*: any*/).hash = "ac701ea0f874fda1b69f56ba56e58234";

module.exports = ((node/*: any*/)/*: Query<
  RecoilRelayMockQueriesFeedbackFragmentQuery$variables,
  RecoilRelayMockQueriesFeedbackFragmentQuery$data,
>*/);
