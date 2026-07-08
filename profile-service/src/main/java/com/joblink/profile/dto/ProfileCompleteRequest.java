package com.joblink.profile.dto;

import java.time.LocalDate;
import java.util.List;

public class ProfileCompleteRequest {

	private String userId;
	private String bio;
	private String location;
	private String skills;
	private List<ExperienceEntry> experiences;
	private List<EducationEntry> educations;

	public ProfileCompleteRequest() {
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getBio() {
		return bio;
	}

	public void setBio(String bio) {
		this.bio = bio;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getSkills() {
		return skills;
	}

	public void setSkills(String skills) {
		this.skills = skills;
	}

	public List<ExperienceEntry> getExperiences() {
		return experiences;
	}

	public void setExperiences(List<ExperienceEntry> experiences) {
		this.experiences = experiences;
	}

	public List<EducationEntry> getEducations() {
		return educations;
	}

	public void setEducations(List<EducationEntry> educations) {
		this.educations = educations;
	}

	public static class ExperienceEntry {
		private String company;
		private String role;
		private LocalDate startDate;
		private LocalDate endDate;
		private String description;

		public ExperienceEntry() {
		}

		public String getCompany() {
			return company;
		}

		public void setCompany(String company) {
			this.company = company;
		}

		public String getRole() {
			return role;
		}

		public void setRole(String role) {
			this.role = role;
		}

		public LocalDate getStartDate() {
			return startDate;
		}

		public void setStartDate(LocalDate startDate) {
			this.startDate = startDate;
		}

		public LocalDate getEndDate() {
			return endDate;
		}

		public void setEndDate(LocalDate endDate) {
			this.endDate = endDate;
		}

		public String getDescription() {
			return description;
		}

		public void setDescription(String description) {
			this.description = description;
		}
	}

	public static class EducationEntry {
		private String institution;
		private String degree;
		private int year;

		public EducationEntry() {
		}

		public String getInstitution() {
			return institution;
		}

		public void setInstitution(String institution) {
			this.institution = institution;
		}

		public String getDegree() {
			return degree;
		}

		public void setDegree(String degree) {
			this.degree = degree;
		}

		public int getYear() {
			return year;
		}

		public void setYear(int year) {
			this.year = year;
		}
	}
}
