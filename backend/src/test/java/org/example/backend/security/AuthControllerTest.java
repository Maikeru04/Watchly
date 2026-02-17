package org.example.backend.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oauth2Login;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {
    @Autowired
    MockMvc mockMvc;

    @Test
    void getMe_shouldReturnLoginName_whenUserIsAuthenticated() throws Exception {
        mockMvc.perform(get("/api/auth/me")
                        .with(oauth2Login()
                                .attributes(attrs -> attrs.put("login", "testuser"))))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                          {
                            "name":"testuser",
                            "attributes": {
                                "sub":"user",
                                "login":"testuser"
                            }
                          }
"""
                ));
    }

    @Test
    void getMe_shouldReturnNull_whenUserIsNotAuthenticated() throws Exception {
        mockMvc.perform(get("/api/auth"))
                .andExpect(status().is4xxClientError());
    }
}
