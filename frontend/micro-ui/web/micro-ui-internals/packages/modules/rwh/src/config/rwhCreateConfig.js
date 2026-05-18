export const newConfig = [
  {
    head: "",
    body: [
      {
        type: "component",
        component: "RwhCustomerDetailsComponent",
        withoutLabel: true,
        key: "customerDetails",
      },
      {
        type: "component",
        component: "RwhLocation",
        texts: {
          headerCaption: "",
          header: "PT_LOCATION_DETAILS",
          cardText: "",
          submitBarLabel: "PT_COMMONS_NEXT",
        },
        withoutLabel: true,
        key: "location",
      },
    ],
  },
  {
    head: "RWH_PROPERTY_WATER_CONNECTION",
    body: [
      {
        type: "component",
        component: "RwhPropertyWaterConnection",
        texts: {
          headerCaption: "",
          header: "PT_PROPERTY_WATER_CONNECTION",
          cardText: "",
          submitBarLabel: "PT_COMMONS_NEXT",
        },
        withoutLabel: true,
        key: "propertyDetails",
      },
    ],
  },
  {
    head: "RWH_SIZE_OF_PIT",
    body: [
      {
        type: "component",
        component: "RwhSizeOfPit",
        texts: {
          headerCaption: "",
          header: "RWH_SIZE_OF_PIT",
          cardText: "",
          submitBarLabel: "PT_COMMONS_NEXT",
        },
        withoutLabel: true,
        key: "sizeOfPit",
      },
    ],
  },
  {
    head: "RWH_DOCUMENTS",
    body: [
      {
        type: "component",
        component: "RwhUploadDocuments",
        withoutLabel: true,
        key: "documents",
      },
    ],
  },
  {
    head: "RWH_DECLARATION",
    body: [
      {
        type: "component",
        component: "RwhDeclaration",
        withoutLabel: true,
        key: "declaration",
      },
    ],
  },
];
