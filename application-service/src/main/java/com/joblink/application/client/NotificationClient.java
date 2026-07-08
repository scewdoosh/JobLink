package com.joblink.application.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "notification-service")
public interface NotificationClient {

    @PostMapping("/api/notifications/application-confirmation")
    String sendApplicationConfirmation(
            @RequestParam("toEmail") String toEmail,
            @RequestParam("jobTitle") String jobTitle
    );

    @PostMapping("/api/notifications/status-update")
    String sendStatusUpdate(
            @RequestParam("toEmail") String toEmail,
            @RequestParam("jobTitle") String jobTitle,
            @RequestParam("status") String status
    );
}
