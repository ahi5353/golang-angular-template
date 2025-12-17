package main

import (
	"io/fs"
	"mime"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"example.com/m/v2/database"
	"example.com/m/v2/handlers"
	"example.com/m/v2/middleware"
	"github.com/gin-gonic/gin"
)

// NOTE: In production you may want to use //go:embed to embed the frontend
// into the binary. For development (when frontend/dist may not exist at
// build time) prefer serving the built files from the filesystem.

func main() {
	database.InitDB()
	r := gin.Default()

	// API routes
	api := r.Group("/api")
	{
		api.GET("/initial-route", handlers.InitialRoute)
		api.POST("/register", handlers.Register)
		api.POST("/login", handlers.Login)
		api.POST("/logout", handlers.Logout)
		authorized := api.Group("/")
		authorized.Use(middleware.AuthMiddleware())
		{
			authorized.GET("/user", handlers.GetUser)
			authorized.GET("/users", handlers.GetUsers)
			authorized.POST("/users", handlers.CreateUser)
			authorized.DELETE("/users/:id", handlers.DeleteUser)
		}
	}

	// Serve the frontend: prefer ../frontend/dist/browser (when running from
	// backend/). If not found, try ./dist/browser. If neither exists, requests
	// for non-API routes return 404 with a helpful message.
	var staticFiles fs.FS
	if _, err := os.Stat("../frontend/dist/browser"); err == nil {
		staticFiles = os.DirFS("../frontend/dist/browser")
	} else if _, err := os.Stat("./dist/browser"); err == nil {
		staticFiles = os.DirFS("./dist/browser")
	} else {
		staticFiles = nil
	}

	if staticFiles == nil {
		r.Use(func(c *gin.Context) {
			if strings.HasPrefix(c.Request.URL.Path, "/api") {
				c.Next()
				return
			}
			c.String(http.StatusNotFound, "frontend not built; run the frontend build (see frontend/README.md)")
			c.Abort()
		})
	} else {
		r.Use(func(c *gin.Context) {
			if strings.HasPrefix(c.Request.URL.Path, "/api") {
				c.Next()
				return
			}

			filePath := strings.TrimLeft(c.Request.URL.Path, "/")
			if filePath == "" {
				filePath = "index.html"
			}

			fileContent, err := fs.ReadFile(staticFiles, filePath)
			if err != nil {
				// If file not found, serve index.html for client-side routing
				filePath = "index.html"
				fileContent, err = fs.ReadFile(staticFiles, filePath)
				if err != nil {
					// If index.html is also not found, return 404
					c.String(http.StatusNotFound, "not found")
					return
				}
			}

			// Determine the content type based on the file extension
			contentType := mime.TypeByExtension(filepath.Ext(filePath))
			if contentType == "" {
				contentType = "application/octet-stream"
			}

			c.Data(http.StatusOK, contentType, fileContent)
			c.Abort()
		})
	}

	r.Run(":8080") // listen and serve on 0.0.0.0:8080
}
