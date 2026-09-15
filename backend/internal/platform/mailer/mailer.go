package mailer

import (
	"fmt"
	"net/smtp"
	"strings"
)

// Mailer sends transactional emails via SMTP (Gmail TLS/STARTTLS).
type Mailer struct {
	host     string
	port     string
	user     string
	password string
	from     string
}

// New creates a Mailer from config values.
func New(host, port, user, password, from string) *Mailer {
	if from == "" {
		from = user
	}
	return &Mailer{host: host, port: port, user: user, password: password, from: from}
}

// IsConfigured returns true when SMTP credentials are present.
func (m *Mailer) IsConfigured() bool {
	return m.host != "" && m.user != "" && m.password != ""
}

// Send sends a plain-text + HTML email.
func (m *Mailer) Send(to, subject, bodyText, bodyHTML string) error {
	addr := m.host + ":" + m.port
	auth := smtp.PlainAuth("", m.user, m.password, m.host)

	boundary := "nith-portal-boundary-2026"
	msg := strings.Join([]string{
		"From: " + m.from,
		"To: " + to,
		"Subject: " + subject,
		"MIME-Version: 1.0",
		`Content-Type: multipart/alternative; boundary="` + boundary + `"`,
		"",
		"--" + boundary,
		"Content-Type: text/plain; charset=UTF-8",
		"",
		bodyText,
		"",
		"--" + boundary,
		"Content-Type: text/html; charset=UTF-8",
		"",
		bodyHTML,
		"",
		"--" + boundary + "--",
	}, "\r\n")

	return smtp.SendMail(addr, auth, m.user, []string{to}, []byte(msg))
}

// SendPasswordReset sends the branded password-reset email.
func (m *Mailer) SendPasswordReset(toEmail, toName, resetURL string) error {
	subject := "Reset Your NIT Hamirpur Portal Password"

	plain := fmt.Sprintf(`Hi %s,

We received a request to reset the password for your NIT Hamirpur Department Portal account.

Click the link below to set a new password (valid for 1 hour):
%s

If you did not request a password reset, you can safely ignore this email.

—
NIT Hamirpur | Department of Computer Science & Engineering
This is an automated message. Do not reply to this email.
`, toName, resetURL)

	html := fmt.Sprintf(`<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f0ee;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f5f0ee;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(51,17,14,.10);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1c110c 0%%,#33110e 60%%,#4a1814 100%%);padding:28px 32px;text-align:center;">
            <p style="margin:0;color:#f5c18a;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;">NIT Hamirpur • Department Portal</p>
            <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:900;letter-spacing:-0.5px;">Password Reset</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 8px;color:#33110e;font-size:15px;font-weight:700;">Hi %s,</p>
            <p style="margin:0 0 24px;color:#6b5c58;font-size:13px;line-height:1.6;">
              We received a request to reset the password for your NIT Hamirpur Department Portal account.
              Click the button below to set a new password. This link is valid for <strong>1 hour</strong>.
            </p>
            <div style="text-align:center;margin:28px 0;">
              <a href="%s"
                 style="display:inline-block;background:#85261e;color:#ffffff;text-decoration:none;font-size:13px;font-weight:800;padding:13px 32px;border-radius:12px;letter-spacing:0.3px;">
                Reset My Password →
              </a>
            </div>
            <p style="margin:24px 0 0;color:#9c8b87;font-size:11px;line-height:1.6;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="%s" style="color:#85261e;word-break:break-all;">%s</a>
            </p>
            <hr style="border:none;border-top:1px solid #eedfd8;margin:24px 0;">
            <p style="margin:0;color:#b5a19b;font-size:11px;">
              If you did not request a password reset, please ignore this email. Your password will remain unchanged.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#fff9f6;border-top:1px solid #eedfd8;padding:16px 32px;text-align:center;">
            <p style="margin:0;color:#9c8b87;font-size:10px;">
              NIT Hamirpur, Hamirpur, Himachal Pradesh — 177005<br>
              Department of Computer Science &amp; Engineering
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`, toName, resetURL, resetURL, resetURL)

	return m.Send(toEmail, subject, plain, html)
}
