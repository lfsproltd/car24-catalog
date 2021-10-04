import {
  GET_INSPECTION_LIST_DETAIL,
  GET_INSPECTION_CATALOG_SUMMARY,
  GET_INSPECTION_CATALOG_MASTER,
  GET_INSPECTION_DETAIL,
  GET_MASTER_DATA_CHECKPOINTS,
} from "../../types";

/**
 * Note: Only stores last open inspectionDetails in state
 */
const initialState = {
  inspectionDetails: [],
  catalogSummary: {},
  catalogMaster: {},
  masterData: {},
  isProcessing: true,
};

const inspectionDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_INSPECTION_LIST_DETAIL:
      return {
        ...state,
        inspectionDetails: action.payload,
      };
    case GET_INSPECTION_CATALOG_SUMMARY:
      return {
        ...state,
        catalogSummary: action.payload,
      };
    case GET_INSPECTION_CATALOG_MASTER:
      return {
        ...state,
        catalogMaster: action.payload,
      };
    case GET_INSPECTION_DETAIL:
      return {
        ...state,
        inspectionDetails: action.payload,
      };
    case GET_MASTER_DATA_CHECKPOINTS:
      return {
        ...state,
        masterData: action.payload,
      }
    default:
      return {
        ...state,
      };
  }
};

export default inspectionDetailsReducer;

