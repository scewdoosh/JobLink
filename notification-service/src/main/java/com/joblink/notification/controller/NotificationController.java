package com.joblink.notification.controller;

import com.joblink.notification.dto.NotificationRequest;
import com.joblink.notification.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/send")
    public ResponseEntity<String> sendEmail(@RequestBody NotificationRequest request) {
        notificationService.sendEmail(request);
        return ResponseEntity.ok("Email sent successfully");
    }

    @PostMapping("/application-confirmation")
    public ResponseEntity<String> sendApplicationConfirmation(
            @RequestParam String toEmail,
            @RequestParam String jobTitle) {
        notificationService.sendApplicationConfirmation(toEmail, jobTitle);
        return ResponseEntity.ok("Confirmation email sent");
    }

    @PostMapping("/status-update")
    public ResponseEntity<String> sendStatusUpdate(
            @RequestParam String toEmail,
            @RequestParam String jobTitle,
            @RequestParam String status) {
        notificationService.sendStatusUpdate(toEmail, jobTitle, status);
        return ResponseEntity.ok("Status update email sent");
    }
}
