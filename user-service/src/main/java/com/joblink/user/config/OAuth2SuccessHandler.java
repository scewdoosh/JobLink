package com.joblink.user.config;

import com.joblink.user.entity.User;
import com.joblink.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private JwtUtil jwtUtil;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException {
		OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

		String email = oAuth2User.getAttribute("email");
		String name = oAuth2User.getAttribute("name") != null ? oAuth2User.getAttribute("name")
				: oAuth2User.getAttribute("login");

		User user = userRepository.findByEmail(email).orElseGet(() -> {
			User newUser = new User();
			newUser.setEmail(email);
			newUser.setName(name);
			newUser.setPassword("");
			newUser.setRole(User.Role.CANDIDATE);
			if (oAuth2User.getAttribute("name") != null) {
				newUser.setProvider(User.Provider.GOOGLE);
			} else {
				newUser.setProvider(User.Provider.GITHUB);
			}
			return userRepository.save(newUser);
		});

		String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());

		response.sendRedirect("http://localhost:3000?token=" + token);
	}
}