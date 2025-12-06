package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"example.com/m/v2/auth"
	"example.com/m/v2/database"
	"example.com/m/v2/models"
)

func GetUsers(c *gin.Context) {
	rows, err := database.DB.Query("SELECT id, username FROM users")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var user models.User
		if err := rows.Scan(&user.ID, &user.Username); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
			return
		}
		users = append(users, user)
	}

	c.JSON(http.StatusOK, users)
}

func CreateUser(c *gin.Context) {
	var json struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	hashedPassword, err := auth.HashPassword(json.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	result, err := database.DB.Exec("INSERT INTO users (username, password_hash) VALUES (?, ?)", json.Username, hashedPassword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Username may already be taken"})
		return
	}

	id, _ := result.LastInsertId()
	createdUser := models.User{
		ID:       id,
		Username: json.Username,
	}

	c.JSON(http.StatusOK, createdUser)
}
