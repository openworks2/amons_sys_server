"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var queryConfig = {
    findByAll: function (table) {
        var query = "SELECT * FROM " + table + ";";
        return query;
    },
    findByField: function (table, field) {
        if (field === void 0) { field = "id"; }
        var query = "SELECT * FROM " + table + " WHERE `" + field + "`=?;";
        return query;
    },
    findByFieldAtOrder: function (table, field, orderField, type) {
        if (field === void 0) { field = "id"; }
        if (orderField === void 0) { orderField = "id"; }
        if (type === void 0) { type = "DESC"; }
        var query = "SELECT * FROM " + table + " WHERE `" + field + "=? ORDER BY `" + orderField + "` " + type + ";";
        return query;
    },
    insert: function (table) {
        var query = "INSERT INTO " + table + " SET ?;";
        return query;
    },
    update: function (table, field) {
        if (field === void 0) { field = "id"; }
        var query = "UPDATE " + table + " SET ? WHERE `" + field + "`=?;";
        return query;
    },
    delete: function (table, field) {
        if (field === void 0) { field = "id"; }
        var query = "DELETE FROM " + table + " WHERE `" + field + "`=?;";
        return query;
    },
    doubleCheck: function () {
        var query = "SELECT COUNT(*) AS count FROM tb_account  WHERE acc_user_id=?;";
        return query;
    },
};
exports.default = queryConfig;
