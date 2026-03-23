import zxcvbn from "zxcvbn";

const labels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
const colors = ["#e74c3c", "#e67e22", "#f1c40f", "#2ecc71", "#27ae60"];

export const PasswordStrength = ({ password }: { password: string }) => {
  if (!password) return null;

  const result = zxcvbn(password);
  const { score } = result;

  return (
    <div className="password-strength">
      <div className="strength-bar">
        <div
          className="strength-fill"
          style={{
            width: `${(score + 1) * 20}%`,
            backgroundColor: colors[score],
          }}
        />
      </div>
      <span style={{ color: colors[score], fontSize: "0.85rem" }}>
        {labels[score]}
      </span>
      {result.feedback.warning && (
        <p className="strength-warning">{result.feedback.warning}</p>
      )}
    </div>
  );
};
