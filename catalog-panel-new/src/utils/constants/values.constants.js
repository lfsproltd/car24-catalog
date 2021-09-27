// dont change position of values, if done check usage
let countryCheck = localStorage.getItem("country")
export const InventoryStatus = {
  BOUGHT: "Bought",
  STOCK_IN: "Stock In",
  STOCK_OUT: "Stock Out",
  STOCK_TRANSFER: "Stock Transfer",
};

export const InventoryStatusKeys = {
  BOUGHT: "BOUGHT",
  STOCK_IN: "STOCK_IN",
  STOCK_OUT: "STOCK_OUT",
  STOCK_TRANSFER: "STOCK_TRANSFER",
}

export const DriverStatus = {
  pending: "Pending",
  confirmed: "Confirmend",
  driver_assigned: "Driver Assigned",
  driver_on_way: "Driver On Way",
  running: "Running",
  done: "Done",
  cancelled: "Cancelled",
  rejected: "Rejected",
  disputed: "Disputed",
};
export const RequestStatus = {
  PENDING: "Pending",
  REQUESTED: "Requested",
  IN_TRANSIT: "In Transit",
  DONE: "Done",
  ACCEPTED: "Accepted",
  DENIED: "Denied",
  DRIVER_ASSIGNED: "Driver Assigned",
  DISPUTED: "Disputed"
};

export const LogisticManagementLabels = {
  PENDING: "Pending",
  DENIED: "Denied",
};

export const LocationType = {
  C2B_YARD: "C2B Yard",
  SERVICE_CENTER: "Service Center",
  CAR_STUDIO: "Studio",
  FULFILLMENT_CENTER: "Fulfillment Center",
};

export const LocationTypesKey = {
  FULFILLMENT_CENTER: 'FULFILLMENT_CENTER',
  CAR_STUDIO: 'CAR_STUDIO',
  SERVICE_CENTER: 'SERVICE_CENTER',
  C2B_YARD: 'C2B_YARD'
};

export const RequestTypes = [
  {
    requestType: 'Internal',
    key: 'INTERNAL'
  },
  {
    requestType: 'External',
    key: 'EXTERNAL'
  }
];

export const LocationType1 = {
  C2B_YARD: "C2B Yard",
  SERVICE_CENTER: "Service Center",
  CAR_STUDIO: "Studio",
  FULFILLMENT_CENTER: "Fulfillment Center",
};

export const DriverType = {
  DriveU: "DriveU",
  c24: "In House",
  C2B: "C2B",
  Offline: "Offline",
  Locus: "Locus"
};

export const AlertType = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
  NONE: "none",
};

export const ZoneTypes = {
  zone1: "Zone Type 1",
  zone2: "Zone Type 2",
};

export const placeType = {
  location: "LOCATION"
};


export const uploadType = {
  make: "make",
  model: "model",
  variant: "variant",
  inventory: "inventory",
  post_purchase: "Post Purchase",
  post_refurb: "Post Refurb"
}
export const ValidDateFormat = "dd/MM/yyyy";
export const AdditionalInventoryState = [
  "TRIP_END",
  "TRIP_START",
];

export const file_type = ".csv";

export const ErrorMessage = {
  unknown: "Something went wrong. Please try again.",
  status400: "Invalid data. Please check and try again."
};
export const Country = {
  IN: "IN",
  AE: "AE",
  AU: "AU"
}
export const Vehicle = {
  BIKE:"BIKE",
  CAR: "CAR"
}
export const ConfigType = {
  State_Transition_Rules: "state-transition-rules",
  Time_Slot_Properties: "time-slot-properties"
}
export const BulkUploadType = {
  inventory: "generic",
  post_purchase: "-post-purchase",
  post_refurb: countryCheck == "-post-refurb",
}
export const BulTypeInspection = "inspection-upload-"
export const BulkTypeInventory = "inventory-upload-"

export const LOCATION_POINT_DROPDOWN_LIST = [
  {key: 'homePickUp', value: 'Home pick-up'}, 
  {key: 'dropAtHub', value: 'Drop at hub'}
];

export const RETURN_FLOW = {
  CUSTOMER_RETURN_FLOW: 'CUSTOMER_RETURN_FLOW',
  INTERNAL_RETURN_FLOW: 'INTERNAL_RETURN_FLOW'
};

export const DATE_FORMAT = "yyyy-MM-dd";

export const CITIES_GROUP = ['CC_134', 'CC_5', 'CC_8791', 'CC_6', 'CC_132', 'CC_62', 'CC_1', 'CC_2', 'CC_3', 'CC_86', 'CC_134'];

export const STOCK_OUT_FLOW = {
  CUSTOMER_DELIVERY_FLOW: 'CUSTOMER_DELIVERY_FLOW',
  DIRECT_STOCK_OUT_FLOW: "DIRECT_STOCK_OUT_FLOW",
  C2B_DELIVERY_FLOW: "C2B_DELIVERY_FLOW",
  C2B_STOCK_OUT_FLOW: 'C2B_STOCK_OUT_FLOW'
};