package models

type SettingsUpdateRequest struct {
	ThemeColor string `json:"theme_color" binding:"required"`
}

type SettingsResponse struct {
	ThemeColor string `json:"theme_color"`
}
