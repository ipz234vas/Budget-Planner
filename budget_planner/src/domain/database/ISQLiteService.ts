import * as SQLite from 'expo-sqlite';

export interface ISQLiteService {
    getDatabase(): SQLite.SQLiteDatabase;
}