/*
*********************************
SAMPLE inspectionDetails:
---------------------------------
{
  "id": "7244884787",
  "createdBy": { "uid": "ankit.bhalla@cars24.com", "authType": "USER" },
  "updatedBy": { "uid": "aviral.ahuja@cars24.com", "authType": "USER" },
  "createdAt": "2021-10-01T12:10:50.958781Z",
  "updatedAt": "2021-10-01T12:19:24.609198Z",
  "surrogateKey": "IN_CAR_1008743829",
  "appointmentId": "1008743829",
  "locationCode": "LC_119",
  "locationType": "SERVICE_CENTER",
  "vin": "MA3EYD81S01230084",
  "vehicleType": "CAR",
  "country": "IN",
  "schemaVersion": "IN_CAR_CATALOG_V4",
  "make": "MARUTI SUZUKI",
  "model": "ALTO",
  "variant": "LXI",
  "registrationNumber": "DL9CS5497",
  "year": "2008",
  "fuelType": "Petrol",
  "data": {
    "derivedStatus": "READY_FOR_CHECKOUT",
    "inventoryStatus": "STOCK_IN",
    "previousCheckpointKey": "Exterior + Tyres + Pillar + RHS B",
    "additionalEstimatePDI": false,
    "checkpoints": {
      "AC + Cooling Fan": {
        "choices": [],
        "noImperfectionChoices": ["OK / No Imperfection"],
        "refurbishmentChoices": [],
        "images": [
          {
            "label": "rn_image_picker_lib_temp_4e9eb390-017c-4d99-a3fa-092bd91ea38c.jpg",
            "path": "https://c24-inspections.s3.ap-south-1.amazonaws.com/qa/inspection/IN_CAR_1008743829/CATALOG/AC%20%2B%20Cooling%20Fan47rn_image_picker_lib_temp_4e9eb390-017c-4d99-a3fa-092bd91ea38c.jpg.jpg"
          }
        ],
        "videos": [],
        "ok": true,
        "prepopulated": false,
        "additional": false,
        "revision": 0,
        "updatedBy": { "uid": "ankit.bhalla@cars24.com", "authType": "USER" },
        "updatedAt": "2021-10-01T12:12:20.287295Z"
      },
      "Exterior + Tyres + Grill": {
        "choices": [],
        "noImperfectionChoices": ["OK / No Imperfection"],
        "refurbishmentChoices": [],
        "images": [
          {
            "label": "rn_image_picker_lib_temp_341ecac4-8da8-470a-8a95-9bc75964a5d0.jpg",
            "path": "https://c24-inspections.s3.ap-south-1.amazonaws.com/qa/inspection/IN_CAR_1008743829/CATALOG/Exterior%20%2B%20Tyres%20%2B%20Grill47rn_image_picker_lib_temp_341ecac4-8da8-470a-8a95-9bc75964a5d0.jpg.jpg"
          }
        ],
        "videos": [],
        "ok": true,
        "prepopulated": false,
        "additional": false,
        "revision": 0,
        "updatedBy": { "uid": "ankit.bhalla@cars24.com", "authType": "USER" },
        "updatedAt": "2021-10-01T12:12:10.909701Z"
      },
      "Exterior + Tyres + Pillar + RHS B": {
        "choices": [],
        "noImperfectionChoices": ["OK / No Imperfection"],
        "refurbishmentChoices": [],
        "images": [
          {
            "label": "rn_image_picker_lib_temp_9bbb3fd7-01f0-45c7-ac59-af95d78dcfcf.jpg",
            "path": "https://c24-inspections.s3.ap-south-1.amazonaws.com/qa/inspection/IN_CAR_1008743829/CATALOG/Exterior%20%2B%20Tyres%20%2B%20Pillar%20%2B%20RHS%20B47rn_image_picker_lib_temp_9bbb3fd7-01f0-45c7-ac59-af95d78dcfcf.jpg.jpg"
          }
        ],
        "videos": [],
        "ok": true,
        "prepopulated": false,
        "additional": false,
        "revision": 0,
        "updatedBy": { "uid": "ankit.bhalla@cars24.com", "authType": "USER" },
        "updatedAt": "2021-10-01T12:12:47.162567Z"
      },
      "Exterior + Tyres + Windshield + Front": {
        "choices": [],
        "noImperfectionChoices": ["OK / No Imperfection"],
        "refurbishmentChoices": [],
        "images": [
          {
            "label": "rn_image_picker_lib_temp_15bb71b6-0cfe-4520-a51e-28ad2631bfbd.jpg",
            "path": "https://c24-inspections.s3.ap-south-1.amazonaws.com/qa/inspection/IN_CAR_1008743829/CATALOG/Exterior%20%2B%20Tyres%20%2B%20Windshield%20%2B%20Front47rn_image_picker_lib_temp_15bb71b6-0cfe-4520-a51e-28ad2631bfbd.jpg.jpg"
          }
        ],
        "videos": [],
        "ok": true,
        "prepopulated": false,
        "additional": false,
        "revision": 0,
        "updatedBy": { "uid": "ankit.bhalla@cars24.com", "authType": "USER" },
        "updatedAt": "2021-10-01T12:11:59.489379Z"
      },
      "Lights + Fog Light + Rear": {
        "choices": [],
        "noImperfectionChoices": ["OK / No Imperfection"],
        "refurbishmentChoices": [],
        "images": [
          {
            "label": "rn_image_picker_lib_temp_ac529625-77aa-4dff-9ba5-70d9020f4b7f.jpg",
            "path": "https://c24-inspections.s3.ap-south-1.amazonaws.com/qa/inspection/IN_CAR_1008743829/CATALOG/Lights%20%2B%20Fog%20Light%20%2B%20Rear47rn_image_picker_lib_temp_ac529625-77aa-4dff-9ba5-70d9020f4b7f.jpg.jpg"
          }
        ],
        "videos": [],
        "ok": true,
        "prepopulated": false,
        "additional": false,
        "revision": 1,
        "updatedBy": { "uid": "ankit.bhalla@cars24.com", "authType": "USER" },
        "updatedAt": "2021-10-01T12:12:34.970166Z"
      }
    },
    "estimates": {},
    "qualityChecks": {}
  },
  "version": 1,
  "archived": "0",
  "inspectionStatus": "APPROVED",
  "inspectionType": "CATALOG",
  "assignedTo": { "uid": "aviral.ahuja@cars24.com", "authType": "USER" },
  "invalidated": false,
  "loc": { "name": "CARS24- Au Motors Pvt Ltd, Noida" }
}

*/

/*
*********************************
SAMPLE catalogSummary:
---------------------------------
{
  "purchasePrice": 0.0,
  "totalCost": 6656.0,
  "current": { "pending": 0.0, "approved": 0.0 }
}

*/

