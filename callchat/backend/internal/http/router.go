package http

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/yancordeiro/callchat/backend/internal/auth"
	"github.com/yancordeiro/callchat/backend/internal/users"
)

func SetupRouter(db *pgxpool.Pool) *gin.Engine {
	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	})

	// Initialize repositories and services
	userRepo := users.NewRepository(db)
	userService := users.NewService(userRepo)
	usersHandler := users.NewHandler(userService)

	v1 := r.Group("/v1")
	{
		v1.GET("/health", healthHandler)

		// Auth routes (public)
		authGroup := v1.Group("/auth")
		{
			authGroup.POST("/register", usersHandler.Register)
			authGroup.POST("/login", usersHandler.Login)
		}

		// User routes (protected)
		usersGroup := v1.Group("/users")
		usersGroup.Use(auth.AuthRequired())
		{
			usersGroup.GET("/me", usersHandler.GetMe)
			usersGroup.GET("/search", usersHandler.SearchUsers)
		}
	}

	return r
}

func healthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}
