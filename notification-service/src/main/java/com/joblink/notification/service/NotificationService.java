package com.joblink.notification.service;

import com.joblink.notification.dto.NotificationRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(NotificationRequest request) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(request.getToEmail());
        message.setSubject(request.getSubject());
        message.setText(request.getBody());
        mailSender.send(message);
    }

    public void sendApplicationConfirmation(String toEmail, String jobTitle) {
        NotificationRequest request = new NotificationRequest();
        request.setToEmail(toEmail);
        request.setSubject("Application Submitted - " + jobTitle);
        request.setBody("Your application for " + jobTitle +
                " has been submitted successfully. Good luck!");
        sendEmail(request);
    }

    public void sendStatusUpdate(String toEmail, String jobTitle, String status) {
        NotificationRequest request = new NotificationRequest();
        request.setToEmail(toEmail);
        request.setSubject("Application Status Update - " + jobTitle);
        request.setBody("Your application for " + jobTitle +
                " has been updated to: " + status);
        sendEmail(request);
    }
}
