package com.summary.eSummarizer.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.summary.eSummarizer.Service.MyAppUserService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private final MyAppUserService appUserService;

    public SecurityConfig(MyAppUserService appUserService) {
        this.appUserService = appUserService;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return appUserService;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(appUserService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(form -> form
                        .loginPage("/OldUI/login") // Use your actual login page
                        .loginProcessingUrl("/login")
                        .usernameParameter("email")
                        .defaultSuccessUrl("/OldUI/index", true) // Redirect to correct index
                        .failureUrl("/OldUI/login?error=true")
                        .permitAll())
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/OldUI/index?logout") // Redirect to correct index
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID"))
                .authorizeHttpRequests(registry -> {
                    registry.requestMatchers(
                            "/", "/index", "/index.html", "/signup",
                            "/css/**", "/js/**",
                            "/api/classification/", "/api/classification/classify",
                            "/api/summarization", "/api/summarization/summarize",
                            "/OldUI/index", "/OldUI/**", // OldUI templates and resources
                            "/NewUI/index", "/NewUI/**", // NewUI templates and resources
                            "/static/OldUI/**", "/static/NewUI/**" // Static resources
                    ).permitAll();
                    registry.requestMatchers("/summarize").permitAll();
                    registry.requestMatchers("/api/profile/**").authenticated();
                    registry.anyRequest().authenticated();
                })
                .build();
    }

}