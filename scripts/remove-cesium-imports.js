const { readFileSync, writeFileSync } = require("fs");

const filePath = "node_modules/cesium/Source/Core/Resource.js";

const file = readFileSync(filePath);

const newFile = file.toString().replace(
  /function loadWithHttpRequest(.|\s){1947}/,
  `function loadWithHttpRequest(
  url,
  responseType,
  method,
  data,
  headers,
  deferred,
  overrideMimeType
) {
  // overrided by scripts/remove-cesium-imports.js in order to use types in cesium
}
`
);

writeFileSync(filePath, newFile);
