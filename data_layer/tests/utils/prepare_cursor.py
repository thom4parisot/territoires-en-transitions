def prepare_cursor(cursor, sql: str):
    cursor.execute(sql)
    cursor.connection.commit()