/*
*********************************
SAMPLE catalogMaster:
---------------------------------
{
  "checkpoints": [
    {
      "key": "Exterior + Tyres + Windshield + Front",
      "title": "Windshield - Front",
      "images": { "minCount": 1, "maxCount": 10 },
      "videos": { "minCount": 0, "maxCount": 1 },
      "category": "Exterior + Tyres",
      "subCategory": "Windshield",
      "prepopulate": [
        { "from": "FULFILLMENT_CENTER", "to": "FULFILLMENT_CENTER" }
      ],
      "choices": [
        {
          "name": "Spots",
          "type": "relative",
          "selected": false,
          "acceptable": ["Spots without crack"],
          "nonAcceptable": ["> 2 mm, spots with crack"]
        },
        {
          "name": "Scratched",
          "type": "relative",
          "selected": false,
          "acceptable": ["Wiper blade marks"],
          "nonAcceptable": ["Others"]
        },
        {
          "name": "Broken",
          "type": "absolute",
          "selected": false,
          "acceptable": [],
          "nonAcceptable": []
        },
        {
          "name": "Bidding missing/broken",
          "type": "absolute",
          "selected": false,
          "acceptable": [],
          "nonAcceptable": []
        },
        {
          "name": "Wiper blade not working",
          "type": "absolute",
          "selected": false,
          "acceptable": [],
          "nonAcceptable": []
        },
        {
          "name": "Wiper blade broken/rusted",
          "type": "absolute",
          "selected": false,
          "acceptable": [],
          "nonAcceptable": []
        },
        {
          "name": "Wiper nozzle missing/not working",
          "type": "absolute",
          "selected": false,
          "acceptable": [],
          "nonAcceptable": []
        }
      ],
      "noImperfectionChoices": [
        { "name": "OK / No Imperfection", "type": "ok" }
      ],
      "refurbishment": {
        "choices": ["Replace", "Repair", "Polish", "No Work"],
        "additionalParts": []
      },
      "pdi": {
        "images": { "minCount": 0, "maxCount": 10 },
        "videos": { "minCount": 0, "maxCount": 1 }
      },
      "qa": { "top": false },
      "hints": {
        "tabular": [
          ["broken", ">2 fin", "replace"],
          ["broken", ">2 fin", "replace"]
        ]
      }
    },
    {
      "key": "Exterior + Tyres + Grill",
      "title": "Grill",
      "images": { "minCount": 1, "maxCount": 10 },
      "videos": { "minCount": 0, "maxCount": 1 },
      "category": "Exterior + Tyres",
      "subCategory": "Grill",
      "prepopulate": [],
      "choices": [
        {
          "name": "Broken",
          "type": "absolute",
          "selected": false,
          "acceptable": [],
          "nonAcceptable": []
        },
        {
          "name": "Rusted",
          "type": "absolute",
          "selected": false,
          "acceptable": [],
          "nonAcceptable": []
        },
        {
          "name": "Missing",
          "type": "absolute",
          "selected": false,
          "acceptable": [],
          "nonAcceptable": []
        }
      ],
      "noImperfectionChoices": [
        { "name": "OK / No Imperfection", "type": "ok" }
      ],
      "refurbishment": {
        "choices": ["Repair", "Replace", "No Work"],
        "additionalParts": []
      },
      "pdi": {
        "images": { "minCount": 0, "maxCount": 10 },
        "videos": { "minCount": 0, "maxCount": 1 }
      },
      "qa": { "top": false },
      "hints": {
        "tabular": [
          ["Faded", "Faded", "Green"],
          ["Scratched", "<4 Nos and multiple Scratches", "Green"],
          ["Scratched", ">4 Nos and multiple paint peel off", "Red"],
          ["Dented", "Dented", "Green"],
          ["Motor Not Working", "Not working", "Red"],
          ["Cover broken", "Broken", "Red"],
          ["Cover missing", "Missing", "Red"],
          ["Light broken/not working", "Broken", "Red"],
          ["Part alignment not proper", "alignment not proper", "Red"]
        ]
      }
    },
    {
      "key": "AC + Cooling Fan",
      "title": "Cooling Fan",
      "images": { "minCount": 1, "maxCount": 10 },
      "videos": { "minCount": 0, "maxCount": 1 },
      "category": "AC",
      "subCategory": "Cooling Fan",
      "prepopulate": [
        { "from": "FULFILLMENT_CENTER", "to": "FULFILLMENT_CENTER" }
      ],
      "choices": [
        {
          "name": "Wiring damage",
          "type": "absolute",
          "selected": false,
          "acceptable": [],
          "nonAcceptable": []
        },
        {
          "name": "Bearing damage",
          "type": "absolute",
          "selected": false,
          "acceptable": [],
          "nonAcceptable": []
        },
        {
          "name": "Fan support damage",
          "type": "absolute",
          "selected": false,
          "acceptable": [],
          "nonAcceptable": []
        },
        {
          "name": "Blade damage",
          "type": "absolute",
          "selected": false,
          "acceptable": [],
          "nonAcceptable": []
        },
        {
          "name": "Not working",
          "type": "absolute",
          "selected": false,
          "acceptable": [],
          "nonAcceptable": []
        }
      ],
      "noImperfectionChoices": [
        { "name": "OK / No Imperfection", "type": "ok" }
      ],
      "refurbishment": {
        "choices": ["Repair", "Replace", "Clean", "No Work"],
        "additionalParts": []
      },
      "pdi": {
        "images": { "minCount": 0, "maxCount": 10 },
        "videos": { "minCount": 0, "maxCount": 1 }
      },
      "qa": { "top": false }
    },
    {
      "key": "Lights + Fog Light + Rear",
      "title": "Fog Light - Rear",
      "images": { "minCount": 1, "maxCount": 10 },
      "videos": { "minCount": 0, "maxCount": 1 },
      "category": "Lights",
      "subCategory": "Fog Light",
      "prepopulate": [
        { "from": "FULFILLMENT_CENTER", "to": "FULFILLMENT_CENTER" }
      ],
      "choices": [
        {
          "name": "Broken",
          "type": "absolute",
          "selected": false,
          "acceptable": [],
          "nonAcceptable": []
        },
        {
          "name": "Scratched",
          "type": "relative",
          "selected": false,
          "acceptable": ["Scratched"],
          "nonAcceptable": ["Others"]
        },
        {
          "name": "Bulb Fused",
          "type": "absolute",
          "selected": false,
          "acceptable": [],
          "nonAcceptable": []
        },
        {
          "name": "Bulb broken",
          "type": "absolute",
          "selected": false,
          "acceptable": [],
          "nonAcceptable": []
        },
        {
          "name": "Fading",
          "type": "absolute",
          "selected": false,
          "acceptable": [],
          "nonAcceptable": []
        }
      ],
      "noImperfectionChoices": [
        { "name": "Not Applicable", "type": "NA" },
        { "name": "OK / No Imperfection", "type": "ok" }
      ],
      "refurbishment": {
        "choices": ["Replace", "Buffing", "Repair", "No Work"],
        "additionalParts": []
      },
      "pdi": {
        "images": { "minCount": 0, "maxCount": 10 },
        "videos": { "minCount": 0, "maxCount": 1 }
      },
      "qa": { "top": false },
      "hints": {
        "tabular": [
          ["broken", ">2 fin", "replace"],
          ["broken", ">2 fin", "replace"]
        ]
      }
    },
    {
      "key": "Exterior + Tyres + Pillar + RHS B",
      "title": "Pillar - RHS B",
      "images": { "minCount": 1, "maxCount": 10 },
      "videos": { "minCount": 0, "maxCount": 1 },
      "category": "Exterior + Tyres",
      "subCategory": "Pillar",
      "prepopulate": [],
      "choices": [
        {
          "name": "Faded",
          "type": "absolute",
          "selected": false,
          "acceptable": [],
          "nonAcceptable": []
        },
        {
          "name": "Scratched",
          "type": "relative",
          "selected": false,
          "acceptable": [
            "Scratches <= 2 inches (no paint peel off/rusting)",
            "Scratches not visible from 2 feet."
          ],
          "nonAcceptable": ["> 2 inch", "no paint peel off/rusting"]
        },
        {
          "name": "Dented",
          "type": "relative",
          "selected": false,
          "acceptable": ["Dent <= 1 inch(no paint peel off/rusting)"],
          "nonAcceptable": ["> 1 inch", "no paint peel off/rusting"]
        },
        {
          "name": "Rusted",
          "type": "absolute",
          "selected": false,
          "acceptable": [],
          "nonAcceptable": []
        },
        {
          "name": "Cover Broken",
          "type": "absolute",
          "selected": false,
          "acceptable": [],
          "nonAcceptable": []
        },
        {
          "name": "Cover Missing",
          "type": "absolute",
          "selected": false,
          "acceptable": [],
          "nonAcceptable": []
        }
      ],
      "noImperfectionChoices": [
        { "name": "OK / No Imperfection", "type": "ok" }
      ],
      "refurbishment": {
        "choices": [
          "Repair",
          "Replace",
          "Dent",
          "Partial Dent",
          "Rubbing Polishing",
          "Repaint"
        ],
        "additionalParts": []
      },
      "pdi": {
        "images": { "minCount": 0, "maxCount": 10 },
        "videos": { "minCount": 0, "maxCount": 1 }
      },
      "qa": { "top": false },
      "hints": {
        "tabular": [
          ["Faded", "Faded", "Red"],
          ["Scratched", "Scratched", "Green"],
          ["Dented", "Dented", "Green"],
          ["Rusted", "Rust >1 inch", "TBD"],
          ["Rusted", "Rust <1 inch", "Green"],
          ["Cover Broken", "Broken", "Yellow"],
          ["Cover Missing", "Missing", "Yellow"]
        ]
      }
    }
  ],
  "categories": [
    {
      "category": "Exterior + Tyres",
      "subCategories": [
        {
          "subcategory": "Windshield",
          "checkpoints": [
            {
              "key": "Exterior + Tyres + Windshield + Front",
              "title": "Windshield - Front",
              "images": { "minCount": 1, "maxCount": 10 },
              "videos": { "minCount": 0, "maxCount": 1 },
              "category": "Exterior + Tyres",
              "subCategory": "Windshield",
              "prepopulate": [
                { "from": "FULFILLMENT_CENTER", "to": "FULFILLMENT_CENTER" }
              ],
              "choices": [
                {
                  "name": "Spots",
                  "type": "relative",
                  "selected": false,
                  "acceptable": ["Spots without crack"],
                  "nonAcceptable": ["> 2 mm, spots with crack"]
                },
                {
                  "name": "Scratched",
                  "type": "relative",
                  "selected": false,
                  "acceptable": ["Wiper blade marks"],
                  "nonAcceptable": ["Others"]
                },
                {
                  "name": "Broken",
                  "type": "absolute",
                  "selected": false,
                  "acceptable": [],
                  "nonAcceptable": []
                },
                {
                  "name": "Bidding missing/broken",
                  "type": "absolute",
                  "selected": false,
                  "acceptable": [],
                  "nonAcceptable": []
                },
                {
                  "name": "Wiper blade not working",
                  "type": "absolute",
                  "selected": false,
                  "acceptable": [],
                  "nonAcceptable": []
                },
                {
                  "name": "Wiper blade broken/rusted",
                  "type": "absolute",
                  "selected": false,
                  "acceptable": [],
                  "nonAcceptable": []
                },
                {
                  "name": "Wiper nozzle missing/not working",
                  "type": "absolute",
                  "selected": false,
                  "acceptable": [],
                  "nonAcceptable": []
                }
              ],
              "noImperfectionChoices": [
                { "name": "OK / No Imperfection", "type": "ok" }
              ],
              "refurbishment": {
                "choices": ["Replace", "Repair", "Polish", "No Work"],
                "additionalParts": []
              },
              "pdi": {
                "images": { "minCount": 0, "maxCount": 10 },
                "videos": { "minCount": 0, "maxCount": 1 }
              },
              "qa": { "top": false },
              "hints": {
                "tabular": [
                  ["broken", ">2 fin", "replace"],
                  ["broken", ">2 fin", "replace"]
                ]
              }
            }
          ]
        },
        {
          "subcategory": "Grill",
          "checkpoints": [
            {
              "key": "Exterior + Tyres + Grill",
              "title": "Grill",
              "images": { "minCount": 1, "maxCount": 10 },
              "videos": { "minCount": 0, "maxCount": 1 },
              "category": "Exterior + Tyres",
              "subCategory": "Grill",
              "prepopulate": [],
              "choices": [
                {
                  "name": "Broken",
                  "type": "absolute",
                  "selected": false,
                  "acceptable": [],
                  "nonAcceptable": []
                },
                {
                  "name": "Rusted",
                  "type": "absolute",
                  "selected": false,
                  "acceptable": [],
                  "nonAcceptable": []
                },
                {
                  "name": "Missing",
                  "type": "absolute",
                  "selected": false,
                  "acceptable": [],
                  "nonAcceptable": []
                }
              ],
              "noImperfectionChoices": [
                { "name": "OK / No Imperfection", "type": "ok" }
              ],
              "refurbishment": {
                "choices": ["Repair", "Replace", "No Work"],
                "additionalParts": []
              },
              "pdi": {
                "images": { "minCount": 0, "maxCount": 10 },
                "videos": { "minCount": 0, "maxCount": 1 }
              },
              "qa": { "top": false },
              "hints": {
                "tabular": [
                  ["Faded", "Faded", "Green"],
                  ["Scratched", "<4 Nos and multiple Scratches", "Green"],
                  ["Scratched", ">4 Nos and multiple paint peel off", "Red"],
                  ["Dented", "Dented", "Green"],
                  ["Motor Not Working", "Not working", "Red"],
                  ["Cover broken", "Broken", "Red"],
                  ["Cover missing", "Missing", "Red"],
                  ["Light broken/not working", "Broken", "Red"],
                  ["Part alignment not proper", "alignment not proper", "Red"]
                ]
              }
            }
          ]
        },
        {
          "subcategory": "Pillar",
          "checkpoints": [
            {
              "key": "Exterior + Tyres + Pillar + RHS B",
              "title": "Pillar - RHS B",
              "images": { "minCount": 1, "maxCount": 10 },
              "videos": { "minCount": 0, "maxCount": 1 },
              "category": "Exterior + Tyres",
              "subCategory": "Pillar",
              "prepopulate": [],
              "choices": [
                {
                  "name": "Faded",
                  "type": "absolute",
                  "selected": false,
                  "acceptable": [],
                  "nonAcceptable": []
                },
                {
                  "name": "Scratched",
                  "type": "relative",
                  "selected": false,
                  "acceptable": [
                    "Scratches <= 2 inches (no paint peel off/rusting)",
                    "Scratches not visible from 2 feet."
                  ],
                  "nonAcceptable": ["> 2 inch", "no paint peel off/rusting"]
                },
                {
                  "name": "Dented",
                  "type": "relative",
                  "selected": false,
                  "acceptable": ["Dent <= 1 inch(no paint peel off/rusting)"],
                  "nonAcceptable": ["> 1 inch", "no paint peel off/rusting"]
                },
                {
                  "name": "Rusted",
                  "type": "absolute",
                  "selected": false,
                  "acceptable": [],
                  "nonAcceptable": []
                },
                {
                  "name": "Cover Broken",
                  "type": "absolute",
                  "selected": false,
                  "acceptable": [],
                  "nonAcceptable": []
                },
                {
                  "name": "Cover Missing",
                  "type": "absolute",
                  "selected": false,
                  "acceptable": [],
                  "nonAcceptable": []
                }
              ],
              "noImperfectionChoices": [
                { "name": "OK / No Imperfection", "type": "ok" }
              ],
              "refurbishment": {
                "choices": [
                  "Repair",
                  "Replace",
                  "Dent",
                  "Partial Dent",
                  "Rubbing Polishing",
                  "Repaint"
                ],
                "additionalParts": []
              },
              "pdi": {
                "images": { "minCount": 0, "maxCount": 10 },
                "videos": { "minCount": 0, "maxCount": 1 }
              },
              "qa": { "top": false },
              "hints": {
                "tabular": [
                  ["Faded", "Faded", "Red"],
                  ["Scratched", "Scratched", "Green"],
                  ["Dented", "Dented", "Green"],
                  ["Rusted", "Rust >1 inch", "TBD"],
                  ["Rusted", "Rust <1 inch", "Green"],
                  ["Cover Broken", "Broken", "Yellow"],
                  ["Cover Missing", "Missing", "Yellow"]
                ]
              }
            }
          ]
        }
      ],
      "order": 0
    },
    {
      "category": "AC",
      "subCategories": [
        {
          "subcategory": "Cooling Fan",
          "checkpoints": [
            {
              "key": "AC + Cooling Fan",
              "title": "Cooling Fan",
              "images": { "minCount": 1, "maxCount": 10 },
              "videos": { "minCount": 0, "maxCount": 1 },
              "category": "AC",
              "subCategory": "Cooling Fan",
              "prepopulate": [
                { "from": "FULFILLMENT_CENTER", "to": "FULFILLMENT_CENTER" }
              ],
              "choices": [
                {
                  "name": "Wiring damage",
                  "type": "absolute",
                  "selected": false,
                  "acceptable": [],
                  "nonAcceptable": []
                },
                {
                  "name": "Bearing damage",
                  "type": "absolute",
                  "selected": false,
                  "acceptable": [],
                  "nonAcceptable": []
                },
                {
                  "name": "Fan support damage",
                  "type": "absolute",
                  "selected": false,
                  "acceptable": [],
                  "nonAcceptable": []
                },
                {
                  "name": "Blade damage",
                  "type": "absolute",
                  "selected": false,
                  "acceptable": [],
                  "nonAcceptable": []
                },
                {
                  "name": "Not working",
                  "type": "absolute",
                  "selected": false,
                  "acceptable": [],
                  "nonAcceptable": []
                }
              ],
              "noImperfectionChoices": [
                { "name": "OK / No Imperfection", "type": "ok" }
              ],
              "refurbishment": {
                "choices": ["Repair", "Replace", "Clean", "No Work"],
                "additionalParts": []
              },
              "pdi": {
                "images": { "minCount": 0, "maxCount": 10 },
                "videos": { "minCount": 0, "maxCount": 1 }
              },
              "qa": { "top": false }
            }
          ]
        }
      ],
      "order": 0
    },
    {
      "category": "Lights",
      "subCategories": [
        {
          "subcategory": "Fog Light",
          "checkpoints": [
            {
              "key": "Lights + Fog Light + Rear",
              "title": "Fog Light - Rear",
              "images": { "minCount": 1, "maxCount": 10 },
              "videos": { "minCount": 0, "maxCount": 1 },
              "category": "Lights",
              "subCategory": "Fog Light",
              "prepopulate": [
                { "from": "FULFILLMENT_CENTER", "to": "FULFILLMENT_CENTER" }
              ],
              "choices": [
                {
                  "name": "Broken",
                  "type": "absolute",
                  "selected": false,
                  "acceptable": [],
                  "nonAcceptable": []
                },
                {
                  "name": "Scratched",
                  "type": "relative",
                  "selected": false,
                  "acceptable": ["Scratched"],
                  "nonAcceptable": ["Others"]
                },
                {
                  "name": "Bulb Fused",
                  "type": "absolute",
                  "selected": false,
                  "acceptable": [],
                  "nonAcceptable": []
                },
                {
                  "name": "Bulb broken",
                  "type": "absolute",
                  "selected": false,
                  "acceptable": [],
                  "nonAcceptable": []
                },
                {
                  "name": "Fading",
                  "type": "absolute",
                  "selected": false,
                  "acceptable": [],
                  "nonAcceptable": []
                }
              ],
              "noImperfectionChoices": [
                { "name": "Not Applicable", "type": "NA" },
                { "name": "OK / No Imperfection", "type": "ok" }
              ],
              "refurbishment": {
                "choices": ["Replace", "Buffing", "Repair", "No Work"],
                "additionalParts": []
              },
              "pdi": {
                "images": { "minCount": 0, "maxCount": 10 },
                "videos": { "minCount": 0, "maxCount": 1 }
              },
              "qa": { "top": false },
              "hints": {
                "tabular": [
                  ["broken", ">2 fin", "replace"],
                  ["broken", ">2 fin", "replace"]
                ]
              }
            }
          ]
        }
      ],
      "order": 0
    }
  ],
  "qaTopImages": [],
  "schemaVersion": "IN_CAR_CATALOG_V4"
}


*/
