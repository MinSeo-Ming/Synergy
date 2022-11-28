package com.synergy.db.entity;

import lombok.Getter;

@Getter
public class UserEmailForm {

    Long userId;
    String email;
    String authCode;

    public UserEmailForm(Long userId, String email, String authCode) {
        this.userId = userId;
        this.email = email;
        this.authCode = authCode;
    }
}