package main

import (
	"embed"
	"io/fs"
	"mime"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
)

//go:embed all:dist
var dist embed.FS

func main() {
	r := gin.Default()

	// API routes
	api := r.Group("/api")
	{
		api.GET("/ping", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"message": "pong",
			})
		})
	}

	// Serve the frontend
	staticFiles, err := fs.Sub(dist, "dist/browser")
	if err != nil {
		panic(err)
	}

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

	r.Run(":8080") // listen and serve on 0.0.0.0:8080
}
