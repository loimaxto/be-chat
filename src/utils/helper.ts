import { JsonObject } from "@prisma/client/runtime/library";

export function flattenJson(data: object): Record<string, any> {
  const result: Record<string, any> = {};

  function recurse(current: any, prop: string) {
    if (Object(current) !== current) {
      result[prop] = current;
    } else if (Array.isArray(current)) {
      for (let i = 0, l = current.length; i < l; i++) {
        recurse(current[i], prop ? `${prop}.${i}` : `${i}`);
      }
      if (current.length === 0) {
        result[prop] = [];
      }
    } else {
      let isEmpty = true;
      for (let p in current) {
        isEmpty = false;
        recurse(current[p], prop ? `${prop}.${p}` : p);
      }
      if (isEmpty) {
        result[prop] = {};
      }
    }
  }

  recurse(data, "");
  return result;
}