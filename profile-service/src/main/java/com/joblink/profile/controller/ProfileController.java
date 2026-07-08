package com.joblink.profile.controller;

import com.joblink.profile.dto.ProfileCompleteRequest;
import com.joblink.profile.dto.ProfileResponse;
import com.joblink.profile.entity.Education;
import com.joblink.profile.entity.Experience;
import com.joblink.profile.entity.Profile;
import com.joblink.profile.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

	@Autowired
	private ProfileService profileService;

	@PostMapping("/complete")
	public ResponseEntity<?> completeProfile(
			@RequestPart("profile") ProfileCompleteRequest request,
			@RequestPart("resume") MultipartFile resume,
			@RequestPart("profilePicture") MultipartFile profilePicture) {

		if (resume.isEmpty() || !"application/pdf".equals(resume.getContentType())) {
			return ResponseEntity.badRequest().body("Resume must be a PDF file");
		}
		if (profilePicture.isEmpty() || !profilePicture.getContentType().startsWith("image/")) {
			return ResponseEntity.badRequest().body("Profile picture must be an image file");
		}
		if (request.getEducations() == null || request.getEducations().isEmpty()) {
			return ResponseEntity.badRequest().body("At least one education entry is required");
		}

		return ResponseEntity.ok(profileService.completeProfile(request, resume, profilePicture));
	}

	@GetMapping("/{userId}")
	public ResponseEntity<ProfileResponse> getProfile(@PathVariable String userId) {
		return ResponseEntity.ok(profileService.getProfileByUserId(userId));
	}

	@GetMapping("/{userId}/resume")
	public ResponseEntity<byte[]> getResume(@PathVariable String userId) {
		Profile profile = profileService.getProfileEntityByUserId(userId);

		if (profile.getResumeFile() == null) {
			return ResponseEntity.notFound().build();
		}

		String filename = profile.getResumeFileName() != null ? profile.getResumeFileName() : "resume.pdf";

		return ResponseEntity.ok()
				.contentType(MediaType.APPLICATION_PDF)
				.header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
				.body(profile.getResumeFile());
	}

	@GetMapping("/{userId}/picture")
	public ResponseEntity<byte[]> getProfilePicture(@PathVariable String userId) {
		Profile profile = profileService.getProfileEntityByUserId(userId);

		if (profile.getProfilePicture() == null) {
			return ResponseEntity.notFound().build();
		}

		String contentType = profile.getProfilePictureType() != null ? profile.getProfilePictureType() : "image/jpeg";

		return ResponseEntity.ok()
				.contentType(MediaType.parseMediaType(contentType))
				.body(profile.getProfilePicture());
	}

	@GetMapping("/search")
	public ResponseEntity<List<ProfileResponse>> searchBySkill(@RequestParam String skill) {
		return ResponseEntity.ok(profileService.searchBySkill(skill));
	}

	@PostMapping("/{userId}/experience")
	public ResponseEntity<String> addExperience(@PathVariable String userId, @RequestBody Experience experience) {
		profileService.addExperience(userId, experience);
		return ResponseEntity.ok("Experience added successfully");
	}

	@PostMapping("/{userId}/education")
	public ResponseEntity<String> addEducation(@PathVariable String userId, @RequestBody Education education) {
		profileService.addEducation(userId, education);
		return ResponseEntity.ok("Education added successfully");
	}
}