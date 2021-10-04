let BASE_INVENTORY_URL = "https://b2c-inventory.qac24svc.dev";
let BASE_MASTERDATA_URL = "https://b2c-masterdata.qac24svc.dev";
let KEY="AIzaSyBLK_8EJQCxPVEf2p8UzctCI5CKLwaNedQ";
let BASE_BULK_UPLOAD = "https://bulk-upload-service.qac24svc.dev";
let BASE_CATALOG_URL = "https://refurbishment-service.qac24svc.dev";
const currentEnv = process.env.REACT_APP_ENV;
switch (currentEnv) {
  case "qa":
    BASE_INVENTORY_URL = "https://b2c-inventory.qac24svc.dev";
    BASE_MASTERDATA_URL = "https://b2c-masterdata.qac24svc.dev";
    KEY = "AIzaSyBLK_8EJQCxPVEf2p8UzctCI5CKLwaNedQ"
    BASE_BULK_UPLOAD = "https://bulk-upload-service.qac24svc.dev";
    BASE_CATALOG_URL = "https://refurbishment-service.qac24svc.dev";
    break;
  case "staging":
    BASE_INVENTORY_URL = "https://stage-b2c-inventory.qac24svc.dev";
    BASE_MASTERDATA_URL = "https://stage-b2c-masterdata.qac24svc.dev";
    KEY = "AIzaSyBLK_8EJQCxPVEf2p8UzctCI5CKLwaNedQ"
    BASE_BULK_UPLOAD = "https://stage-bulk-upload-service.qac24svc.dev"
    BASE_CATALOG_URL = "https://stage-refurbishment-service.qac24svc.dev";
    break;
  case "prod":
    BASE_INVENTORY_URL = "https://b2c-inventory.c24.tech";
    BASE_MASTERDATA_URL = "https://b2c-masterdata.c24.tech";
    KEY = "AIzaSyBLK_8EJQCxPVEf2p8UzctCI5CKLwaNedQ"
    BASE_BULK_UPLOAD = "https://bulk-upload-service.c24.tech";
    BASE_CATALOG_URL = "https://refurbishment-service.c24.tech";
    break;
  default:
    BASE_INVENTORY_URL = "https://b2c-inventory.qac24svc.dev";
    BASE_MASTERDATA_URL = "https://b2c-masterdata.qac24svc.dev";
    KEY = "AIzaSyBLK_8EJQCxPVEf2p8UzctCI5CKLwaNedQ"
    BASE_BULK_UPLOAD = "https://bulk-upload-service.qac24svc.dev";
    BASE_CATALOG_URL = "https://refurbishment-service.qac24svc.dev";
    break;

}

const BASE_INSPECTION_URL = (() => {

  const urls = {
      qa: "https://refurbishment-service.qac24svc.dev",
      staging: "https://stage-b2c-inspection-service.qac24svc.dev",
      prod: "https://refurbishment-service.c24.tech"
  };
  return urls[currentEnv] || "https://b2c-inspection-service.qac24svc.dev";
})();

export const config = {
  api: {
    inventory: {
      host: BASE_INVENTORY_URL,
      bulkHost: BASE_BULK_UPLOAD,
      api_version: "/api",
      inventory: "/inventory",
      inventoryCount: "/count",
      auditTrail: "/audit-log",
      movement: "/movement",
      inventoryMovement: "/inventory-movement",
      logistic: "/logistic",
      config: "/config",
      price: "/price",
      publishStatus: "/publish-status",
      uploadCsv: "/bulk-upload-csv",
      time_slots: "/time-slots",
      exportCSV: "/export/open-movement",
      upload: "/upload",
      updateMovement: "/movement-update",
      v2:"/v2",
      type:"?type=",
      status: "/status",
      statusCount: "/status/count",
      ui_rules: "/ui-rules",

    },
    masterdata: {
      host: BASE_MASTERDATA_URL,
      api_v1: "/api/v1",
      api_v2: "/api/v2",
      masterData: "/masterdata",
      storeLocation: "/location",
      make: "/make",
      bulk_csv: "/bulk-csv",
      city: "/city",
      state: "/state",
      zone: "/zone",
      count: "/count",
      pricing: "/pricing",
      service: "/service",
      placeType: "?placeType=LOCATION&placeCode=",
      c2c_zone:"/c2c-zones",
      region: '/region'
    },
    inspection: {
      host: BASE_INSPECTION_URL,
      inspection: '/inspection',
      inspectionCatalogSummary: "/catalog/summary",
      inspectionCatalogMaster: "/catalog/master",
      q: {
        appointmentId: "appointmentId",
        inspectionType: "inspectionType",
        version: "version",
      }
    },
    google:{
      googleKey:KEY
    },
    workshop:{
      host: BASE_CATALOG_URL,
      api_v1: "/api/v1",
      api_v2: "/api/v2",
      inspection:'/inspection',
      assign:'/assign',
      count:'/count',
      city: "/city",
      state: "/state",
      inspectionSummary:"/catalog/summary",
      placeType: "?placeType=LOCATION&placeCode=",
      estimates:"?inspectionType=CATALOG&inspectionStatus=DONE,REJECTED&sort=createdAt,asc",
      workorder:"?inspectionType=CATALOG&inspectionStatus=APPROVED&inventoryStatus=STOCK_IN&sort=createdAt,asc",
      inspectionTypeInspectionHistory:"?inspectionType=CATALOG&inspectionStatus=DONE,ESTIMATED,APPROVED,REJECTED&sort=createdAt,desc",
      inspectionType:"?inspectionType=CATALOG&inspectionStatus=ESTIMATED&locationType=SERVICE_CENTER&sort=createdAt,asc",//for production
      //inspectionTypeYard:"?inspectionType=CATALOG&inspectionStatus=ESTIMATED,QC_DONE&locationType=FULFILLMENT_CENTER&sort=createdAt,asc",//for production
      inspectionTypeYard:"?inspectionType=YARD&inspectionStatus=ESTIMATED,QC_DONE&sort=createdAt,asc&&additionalEstimatesPDI=false",//for QA, Added by HArsha
      c2c_zone:"/c2c-zones",
      region: '/region',
      catalog:"/catalog",
      master: "/master",
      summary: "/summary",
      carTagging:"/tag"

    }
  },
};
