package com.joblink.application.service;

import com.joblink.application.client.JobPostingClient;
import com.joblink.application.client.ProfileClient;
import com.joblink.application.client.UserClient;
import com.joblink.application.client.NotificationClient;
import com.joblink.application.dto.ApplicationRequest;
import com.joblink.application.dto.ApplicationResponse;
import com.joblink.application.entity.Application;
import com.joblink.application.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobPostingClient jobPostingClient;

    @Autowired
    private ProfileClient profileClient;

    @Autowired
    private UserClient userClient;

    @Autowired
    private NotificationClient notificationClient;

    public ApplicationResponse apply(ApplicationRequest request) {
        if (applicationRepository.existsByCandidateIdAndJobId(
                request.getCandidateId(), request.getJobId())) {
            throw new RuntimeException("You have already applied for this job");
        }

        JobPostingClient.JobPostingDTO job = jobPostingClient.getJobById(request.getJobId());
        if (!job.getStatus().equals("OPEN")) {
            throw new RuntimeException("Job is not open for applications");
        }

        ProfileClient.ProfileDTO profile = profileClient.getProfile(request.getCandidateId());

        Application application = new Application();
        application.setCandidateId(request.getCandidateId());
        application.setJobId(request.getJobId());
        application.setCompanyId(job.getCompanyId());
        application.setResumeUrl(profile.getResumeUrl());

        Application saved = applicationRepository.save(application);

        // Send confirmation email
        try {
            UserClient.UserDTO user = userClient.getUserById(request.getCandidateId());
            if (user != null && user.getEmail() != null) {
                notificationClient.sendApplicationConfirmation(user.getEmail(), job.getTitle());
            }
        } catch (Exception e) {
            // Log error, but don't fail the application process
            System.err.println("Failed to send application confirmation email: " + e.getMessage());
        }

        return mapToResponse(saved);
    }

    public List<ApplicationResponse> getApplicationsByCandidate(String candidateId) {
        return applicationRepository.findByCandidateId(candidateId)
                .stream().map(this::mapToResponse).toList();
    }

    public List<ApplicationResponse> getApplicationsByJob(String jobId) {
        return applicationRepository.findByJobId(jobId)
                .stream().map(this::mapToResponse).toList();
    }

    public ApplicationResponse updateStatus(String id, String status) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        application.setStatus(Application.Status.valueOf(status.toUpperCase()));
        Application saved = applicationRepository.save(application);

        // Send status update email
        try {
            JobPostingClient.JobPostingDTO job = jobPostingClient.getJobById(application.getJobId());
            UserClient.UserDTO user = userClient.getUserById(application.getCandidateId());
            if (job != null && user != null && user.getEmail() != null) {
                notificationClient.sendStatusUpdate(user.getEmail(), job.getTitle(), status);
            }
        } catch (Exception e) {
            System.err.println("Failed to send status update email: " + e.getMessage());
        }

        return mapToResponse(saved);
    }

    private ApplicationResponse mapToResponse(Application application) {
        ApplicationResponse response = new ApplicationResponse();
        response.setId(application.getId());
        response.setCandidateId(application.getCandidateId());
        response.setJobId(application.getJobId());
        response.setCompanyId(application.getCompanyId());
        response.setResumeUrl(application.getResumeUrl());
        response.setStatus(application.getStatus().name());
        response.setAppliedAt(application.getAppliedAt());
        return response;
    }
}