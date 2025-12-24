package database

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func InitDB() {
	var err error
	DB, err = sql.Open("sqlite3", "./sqlite.db")
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}

	createTableSQL := `CREATE TABLE IF NOT EXISTS users (
		"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
		"username" TEXT NOT NULL UNIQUE,
		"password_hash" TEXT NOT NULL
	);`

	_, err = DB.Exec(createTableSQL)
	if err != nil {
		log.Fatalf("Failed to create table: %v", err)
	}

	createSettingsTableSQL := `CREATE TABLE IF NOT EXISTS system_settings (
		"key" TEXT NOT NULL PRIMARY KEY,
		"value" TEXT NOT NULL
	);`

	_, err = DB.Exec(createSettingsTableSQL)
	if err != nil {
		log.Fatalf("Failed to create system_settings table: %v", err)
	}
}
