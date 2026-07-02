package com.joblink.user.controller;

import com.joblink.user.dto.AuthResponse;
import com.joblink.user.dto.LoginRequest;
import com.joblink.user.dto.RegisterRequest;
import com.joblink.user.entity.User;
import com.joblink.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	private UserService userService;

	@PostMapping("/register")
	public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
		User user = userService.register(request);
		return ResponseEntity.ok(user);
	}

	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
		AuthResponse response = userService.login(request);
		return ResponseEntity.ok(response);
	}
}