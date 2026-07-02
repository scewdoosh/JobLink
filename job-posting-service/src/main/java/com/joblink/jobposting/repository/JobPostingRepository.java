package com.joblink.jobposting.repository;

import com.joblink.jobposting.entity.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, String> {
	List<JobPosting> findByStatus(JobPosting.Status status);

	List<JobPosting> findByEmployerId(String employerId);

	List<JobPosting> findByStatusAndDeadlineBefore(JobPosting.Status status, LocalDate date);

	List<JobPosting> findByTitleContainingIgnoreCaseAndStatus(String keyword, JobPosting.Status status);

	List<JobPosting> findByLocationContainingIgnoreCaseAndStatus(String location, JobPosting.Status status);

	List<JobPosting> findBySkillsRequiredContainingIgnoreCaseAndStatus(String skill, JobPosting.Status status);
}