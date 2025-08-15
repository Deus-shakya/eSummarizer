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
                        .loginPage("/NewUI/login")
                        .loginProcessingUrl("/login")
                        .usernameParameter("email")
                        .defaultSuccessUrl("/NewUI/index", true)
                        .failureUrl("/NewUI/login?error=true")
                        .permitAll())
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/NewUI/login") // Redirect to correct index
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID"))
                .authorizeHttpRequests(registry -> {
                    registry.requestMatchers(
                            "/", "/index", "/index.html", "/signup",
                            "/css/**", "/js/**",
                            "/api/classification/", "/api/classification/classify",
                            "/api/summarization", "/api/summarization/summarize","/api/summarization/summarize-abs",
                            "/OldUI/index", "/OldUI/**", // OldUI templates and resources
                            "/NewUI/index", "/NewUI/**", // NewUI templates and resources
                            "/static/OldUI/**", "/static/NewUI/**","/api/summarize/upload" // Static resources
                    ).permitAll();
                    registry.requestMatchers("/summarize").permitAll();
                    registry.requestMatchers("/api/profile/**").authenticated();
                    registry.anyRequest().authenticated();
                })
                .build();
    }

}