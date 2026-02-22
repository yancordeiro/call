package users

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/yancordeiro/callchat/backend/internal/auth"
)

type Service struct {
	repo Repository
}

func NewService(repo Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) Register(ctx context.Context, username, email, password string) (*User, error) {
	// Check if user already exists
	existingUser, err := s.repo.GetByEmail(ctx, email)
	if err != nil && !errors.Is(err, pgx.ErrNoRows) {
		return nil, err
	}
	if existingUser != nil {
		return nil, errors.New("user with this email already exists")
	}

	// Check if username is taken
	existingUser, err = s.repo.GetByUsername(ctx, username)
	if err != nil && !errors.Is(err, pgx.ErrNoRows) {
		return nil, err
	}
	if existingUser != nil {
		return nil, errors.New("username already taken")
	}

	// Hash password
	hashedPassword, err := auth.HashPassword(password)
	if err != nil {
		return nil, err
	}

	// Create user
	user := &User{
		Username:     username,
		Email:        email,
		PasswordHash: hashedPassword,
	}

	err = s.repo.Create(ctx, user)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *Service) Login(ctx context.Context, email, password string) (*User, error) {
	user, err := s.repo.GetByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.New("invalid email or password")
		}
		return nil, err
	}

	// Compare password
	err = auth.ComparePassword(user.PasswordHash, password)
	if err != nil {
		return nil, errors.New("invalid email or password")
	}

	return user, nil
}

func (s *Service) GetByID(ctx context.Context, id string) (*User, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *Service) SearchByUsername(ctx context.Context, query string) ([]*User, error) {
	return s.repo.SearchByUsername(ctx, query)
}
