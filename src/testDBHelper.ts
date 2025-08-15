import useSQLiteDB from "./utils/useSqliteDB";

const { toggleDBConnection } = useSQLiteDB();

export const seedDB = async () => {
  //   const selectQuery = await (window as any).dbConnection.current.query(
  //     `SELECT * FROM userPreferencesTable`
  //   );

  //   return selectQuery;
  const db = (window as any).dbConnection.current;
  await toggleDBConnection("open");
};
