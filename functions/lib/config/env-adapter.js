"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const functions = __importStar(require("firebase-functions"));
// Adapter para simular process.env con Firebase Config
class EnvironmentAdapter {
    get FIREBASE_PROJECT_ID() {
        var _a;
        return ((_a = functions.config().firebase) === null || _a === void 0 ? void 0 : _a.project_id) || process.env.FIREBASE_PROJECT_ID || '';
    }
    get FIREBASE_CLIENT_EMAIL() {
        var _a;
        return ((_a = functions.config().firebase) === null || _a === void 0 ? void 0 : _a.client_email) || process.env.FIREBASE_CLIENT_EMAIL || '';
    }
    get FIREBASE_PRIVATE_KEY() {
        var _a;
        return ((_a = functions.config().firebase) === null || _a === void 0 ? void 0 : _a.private_key) || process.env.FIREBASE_PRIVATE_KEY || '';
    }
    get NODE_ENV() {
        var _a;
        return ((_a = functions.config().node) === null || _a === void 0 ? void 0 : _a.env) || process.env.NODE_ENV || 'development';
    }
    get JWT_SECRET() {
        var _a;
        return ((_a = functions.config().jwt) === null || _a === void 0 ? void 0 : _a.secret) || process.env.JWT_SECRET || '';
    }
    get JWT_EXPIRES_IN() {
        var _a;
        return ((_a = functions.config().jwt) === null || _a === void 0 ? void 0 : _a.expires_in) || process.env.JWT_EXPIRES_IN || '24h';
    }
}
// Exportar como si fuera process.env
exports.env = new EnvironmentAdapter();
//# sourceMappingURL=env-adapter.js.map