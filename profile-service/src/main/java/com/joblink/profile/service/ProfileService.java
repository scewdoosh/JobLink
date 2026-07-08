package com.joblink.profile.service;

import com.joblink.profile.dto.ProfileCompleteRequest;
import com.joblink.profile.dto.ProfileResponse;
import com.joblink.profile.entity.Education;
import com.joblink.profile.entity.Experience;
import com.joblink.profile.entity.Profile;
import com.joblink.profile.repository.EducationRepository;
import com.joblink.profile.repository.ExperienceRepository;
import com.joblink.profile.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class ProfileService {

	@Autowired
	private ProfileRepository profileRepository;

	@Autowired
	private ExperienceRepository experienceRepository;

	@Autowired
	private EducationRepository educationRepository;

	@Transactional
	public ProfileResponse completeProfile(ProfileCompleteRequest request, MultipartFile resume, MultipartFile profilePicture) {
		if (profileRepository.existsByUserId(request.getUserId())) {
			throw new RuntimeException("Profile already exists for this user");
		}

		// Create profile
		Profile profile = new Profile();
		profile.setUserId(request.getUserId());
		profile.setBio(request.getBio());
		profile.setLocation(request.getLocation());
		profile.setSkills(request.getSkills());

		// Store resume PDF bytes
		try {
			profile.setResumeFile(resume.getBytes());
			profile.setResumeFileName(resume.getOriginalFilename());
		} catch (IOException e) {
			throw new RuntimeException("Failed to read resume file", e);
		}

		if (profilePicture != null && !profilePicture.isEmpty()) {
			try {
				profile.setProfilePicture(profilePicture.getBytes());
				profile.setProfilePictureType(profilePicture.getContentType());
			} catch (IOException e) {
				throw new RuntimeException("Failed to read profile picture", e);
			}
		}

		Profile saved = profileRepository.save(profile);

		// Persist experiences
		List<Experience> savedExperiences = new ArrayList<>();
		if (request.getExperiences() != null) {
			for (ProfileCompleteRequest.ExperienceEntry entry : request.getExperiences()) {
				Experience exp = new Experience();
				exp.setProfile(saved);
				exp.setCompany(entry.getCompany());
				exp.setRole(entry.getRole());
				exp.setStartDate(entry.getStartDate());
				exp.setEndDate(entry.getEndDate());
				exp.setDescription(entry.getDescription());
				savedExperiences.add(experienceRepository.save(exp));
			}
		}

		// Persist educations
		List<Education> savedEducations = new ArrayList<>();
		if (request.getEducations() != null) {
			for (ProfileCompleteRequest.EducationEntry entry : request.getEducations()) {
				Education edu = new Education();
				edu.setProfile(saved);
				edu.setInstitution(entry.getInstitution());
				edu.setDegree(entry.getDegree());
				edu.setYear(entry.getYear());
				savedEducations.add(educationRepository.save(edu));
			}
		}

		// Set collections on entity for mapping
		saved.setExperiences(savedExperiences);
		saved.setEducations(savedEducations);

		return mapToResponse(saved);
	}

	public ProfileResponse getProfileByUserId(String userId) {
		Profile profile = profileRepository.findByUserId(userId)
				.orElseThrow(() -> new RuntimeException("Profile not found"));
		return mapToResponse(profile);
	}

	public Profile getProfileEntityByUserId(String userId) {
		return profileRepository.findByUserId(userId)
				.orElseThrow(() -> new RuntimeException("Profile not found"));
	}

	public List<ProfileResponse> searchBySkill(String skill) {
		List<Profile> profiles = profileRepository.findBySkillsContainingIgnoreCase(skill);
		return profiles.stream().map(this::mapToResponse).toList();
	}

	public void addExperience(String userId, Experience experience) {
		Profile profile = profileRepository.findByUserId(userId)
				.orElseThrow(() -> new RuntimeException("Profile not found"));
		experience.setProfile(profile);
		experienceRepository.save(experience);
	}

	public void addEducation(String userId, Education education) {
		Profile profile = profileRepository.findByUserId(userId)
				.orElseThrow(() -> new RuntimeException("Profile not found"));
		education.setProfile(profile);
		educationRepository.save(education);
	}

	private ProfileResponse mapToResponse(Profile profile) {
		ProfileResponse response = new ProfileResponse();
		response.setId(profile.getId());
		response.setUserId(profile.getUserId());
		response.setBio(profile.getBio());
		response.setLocation(profile.getLocation());
		response.setSkills(profile.getSkills());
		response.setResumeFileName(profile.getResumeFileName());
		response.setCreatedAt(profile.getCreatedAt());
		response.setHasProfilePicture(profile.getProfilePicture() != null);

		// Map experiences
		if (profile.getExperiences() != null) {
			List<ProfileResponse.ExperienceResponse> expResponses = profile.getExperiences().stream()
					.map(exp -> {
						ProfileResponse.ExperienceResponse er = new ProfileResponse.ExperienceResponse();
						er.setId(exp.getId());
						er.setCompany(exp.getCompany());
						er.setRole(exp.getRole());
						er.setStartDate(exp.getStartDate());
						er.setEndDate(exp.getEndDate());
						er.setDescription(exp.getDescription());
						return er;
					}).toList();
			response.setExperiences(expResponses);
		} else {
			response.setExperiences(Collections.emptyList());
		}

		// Map educations
		if (profile.getEducations() != null) {
			List<ProfileResponse.EducationResponse> eduResponses = profile.getEducations().stream()
					.map(edu -> {
						ProfileResponse.EducationResponse er = new ProfileResponse.EducationResponse();
						er.setId(edu.getId());
						er.setInstitution(edu.getInstitution());
						er.setDegree(edu.getDegree());
						er.setYear(edu.getYear());
						return er;
					}).toList();
			response.setEducations(eduResponses);
		} else {
			response.setEducations(Collections.emptyList());
		}

		return response;
	}
}