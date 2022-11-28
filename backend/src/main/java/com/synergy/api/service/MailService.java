package com.synergy.api.service;

import javax.mail.internet.MimeMessage;

import com.synergy.db.entity.UserEmailForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendMail(String email, String subject, String context) {

        MimeMessagePreparator msg = new MimeMessagePreparator() {

            @Override
            public void prepare(MimeMessage mimeMessage) throws Exception {
                MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
                mimeMessageHelper.setTo(email);
                mimeMessageHelper.setFrom("Synergy");
                mimeMessageHelper.setSubject(subject);
                mimeMessageHelper.setText(context, true);
            }
        };

        javaMailSender.send(msg);
    }

    public void sendAuthEmail(UserEmailForm userEmailForm) {
        String email = userEmailForm.getEmail();
        String subject = "Synergy 본인 인증 확인 메일입니다.";
        StringBuilder text = new StringBuilder();
        text
        .append("<p>Synergy 본인 인증 확인 메일입니다.</p><p>아래 링크를 클릭하셔서 가입 인증을 완료하세요.</p>")
        .append("<div><a href='https://i7a306.p.ssafy.io/emailauth?id=")
        .append(userEmailForm.getUserId())
        .append("&code=")
        .append(userEmailForm.getAuthCode())
        .append("'>가입 완료</a></div>");
        sendMail(email, subject, text.toString());
    }
}