<?php
/**
 * send-email.php — Backend handler for the Contact Page form.
 * 
 * This script receives a JSON POST request, validates the data,
 * and sends an email using the PHP mail() function.
 */

// 1. Set headers for JSON response and CORS (if needed)
header('Content-Type: application/json');

// 2. Configuration
$to_email = "ronan.van.stokkom@de.ey.com"; // Your email address
$subject_prefix = "[Bug Hunt Support] ";

// 3. Get the POST data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// 4. Validation
if (!$data) {
    echo json_encode(['success' => false, 'message' => 'No data received.']);
    exit;
}

$name    = strip_tags(trim($data['fullName']));
$email   = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$company = strip_tags(trim($data['companyOrTeam']));
$subject = strip_tags(trim($data['subject']));
$message = strip_tags(trim($data['message']));

if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
    exit;
}

// 5. Prepare the email
$full_subject = $subject_prefix . $subject;

$email_content = "Name: $name\n";
$email_content .= "Email: $email\n";
$email_content .= "Company/Team: " . ($company ?: "N/A") . "\n\n";
$email_content .= "Message:\n$message\n";

// Headers
$headers = "From: $name <$email>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// 6. Send the email
if (mail($to_email, $full_subject, $email_content, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Email sent successfully!']);
} else {
    // Note: If mail() fails, it's often a server configuration issue.
    echo json_encode(['success' => false, 'message' => 'Server failed to send email. Please try again later.']);
}
?>
