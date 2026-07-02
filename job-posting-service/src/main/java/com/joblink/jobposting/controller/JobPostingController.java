package com.joblink.jobposting.controller;

import com.joblink.jobposting.dto.JobPostingRequest;
import com.joblink.jobposting.dto.JobPostingResponse;
import com.joblink.jobposting.service.JobPostingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobPostingController {

	@Autowired
	private JobPostingService jobPostingService;

	@PostMapping
	public ResponseEntity<JobPostingResponse> createJob(@RequestBody JobPostingRequest request) {
		return ResponseEntity.ok(jobPostingService.createJob(request));
	}

	@GetMapping
	public ResponseEntity<List<JobPostingResponse>> getAllActiveJobs() {
		return ResponseEntity.ok(jobPostingService.getAllActiveJobs());
	}

	@GetMapping("/{id}")
	public ResponseEntity<JobPostingResponse> getJobById(@PathVariable String id) {
		return ResponseEntity.ok(jobPostingService.getJobById(id));
	}

	@GetMapping("/employer/{employerId}")
	public ResponseEntity<List<JobPostingResponse>> getJobsByEmployer(@PathVariable String employerId) {
		return ResponseEntity.ok(jobPostingService.getJobsByEmployer(employerId));
	}

	@PutMapping("/{id}")
	public ResponseEntity<JobPostingResponse> updateJob(@PathVariable String id,
			@RequestBody JobPostingRequest request) {
		return ResponseEntity.ok(jobPostingService.updateJob(id, request));
	}

	@PatchMapping("/{id}/close")
	public ResponseEntity<String> closeJob(@PathVariable String id) {
		jobPostingService.closeJob(id);
		return ResponseEntity.ok("Job closed successfully");
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteJob(@PathVariable String id) {
		jobPostingService.deleteJob(id);
		return ResponseEntity.ok("Job deleted successfully");
	}

	@GetMapping("/search")
	public ResponseEntity<List<JobPostingResponse>> searchJobs(@RequestParam(required = false) String keyword,
			@RequestParam(required = false) String location, @RequestParam(required = false) String skill) {
		return ResponseEntity.ok(jobPostingService.searchJobs(keyword, location, skill));
	}
}