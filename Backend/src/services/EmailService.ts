import nodemailer from "nodemailer";

const getFrontendUrl = () => {
  return (
    process.env.FRONTEND_URL ||
    process.env.CORS_ORIGIN ||
    "http://localhost:5173"
  )
    .split(",")[0]
    .trim()
    .replace(/\/$/, "");
};

const isSmtpConfigured = () => {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS,
  );
};

export const buildPasswordResetUrl = (token: string) => {
  const frontendUrl = getFrontendUrl();
  return `${frontendUrl}/redefinir-senha?token=${encodeURIComponent(token)}`;
};

export const sendPasswordResetEmail = async (
  recipientEmail: string,
  recipientName: string,
  resetUrl: string,
) => {
  if (!isSmtpConfigured()) {
    console.log("[PayGrid] SMTP não configurado. Link de recuperação:");
    console.log(resetUrl);
    return { sent: false, skipped: true };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const from = process.env.MAIL_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from,
    to: recipientEmail,
    subject: "Redefinição de senha - PayGrid",
    text: `Olá, ${recipientName}.

Recebemos uma solicitação de redefinição de senha para a sua conta no PayGrid.

Para continuar, acesse o link abaixo:
${resetUrl}

Este link é válido por 15 minutos.

Caso esta solicitação não tenha sido realizada por você, nenhuma ação adicional será necessária. Sua senha permanecerá inalterada até que o processo de redefinição seja concluído.

Atenciosamente,
Equipe PayGrid
Sistema para Gestão Financeira Pessoal`,
    html: `
      <div style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:32px 16px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 10px 30px rgba(15,23,42,0.08);">
                
                <tr>
                  <td style="background:linear-gradient(135deg,#0a1220 0%,#102347 100%);padding:32px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="left">
                          <div style="display:inline-block;background:#2B5BBA;width:46px;height:46px;border-radius:14px;vertical-align:middle;text-align:center;line-height:46px;">
                            <span style="font-size:22px;color:#ffffff;">↗</span>
                          </div>
                          <span style="display:inline-block;margin-left:14px;font-size:28px;font-weight:700;color:#ffffff;vertical-align:middle;">
                            PayGrid
                          </span>
                        </td>
                      </tr>
                    </table>

                    <div style="margin-top:24px;height:4px;background:#2B5BBA;border-radius:999px;"></div>

                    <p style="margin:28px 0 0;font-size:14px;line-height:1.7;color:#cbd5e1;">
                      Sistema para Gestão Financeira Pessoal
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:36px 36px 24px;">
                    <h1 style="margin:0 0 14px;font-size:26px;line-height:1.3;color:#0f172a;">
                      Redefinição de senha
                    </h1>

                    <p style="margin:0 0 18px;font-size:15px;line-height:1.8;color:#475569;">
                      Olá, <strong>${recipientName}</strong>.
                    </p>

                    <p style="margin:0 0 18px;font-size:15px;line-height:1.8;color:#475569;">
                      Recebemos uma solicitação para redefinição da senha vinculada à sua conta no <strong>PayGrid</strong>.
                    </p>

                    <p style="margin:0 0 24px;font-size:15px;line-height:1.8;color:#475569;">
                      Para prosseguir com segurança, clique no botão abaixo e defina sua nova senha.
                    </p>

                    <div style="margin:30px 0;text-align:center;">
                      <a href="${resetUrl}" style="display:inline-block;background:#2B5BBA;color:#ffffff;text-decoration:none;font-weight:700;padding:15px 28px;border-radius:12px;font-size:15px;box-shadow:0 8px 20px rgba(43,91,186,0.25);">
                        Redefinir senha
                      </a>
                    </div>

                    <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;">
                      <tr>
                        <td style="padding:18px 18px 6px;">
                          <p style="margin:0;font-size:13px;font-weight:700;color:#0f172a;">
                            Informações importantes
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:0 18px 18px;">
                          <ul style="margin:0;padding-left:18px;color:#475569;font-size:14px;line-height:1.8;">
                            <li>Este link possui validade de <strong>15 minutos</strong>.</li>
                            <li>A redefinição só será concluída após a criação de uma nova senha.</li>
                            <li>Por segurança, recomendamos não compartilhar este e-mail.</li>
                          </ul>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:28px 0 0;font-size:14px;line-height:1.8;color:#475569;">
                      Caso esta solicitação não tenha sido realizada por você, nenhuma ação adicional será necessária. Sua senha atual permanecerá inalterada até que uma redefinição seja efetivamente concluída.
                    </p>

                    <p style="margin:24px 0 0;font-size:14px;line-height:1.8;color:#475569;">
                      Atenciosamente,<br />
                      <strong>Equipe PayGrid</strong>
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:18px 36px;background:#f8fafc;border-top:1px solid #e2e8f0;">
                    <p style="margin:0;font-size:12px;line-height:1.7;color:#64748b;">
                      Este é um e-mail automático do PayGrid. A redefinição de senha será concluída somente após a confirmação na plataforma.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </div>
    `,
  });

  return { sent: true, skipped: false };
};
