// Sign-in email: table layout and inline styles only, since email clients ignore
// Tailwind and most <style> blocks. Colours match tailwind.config.ts.
const NAVY = "#171F38";
const NAVY_LIGHT = "#1e2a4a";
const GREEN = "#06e38b";
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

export const SIGN_IN_SUBJECT = "Your Tryka Stats sign-in link";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function signInEmail(link: string): { subject: string; html: string; text: string } {
  const href = escapeHtml(link);
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark light">
<title>${SIGN_IN_SUBJECT}</title>
</head>
<body style="margin:0;padding:0;background:${NAVY};" bgcolor="${NAVY}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${NAVY};">Your sign-in link for Tryka Stats. It expires in 15 minutes.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${NAVY}" style="background:${NAVY};">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">
        <tr>
          <td align="center" style="padding:0 0 20px;font-family:${FONT};font-size:20px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${GREEN};">Tryka Stats</td>
        </tr>
        <tr>
          <td bgcolor="${NAVY_LIGHT}" style="background:${NAVY_LIGHT};border:1px solid #2a3a63;border-radius:12px;padding:32px 28px;font-family:${FONT};color:#ffffff;">
            <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;font-weight:600;color:#ffffff;">Sign in to Tryka Stats</h1>
            <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#cbd5e1;">Click the button below to sign in and manage your athlete profile. This link expires in 15 minutes and can only be used once.</p>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 24px;">
              <tr>
                <td align="center" bgcolor="${GREEN}" style="background:${GREEN};border-radius:8px;">
                  <a href="${href}" target="_blank" style="display:inline-block;padding:14px 36px;font-family:${FONT};font-size:16px;font-weight:700;color:${NAVY};text-decoration:none;border-radius:8px;">Sign in</a>
                </td>
              </tr>
            </table>
            <p style="margin:0;font-size:13px;line-height:1.6;color:#94a3b8;">If you didn't request this, you can safely ignore this email. Nobody can sign in without this link.</p>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:20px 0 0;font-family:${FONT};font-size:12px;color:#94a3b8;">Tryka Stats &middot; <a href="https://trykastats.com" style="color:#94a3b8;text-decoration:underline;">trykastats.com</a></td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

  const text =
    `Click the link below to sign in to Tryka Stats. It expires in 15 minutes and can only be used once.\n\n` +
    `${link}\n\nIf you didn't request this, you can ignore this email.`;

  return { subject: SIGN_IN_SUBJECT, html, text };
}
