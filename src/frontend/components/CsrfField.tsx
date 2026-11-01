type CsrfFieldProps = {
  token: string;
};

/**
 * Hidden field that goes inside every <form method="post">.
 * The server rejects a POST without the right token (backend/session/csrf.tsx), which
 * stops other websites from submitting forms on the user's behalf.
 */
export function CsrfField({ token }: CsrfFieldProps) {
  return <input type="hidden" name="_csrf" value={token} />;
}
