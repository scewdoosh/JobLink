package com.joblink.profile.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "profiles")
public class Profile {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private String id;

	@Column(nullable = false, unique = true)
	private String userId;

	private String bio;

	private String location;

	private String skills;

	@Lob
	@Column(name = "resume_file")
	private byte[] resumeFile;

	private String resumeFileName;

	@Lob
	@Column(name = "profile_picture")
	private byte[] profilePicture;

	@Column(name = "profile_picture_type")
	private String profilePictureType;

	@OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<Experience> experiences;

	@OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<Education> educations;

	@Column(name = "created_at")
	private LocalDateTime createdAt;

	@PrePersist
	public void prePersist() {
		this.createdAt = LocalDateTime.now();
	}

	public Profile() {
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
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

	public byte[] getResumeFile() {
		return resumeFile;
	}

	public void setResumeFile(byte[] resumeFile) {
		this.resumeFile = resumeFile;
	}

	public String getResumeFileName() {
		return resumeFileName;
	}

	public void setResumeFileName(String resumeFileName) {
		this.resumeFileName = resumeFileName;
	}

	public byte[] getProfilePicture() {
		return profilePicture;
	}

	public void setProfilePicture(byte[] profilePicture) {
		this.profilePicture = profilePicture;
	}

	public String getProfilePictureType() {
		return profilePictureType;
	}

	public void setProfilePictureType(String profilePictureType) {
		this.profilePictureType = profilePictureType;
	}

	public List<Experience> getExperiences() {
		return experiences;
	}

	public void setExperiences(List<Experience> experiences) {
		this.experiences = experiences;
	}

	public List<Education> getEducations() {
		return educations;
	}

	public void setEducations(List<Education> educations) {
		this.educations = educations;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
}