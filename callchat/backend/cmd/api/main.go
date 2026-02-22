package main

import (
	"log"
	"os"

	"github.com/yancordeiro/callchat/backend/internal/database"
	"github.com/yancordeiro/callchat/backend/internal/http"
)

func main() {
	// Get database URL from environment
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatal("DATABASE_URL environment variable is required")
	}

	// Run migrations
	if err := database.RunMigrations(databaseURL); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	// Initialize database connection pool
	db := database.NewConnection()
	defer db.Close()

	log.Println("Database connected successfully")

	// Setup router with database connection
	r := http.SetupRouter(db)

	// Start server
	log.Println("Server starting on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
