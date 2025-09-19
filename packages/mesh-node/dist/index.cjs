"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_multicast_dns = __toESM(require("multicast-dns"), 1);
var import_http = __toESM(require("http"), 1);
var import_fs = require("fs");
var capsDir = process.env.CAPSULE_DIR || "./capsules";
var server = import_http.default.createServer((req, res) => {
  if (req.url === "/capsules") {
    const files = (0, import_fs.readdirSync)(capsDir).filter((f) => f.endsWith(".caps"));
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(files));
  } else if (req.url?.startsWith("/capsule/")) {
    const name = decodeURIComponent(req.url.split("/capsule/")[1]);
    const buf = (0, import_fs.readFileSync)(`${capsDir}/${name}`);
    res.setHeader("Content-Type", "application/octet-stream");
    res.end(buf);
  } else {
    res.statusCode = 404;
    res.end();
  }
});
server.listen(7423);
var md = (0, import_multicast_dns.default)();
setInterval(() => {
  md.respond({ answers: [{ name: "_oursynth._tcp.local", type: "SRV", data: { port: 7423, target: "mesh.local" } }] });
}, 2e3);
