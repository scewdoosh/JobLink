package com.joblink.jobposting.service;

import com.joblink.jobposting.dto.JobPostingRequest;
import com.joblink.jobposting.dto.JobPostingResponse;
import com.joblink.jobposting.entity.JobPosting;
import com.joblink.jobposting.repository.JobPostingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class JobPostingService {

	@Autowired
	private JobPostingRepository jobPostingRepository;

	public JobPostingResponse createJob(JobPostingRequest request) {
		JobPosting job = new JobPosting();
		job.setEmployerId(request.getEmployerId());
		job.setCompanyId(request.getCompanyId());
		job.setTitle(request.getTitle());
		job.setDescription(request.getDescription());
		job.setLocation(request.getLocation());
		job.setSalaryMin(request.getSalaryMin());
		job.setSalaryMax(request.getSalaryMax());
		job.setCategory(request.getCategory());
		job.setSkillsRequired(request.getSkillsRequired());
		job.setDeadline(request.getDeadline());
		return mapToResponse(jobPostingRepository.save(job));
	}

	public JobPostingResponse getJobById(String id) {
		JobPosting job = jobPostingRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));
		return mapToResponse(job);
	}

	public List<JobPostingResponse> getAllActiveJobs() {
		return jobPostingRepository.findByStatus(JobPosting.Status.OPEN).stream().map(this::mapToResponse).toList();
	}

	public List<JobPostingResponse> getJobsByEmployer(String employerId) {
		return jobPostingRepository.findByEmployerId(employerId).stream().map(this::mapToResponse).toList();
	}

	public JobPostingResponse updateJob(String id, JobPostingRequest request) {
		JobPosting job = jobPostingRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));
		job.setTitle(request.getTitle());
		job.setDescription(request.getDescription());
		job.setLocation(request.getLocation());
		job.setSalaryMin(request.getSalaryMin());
		job.setSalaryMax(request.getSalaryMax());
		job.setCategory(request.getCategory());
		job.setSkillsRequired(request.getSkillsRequired());
		job.setDeadline(request.getDeadline());
		return mapToResponse(jobPostingRepository.save(job));
	}

	public void closeJob(String id) {
		JobPosting job = jobPostingRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));
		job.setStatus(JobPosting.Status.CLOSED);
		jobPostingRepository.save(job);
	}

	public void deleteJob(String id) {
		jobPostingRepository.deleteById(id);
	}

	public List<JobPostingResponse> searchJobs(String keyword, String location, String skill) {
		if (keyword != null) {
			return jobPostingRepository.findByTitleContainingIgnoreCaseAndStatus(keyword, JobPosting.Status.OPEN)
					.stream().map(this::mapToResponse).toList();
		}
		if (location != null) {
			return jobPostingRepository.findByLocationContainingIgnoreCaseAndStatus(location, JobPosting.Status.OPEN)
					.stream().map(this::mapToResponse).toList();
		}
		if (skill != null) {
			return jobPostingRepository.findBySkillsRequiredContainingIgnoreCaseAndStatus(skill, JobPosting.Status.OPEN)
					.stream().map(this::mapToResponse).toList();
		}
		return getAllActiveJobs();
	}

	@Scheduled(cron = "0 * * * * *")
	public void expireOldJobs() {
		List<JobPosting> expired = jobPostingRepository.findByStatusAndDeadlineBefore(JobPosting.Status.OPEN,
				LocalDate.now());
		expired.forEach(job -> job.setStatus(JobPosting.Status.EXPIRED));
		jobPostingRepository.saveAll(expired);
	}

	private JobPostingResponse mapToResponse(JobPosting job) {
		JobPostingResponse response = new JobPostingResponse();
		response.setId(job.getId());
		response.setEmployerId(job.getEmployerId());
		response.setCompanyId(job.getCompanyId());
		response.setTitle(job.getTitle());
		response.setDescription(job.getDescription());
		response.setLocation(job.getLocation());
		response.setSalaryMin(job.getSalaryMin());
		response.setSalaryMax(job.getSalaryMax());
		response.setCategory(job.getCategory());
		response.setSkillsRequired(job.getSkillsRequired());
		response.setStatus(job.getStatus().name());
		response.setDeadline(job.getDeadline());
		response.setCreatedAt(job.getCreatedAt());
		return response;
	}
}