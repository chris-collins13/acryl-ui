export interface Field {
  fieldPath: string;
  type: string;
  tags?: string[];
  description?: string;
}

export const schemaA: Field[] = [
  {
    fieldPath: "item_info",
    type: "Struct",
    tags: ["Item"],
  },
  {
    fieldPath: "item_info.item_name",
    type: "String",
    description: "The name of the item",
  },
  {
    fieldPath: "item_info.item_description",
    type: "String",
    description: "The description of the item",
  },
  {
    fieldPath: "shipment_info",
    type: "Struct",
  },
  {
    fieldPath: "shipment_info.destination",
    type: "Struct",
    description: "metadata about the destination of shipment",
  },
  {
    fieldPath: "shipment_info.destination.name",
    type: "String",
  },
  {
    fieldPath: "shipment_info.destination.geo_info",
    type: "Struct",
  },
  {
    fieldPath: "shipment_info.destination.geo_info.lat",
    type: "Number",
    tags: ["Latitude"],
  },
  {
    fieldPath: "shipment_info.destination.geo_info.lng",
    type: "Number",
    tags: ["Longitude"],
  },
  {
    fieldPath: "shipment_info.destination.metadata",
    type: "Struct",
  },
  {
    fieldPath: "shipment_info.destination.metadata.properties",
    type: "String",
  },
  {
    fieldPath: "shipment_info.destination.payment_info",
    type: "String",
    tags: ["Payment"],
  },
  {
    fieldPath: "shipment_info.destination.payment_info.price",
    type: "Number",
  },
  {
    fieldPath: "shipment_info.destination.payment_info.currency",
    type: "String",
  },
];

export const schemaB = [
  {
    fieldPath: "item_info",
    type: "Struct",
    tags: ["Item"],
  },
  {
    fieldPath: "item_info.item_name",
    type: "String",
    description: "The name of the item",
  },
  {
    fieldPath: "item_info.item_description",
    type: "String",
    description: "The description of the item",
  },
  {
    fieldPath: "shipment_info",
    type: "Struct",
  },
  {
    fieldPath: "shipment_info.source",
    type: "Struct",
    description: "metadata about the source of shipment",
  },
  {
    fieldPath: "shipment_info.source.name",
    type: "String",
  },
  {
    fieldPath: "shipment_info.source.metadata",
    type: "Struct",
  },
  {
    fieldPath: "shipment_info.source.metadata.properties",
    type: "String",
  },
  {
    fieldPath: "shipment_info.destination",
    type: "Struct",
    description: "metadata about the destination of shipment",
  },
  {
    fieldPath: "shipment_info.destination.name",
    type: "String",
  },
  {
    fieldPath: "shipment_info.destination.metadata",
    type: "Struct",
  },
  {
    fieldPath: "shipment_info.destination.metadata.properties",
    type: "String",
  },
  {
    fieldPath: "shipment_info.destination.payment_info",
    type: "String",
    tags: ["Payment"],
  },
  {
    fieldPath: "shipment_info.destination.payment_info.price",
    type: "Number",
  },
  {
    fieldPath: "shipment_info.destination.payment_info.currency",
    type: "String",
  },
];
