const queryConfig = {
  findByAll(table: string): string {
    const query = `SELECT * FROM ${table};`;
    return query;
  },
  findByField(table: string, field: string = "id"): string {
    const query = `SELECT * FROM ${table} WHERE \`${field}\`=?;`;
    return query;
  },
  findByFieldAtOrder(
    table: string,
    field: string = "id",
    orderField: string = "id",
    type: string = "DESC"
  ): string {
    const query = `SELECT * FROM ${table} WHERE \`${field}\=? ORDER BY \`${orderField}\` ${type};`;
    return query;
  },
  insert(table: string): string {
    const query = `INSERT INTO ${table} SET ?;`;
    return query;
  },
  update(table: string, field: string = "id"): string {
    const query = `UPDATE ${table} SET ? WHERE \`${field}\`=?;`;
    return query;
  },
  delete(table: string, field: string = "id"): string {
    const query = `DELETE FROM ${table} WHERE \`${field}\`=?;`;
    return query;
  },
  doubleCheck() {
    let query = `SELECT COUNT(*) AS count FROM tb_account  WHERE acc_user_id=?;`;
    return query;
  },
};

export default queryConfig;
