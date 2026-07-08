package com.joblink.user.controller;

import com.joblink.user.dto.UserSummaryResponse;
import com.joblink.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

	@Autowired
	private UserRepository userRepository;

	@GetMapping("/{id}")
	public ResponseEntity<UserSummaryResponse> getUserById(@PathVariable String id) {
		return userRepository.findById(id)
				.map(user -> new UserSummaryResponse(user.getId(), user.getName(), user.getEmail()))
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}
}
