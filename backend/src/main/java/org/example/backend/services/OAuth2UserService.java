package org.example.backend.services;

import org.example.backend.models.AppUser;
import org.example.backend.repositories.AppUserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class OAuth2UserService extends DefaultOAuth2UserService {

    private final AppUserRepository repo;

    public OAuth2UserService(AppUserRepository repo) {
        this.repo = repo;
    }

    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        AppUser appUser = repo.findById(oAuth2User.getName())
                .orElseGet(() -> createAppUser(oAuth2User));
        return oAuth2User;
    }


    private AppUser createAppUser(OAuth2User oAuth2User) {
        AppUser newUser = AppUser.builder()
                .id(oAuth2User.getName())
                .username(oAuth2User.getAttribute("login"))
                .watchlistIDs(new ArrayList<>())
                .build();
        repo.save(newUser);
        return newUser;
    }
}
