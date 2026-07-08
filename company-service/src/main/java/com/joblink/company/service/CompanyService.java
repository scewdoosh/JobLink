package com.joblink.company.service;

import com.joblink.company.dto.CompanyRequest;
import com.joblink.company.dto.CompanyResponse;
import com.joblink.company.entity.Company;
import com.joblink.company.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CompanyService {

	@Autowired
	private CompanyRepository companyRepository;

	public CompanyResponse createCompany(CompanyRequest request) {
		if (companyRepository.existsByEmployerId(request.getEmployerId())) {
			throw new RuntimeException("You have already registered a company");
		}
		Company company = new Company();
		company.setEmployerId(request.getEmployerId());
		company.setName(request.getName());
		company.setDescription(request.getDescription());
		company.setIndustry(request.getIndustry());
		if (request.getSize() != null && !request.getSize().isBlank()) {
			company.setSize(Company.Size.valueOf(request.getSize().toUpperCase()));
		}
		company.setWebsite(request.getWebsite());
		company.setLocation(request.getLocation());
		company.setLogoUrl(request.getLogoUrl());
		return mapToResponse(companyRepository.save(company));
	}

	public CompanyResponse getCompanyById(String id) {
		Company company = companyRepository.findById(id).orElseThrow(() -> new RuntimeException("Company not found"));
		return mapToResponse(company);
	}

	public CompanyResponse getCompanyByEmployerId(String employerId) {
		Company company = companyRepository.findByEmployerId(employerId)
				.orElseThrow(() -> new RuntimeException("Company not found"));
		return mapToResponse(company);
	}

	public List<CompanyResponse> getAllCompanies() {
		return companyRepository.findAll().stream().map(this::mapToResponse).toList();
	}

	public List<CompanyResponse> searchByName(String name) {
		return companyRepository.findByNameContainingIgnoreCase(name).stream().map(this::mapToResponse).toList();
	}

	public CompanyResponse updateCompany(String id, CompanyRequest request) {
		Company company = companyRepository.findById(id).orElseThrow(() -> new RuntimeException("Company not found"));
		company.setName(request.getName());
		company.setDescription(request.getDescription());
		company.setIndustry(request.getIndustry());
		if (request.getSize() != null && !request.getSize().isBlank()) {
			company.setSize(Company.Size.valueOf(request.getSize().toUpperCase()));
		}
		company.setWebsite(request.getWebsite());
		company.setLocation(request.getLocation());
		company.setLogoUrl(request.getLogoUrl());
		return mapToResponse(companyRepository.save(company));
	}

	public CompanyResponse verifyCompany(String id) {
		Company company = companyRepository.findById(id).orElseThrow(() -> new RuntimeException("Company not found"));
		company.setVerified(true);
		company.setVerifiedAt(LocalDateTime.now());
		return mapToResponse(companyRepository.save(company));
	}

	public void deleteCompany(String id) {
		companyRepository.deleteById(id);
	}

	private CompanyResponse mapToResponse(Company company) {
		CompanyResponse response = new CompanyResponse();
		response.setId(company.getId());
		response.setEmployerId(company.getEmployerId());
		response.setName(company.getName());
		response.setDescription(company.getDescription());
		response.setIndustry(company.getIndustry());
		response.setSize(company.getSize() != null ? company.getSize().name() : null);
		response.setWebsite(company.getWebsite());
		response.setLogoUrl(company.getLogoUrl());
		response.setLocation(company.getLocation());
		response.setVerified(company.isVerified());
		response.setVerifiedAt(company.getVerifiedAt());
		response.setCreatedAt(company.getCreatedAt());
		return response;
	}
}