"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRoutes = void 0;
const express_1 = require("express");
exports.uploadRoutes = (0, express_1.Router)();
exports.uploadRoutes.post("/post", (req, res) => {
    res.status(200).json({
        success: true,
        message: "File uploaded successfully"
    });
});
