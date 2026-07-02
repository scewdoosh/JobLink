package com.joblink.user.service;

import com.joblink.user.config.JwtUtil;
import com.joblink.user.dto.AuthResponse;
import com.joblink.user.dto.LoginRequest;
import com.joblink.user.dto.RegisterRequest;
import com.joblink.user.entity.User;
import com.joblink.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JwtUtil jwtUtil;

	public User register(RegisterRequest request) {
		if (userRepository.existsByEmail(request.getEmail())) {
			throw new RuntimeException("Email already exists");
		}
		User user = new User(request.getName(), request.getEmail(), passwordEncoder.encode(request.getPassword()),
				User.Role.valueOf(request.getRole().toUpperCase()), User.Provider.LOCAL);
		return userRepository.save(user);
	}

	public AuthResponse login(LoginRequest request) {
		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new RuntimeException("User not found"));
		if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
			throw new RuntimeException("Invalid password");
		}
		String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
		return new AuthResponse(token, user.getRole().name(), user.getEmail());
	}
}