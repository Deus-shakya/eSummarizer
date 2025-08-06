package com.summary.eSummarizer.Controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/NewUI")
public class NewUIController {
    @GetMapping({ "", "/index" })
    public String home(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAuthenticated = auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser");
        model.addAttribute("isAuthenticated", isAuthenticated);
        return "NewUI/index";
    }

    @GetMapping("/login")
    public String login() {
        return "NewUI/login";
    }

    @GetMapping("/signup")
    public String signup() {
        return "NewUI/signup";
    }

    @GetMapping("/profile")
    public String profile() {
        return "NewUI/profile";
    }

    @GetMapping("/navbar")
    public String navbar() {
        return "NewUI/navbar";
    }
}
