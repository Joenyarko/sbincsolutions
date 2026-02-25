<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

// Set response header to JSON
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = isset($_POST['fullName']) ? strip_tags(trim($_POST['fullName'])) : '';
    $email = isset($_POST['emailAddr']) ? filter_var(trim($_POST['emailAddr']), FILTER_SANITIZE_EMAIL) : '';
    $phone = isset($_POST['phoneNum']) ? strip_tags(trim($_POST['phoneNum'])) : '';
    $subject_tag = isset($_POST['subject']) ? strip_tags(trim($_POST['subject'])) : 'New Contact Inquiry';
    $message = isset($_POST['msg']) ? strip_tags(trim($_POST['msg'])) : '';

    // Basic validation
    if (empty($name) || empty($email) || empty($subject_tag) || empty($message)) {
        echo json_encode(['status' => 'error', 'message' => 'Please fill in all required fields.']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid email format.']);
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = 'sbincsolutions.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'services@sbincsolutions.com';
        $mail->Password   = 'YOUR_EMAIL_PASSWORD_HERE'; // User needs to replace this
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;

        // Recipients
        $mail->setFrom('services@sbincsolutions.com', 'SBINC Website Form');
        $mail->addAddress('services@sbincsolutions.com', 'SBINC Solutions');
        $mail->addReplyTo($email, $name);

        // Content
        $mail->isHTML(true);
        $mail->Subject = "New Website Inquiry: " . $subject_tag;
        
        $email_content = "
            <h2>New Message from Sbinc Solutions Website</h2>
            <p><strong>Name:</strong> {$name}</p>
            <p><strong>Email:</strong> {$email}</p>
            <p><strong>Phone:</strong> {$phone}</p>
            <p><strong>Subject:</strong> {$subject_tag}</p>
            <p><strong>Message:</strong><br>" . nl2br($message) . "</p>
        ";

        $mail->Body    = $email_content;
        $mail->AltBody = "Name: {$name}\nEmail: {$email}\nPhone: {$phone}\nSubject: {$subject_tag}\n\nMessage:\n{$message}";

        $mail->send();
        echo json_encode(['status' => 'success', 'message' => 'Thank you! Your message has been sent.']);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Access Denied.']);
}
?>
