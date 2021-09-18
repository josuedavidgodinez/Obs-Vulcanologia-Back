"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusCode = void 0;
var statusCode;
(function (statusCode) {
    statusCode[statusCode["ok"] = 200] = "ok";
    statusCode[statusCode["created"] = 201] = "created";
    statusCode[statusCode["accepted"] = 202] = "accepted";
    statusCode[statusCode["nonAuthoritativeInformation"] = 203] = "nonAuthoritativeInformation";
    statusCode[statusCode["noContent"] = 204] = "noContent";
    statusCode[statusCode["resetContent"] = 205] = "resetContent";
    statusCode[statusCode["partialContent"] = 206] = "partialContent";
    statusCode[statusCode["badRequest"] = 400] = "badRequest";
    statusCode[statusCode["unauthorized"] = 401] = "unauthorized";
    statusCode[statusCode["forbidden"] = 403] = "forbidden";
    statusCode[statusCode["notFound"] = 404] = "notFound";
    statusCode[statusCode["methodNotAllowed"] = 405] = "methodNotAllowed";
    statusCode[statusCode["notAcceptable"] = 406] = "notAcceptable";
    statusCode[statusCode["requestTimeout"] = 408] = "requestTimeout";
    statusCode[statusCode["conflict"] = 409] = "conflict";
    statusCode[statusCode["ImaTeapot"] = 418] = "ImaTeapot";
})(statusCode = exports.statusCode || (exports.statusCode = {}));
;
//# sourceMappingURL=statusCode.js.map