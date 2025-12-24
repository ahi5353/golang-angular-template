package handlers

import (
	"database/sql"
	"net/http"

	"example.com/m/v2/database"
	"example.com/m/v2/models"
	"github.com/gin-gonic/gin"
)

func GetSettings(c *gin.Context) {
	row := database.DB.QueryRow("SELECT value FROM system_settings WHERE key = ?", "theme_primary_color")
	var color string
	err := row.Scan(&color)
	if err != nil {
		if err == sql.ErrNoRows {
			// Default color if not set
			c.JSON(http.StatusOK, models.ThemeSettings{PrimaryColor: ""})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch settings"})
		return
	}

	c.JSON(http.StatusOK, models.ThemeSettings{PrimaryColor: color})
}

func UpdateSettings(c *gin.Context) {
	var settings models.ThemeSettings
	if err := c.ShouldBindJSON(&settings); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	_, err := database.DB.Exec("INSERT INTO system_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value", "theme_primary_color", settings.PrimaryColor)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update settings"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Settings updated successfully"})
}
