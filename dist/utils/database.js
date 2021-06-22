"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
exports.sequelize = new sequelize_1.Sequelize('desarrol_cursvideos', 'desarrol_root', '1029384756.bds', {
    dialect: 'mysql',
    host: '51.81.229.13',
    define: {
        timestamps: true
    }
});
