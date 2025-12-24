package models

type SystemSetting struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

type ThemeSettings struct {
	PrimaryColor string `json:"primaryColor"`
}
