<?php
// digiohandler.php


// Helper to sanitize input
function sanitize($str) {
    return htmlspecialchars(trim($str));
}

// Support JSON payloads (fetch) and fallback to $_POST
$input = null;
if (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) {
    $raw = file_get_contents('php://input');
    $input = json_decode($raw, true);
}

$clientName = sanitize($input['clientName'] ?? $_POST['clientName'] ?? '');
$fatherName = sanitize($input['fatherName'] ?? $_POST['fatherName'] ?? '');
$dob = sanitize($input['dob'] ?? $_POST['dob'] ?? '');
$clientId = sanitize($input['clientId'] ?? $_POST['clientId'] ?? '');
$pan = strtoupper(sanitize($input['panNumber'] ?? $_POST['panNumber'] ?? ''));
$email = filter_var($input['email'] ?? $_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);


// Validate name and email before sending to Digio
if (empty($clientName) || strlen($clientName) > 100) {
    echo json_encode([
        "success" => false,
        "message" => "Client name cannot be empty or more than 100 characters."
    ]);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        "success" => false,
        "message" => "Email is not valid."
    ]);
    exit;
}

// Prepare Digio API payload
$postData = [
    "signers" => [
        [
            "identifier" => $email,
            "name" => $clientName,
            "sign_type" => "aadhaar"
        ]
    ],
    "expire_in_days" => 10,
    "send_sign_link" => true,
    "notify_signers" => true,
    "will_self_sign" => false,
    "display_on_page" => "custom",
    "file_name" => "$clientName.pdf",
    "templates" => [
        [
            "template_key" => "TMP2512310008138647FYW92R7JMI1XW", // Use your template key
            "template_values" => [
                "pan_no" => $pan,
                "client_id" => $clientId ?: "NA",
                "name_of_client" => $clientName,
                "email_id" => $email,
                "date_of_birth" => $dob,
                // "address_of_client" => $address
            ]
        ]
    ]
];

// Digio API credentials
$apiUrl = "https://api.digio.in/v2/client/template/multi_templates/create_sign_request";
$apiKey = "Basic QUNLMjUxMjIzMTc1NjQwOTc5QVRKNDFTQlg2T1E2T0k6T0Y5VUpHR1hYU0M0QkNRUDZJWTZTV0M4WENUSjNBUkU=";

// cURL request
$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Accept: application/json",
    "Authorization: $apiKey",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);


$responseData = json_decode($response, true);

// TEMPORARY: Treat any HTTP 200 as success for frontend
if ($httpCode == 200) {
    echo json_encode([
        "success" => true,
        "details" => $responseData
    ]);
    exit;
}

// Output result (AJAX or redirect)
if ($httpCode == 200 && !empty($responseData['success'])) {
    echo json_encode([
        "success" => true,
        "details" => $responseData
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => $responseData['message'] ?? 'Unknown error',
        "details" => $responseData['details'] ?? ''
    ]);
}
?>