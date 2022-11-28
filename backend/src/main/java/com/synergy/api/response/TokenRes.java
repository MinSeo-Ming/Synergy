package com.synergy.api.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenRes {

    private String accessToken;
    private String refreshToken;

    public static TokenRes of(String accessToken, String refreshToken) {
        return TokenRes.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }
}
