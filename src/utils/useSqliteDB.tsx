import { useEffect, useRef, useState } from "react";
import { DBConnectionStateType } from "./types";
import {
  SQLiteConnection,
  SQLiteDBConnection,
  CapacitorSQLite,
} from "@capacitor-community/sqlite";
import { seedDB } from "../testDBHelper";

const useSQLiteDB = () => {
  const sqliteConnection = useRef<SQLiteConnection>(); // This is the connection to the dbConnection
  const dbConnection = useRef<SQLiteDBConnection>(); // This is the connection to the database itself, will deal with READ/INSERT etc
  const [isDBInitialised, setIsDBInitialised] = useState<boolean>(false);

  useEffect(() => {
    const initialiseDB = async () => {
      try {
        if (sqliteConnection.current) return; // If sqliteConnection.current is not undefined or null it means the dbConnection has already been initalised so return out of the function

        sqliteConnection.current = new SQLiteConnection(CapacitorSQLite); // Create a new SQLiteConnection instance and assign it to sqliteConnection.current.
        const connectionConsistency =
          await sqliteConnection.current.checkConnectionsConsistency();

        const isConn = (
          await sqliteConnection.current.isConnection(
            "mytasbeehappdatabase",
            false
          )
        ).result; // The isConnection method checks if there is an existing connection

        if (connectionConsistency.result && isConn) {
          // Retrieve the existing connection to "mytasbeehappdatabase"
          dbConnection.current =
            await sqliteConnection.current.retrieveConnection(
              "mytasbeehappdatabase",
              false
            );
        } else {
          // If the dbConnection does not exist then create a new connection (additionally, if the "mytasbeehappdatabase" database does not exist, create it at the same time as establishing the new connection)

          dbConnection.current =
            await sqliteConnection.current.createConnection(
              "mytasbeehappdatabase",
              false,
              "no-encryption",
              1,
              false
            );
        }

        await initialiseTables();
        setIsDBInitialised(true);

        // @ts-ignore
        if (import.meta.env.MODE === "development") {
          (window as any).sqliteConnection = sqliteConnection;
          (window as any).dbConnection = dbConnection;
        }
      } catch (error) {
        console.error("Error initializing database: " + error);
      }
    };

    initialiseDB();
  }, []);

  async function toggleDBConnection(action: DBConnectionStateType) {
    try {
      if (!dbConnection || !dbConnection.current) {
        throw new Error();
      }

      const isDatabaseOpen = await dbConnection.current.isDBOpen();

      if (
        (action === "open" && isDatabaseOpen.result === true) ||
        (action === "close" && isDatabaseOpen.result === false)
      ) {
        return;
      }

      if (isDatabaseOpen.result === undefined) {
        throw new Error(
          "isDatabaseOpen.result is undefined within toggleDBConnection"
        );
      } else if (action === "open" && isDatabaseOpen.result === false) {
        await dbConnection.current.open();
        // console.log("DB CONNECTION OPENED");
      } else if (action === "close" && isDatabaseOpen.result === true) {
        await dbConnection.current.close();
        // console.log("DB CONNECTION CLOSED");
      } else {
        throw new Error(
          `Database is: ${isDatabaseOpen.result}, unable to ${action} database connection`
        );
      }
    } catch (error) {
      console.error("Error toggling DB connection,", error);
    }
  }

  // Check and update table structure here
  const initialiseTables = async () => {
    try {
      if (!dbConnection.current) {
        throw new Error(
          `Table not created/initialised within initialiseTables, dbConnection.current is ${dbConnection.current}`
        );
      }

      await toggleDBConnection("open");

      const counterDataTable = `
        CREATE TABLE IF NOT EXISTS counterDataTable(
        id INTEGER PRIMARY KEY NOT NULL,
        orderIndex INTEGER NOT NULL DEFAULT 0,
        name TEXT NOT NULL UNIQUE, 
        count INTEGER NOT NULL,
        target INTEGER NOT NULL, 
        color TEXT DEFAULT NULL,
        isActive INTEGER NOT NULL DEFAULT 0
        ) STRICT;
        `;

      const userPreferencesTable = `CREATE TABLE IF NOT EXISTS userPreferencesTable(
        preferenceName TEXT PRIMARY KEY NOT NULL, 
        preferenceValue TEXT NOT NULL DEFAULT ''
        ) STRICT`;

      await dbConnection.current.execute(counterDataTable);
      await dbConnection.current.execute(userPreferencesTable);

      // @ts-ignore
      if (import.meta.env.MODE === "development") {
        await seedDB();
      }
    } catch (error) {
      console.error(error);
    } finally {
      try {
        if (!dbConnection.current) {
          throw new Error(
            `Unable to close connection within initialiseTables, dbConnection.current is ${dbConnection.current}`
          );
        }

        const isDatabaseOpen = await dbConnection.current.isDBOpen();
        if (isDatabaseOpen.result) {
          await toggleDBConnection("close");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return {
    isDBInitialised,
    sqliteConnection,
    dbConnection,
    toggleDBConnection,
  };
};

export default useSQLiteDB;
