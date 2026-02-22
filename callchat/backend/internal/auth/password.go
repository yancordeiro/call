package auth

import (
	"golang.org/x/crypto/bcrypt"
)

const bcryptCost = 12

// HashPassword hashes a password using bcrypt with cost factor 12
func HashPassword(password string) (string, error) {
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), bcryptCost)
	if err != nil {
		return "", err
	}
	return string(hashedBytes), nil
}

// ComparePassword compares a hashed password with a plain text password
func ComparePassword(hashedPassword, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}
