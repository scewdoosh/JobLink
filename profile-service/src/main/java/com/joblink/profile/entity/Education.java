package com.joblink.profile.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "education")
public class Education {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private String id;

	@ManyToOne
	@JoinColumn(name = "profile_id", nullable = false)
	private Profile profile;

	private String institution;

	private String degree;

	@Column(name = "graduation_year")
	private int year;

	public Education() {
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Profile getProfile() {
		return profile;
	}

	public void setProfile(Profile profile) {
		this.profile = profile;
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