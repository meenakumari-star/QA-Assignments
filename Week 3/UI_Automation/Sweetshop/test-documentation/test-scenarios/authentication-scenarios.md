# Authentication Scenarios - Sweet Shop

### Feature Name: User Authentication

| Scenario ID | Scenario Title | Scenario Description | Type | Priority |
|-------------|----------------|----------------------|------|----------|
| TS-076 | Valid Login Credentials | User logs in with correct email and password | Positive | High |
| TS-077 | Login Form Display | Login page displays email and password fields correctly | Positive | High |
| TS-078 | Social Media Login Options | User can see Twitter, Facebook, LinkedIn login options | Positive | Medium |
| TS-079 | Email Field Placeholder | Email field shows appropriate placeholder text | Positive | Low |
| TS-080 | Login Button Functionality | Login button triggers authentication process | Positive | High |
| TS-081 | Password Field Security | Password field masks input characters | Positive | High |
| TS-082 | Invalid Email Credentials | User attempts login with incorrect email | Negative | High |
| TS-083 | Invalid Password Credentials | User attempts login with incorrect password | Negative | High |
| TS-084 | Empty Email Field | User attempts login without entering email | Negative | High |
| TS-085 | Empty Password Field | User attempts login without entering password | Negative | High |
| TS-086 | Empty Credentials | User attempts login with both fields empty | Negative | High |
| TS-087 | Invalid Email Format | User enters malformed email address | Negative | High |
| TS-088 | SQL Injection Attempt | User enters SQL injection code in login fields | Security | High |
| TS-089 | XSS Attack Attempt | User enters XSS script in login fields | Security | High |
| TS-090 | Password Strength Validation | System validates minimum password requirements | Positive | Medium |
| TS-091 | Account Lockout Protection | System protects against brute force attacks | Security | Medium |
| TS-092 | Login Session Management | User session is properly managed after login | Positive | Medium |
| TS-093 | Logout Functionality | User can successfully log out | Positive | High |
| TS-094 | Remember Me Option | Login form includes remember me functionality | Positive | Low |
| TS-095 | Login Form Accessibility | Login form is accessible via screen readers | Positive | Low |
| TS-096 | Social Media Login Integration | Social media login buttons function correctly | Positive | Medium |
| TS-097 | Case Sensitivity Email | Email field handles case sensitivity correctly | Edge | Medium |
| TS-098 | Special Characters Password | Password field accepts special characters | Edge | Medium |
| TS-099 | Long Email Address | System handles very long email addresses | Boundary | Low |
| TS-100 | Login Network Timeout | Login process with network timeout issues | Edge | Low |