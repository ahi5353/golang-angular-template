package handlers

import (
	"database/sql"
	"net/http"

	"example.com/m/v2/database"
	"example.com/m/v2/models"
	"github.com/gin-gonic/gin"
)

func GetSettings(c *gin.Context) {
	var value string
	err := database.DB.QueryRow("SELECT value FROM system_settings WHERE key = ?", "theme_color").Scan(&value)
	if err != nil {
		if err == sql.ErrNoRows {
			// Return default color if not set
			c.JSON(http.StatusOK, models.SettingsResponse{ThemeColor: "#3f51b5"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch settings"})
		return
	}

	c.JSON(http.StatusOK, models.SettingsResponse{ThemeColor: value})
}

func UpdateSettings(c *gin.Context) {
	var req models.SettingsUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := database.DB.Exec("INSERT INTO system_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value", "theme_color", req.ThemeColor)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update settings"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "updated"})
}
