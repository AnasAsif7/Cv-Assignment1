$(document).ready(function() {
    $('#signupForm').submit(function(e) {
        e.preventDefault(); // Always prevent the default first

        var isValid = true; // Variable to keep track of overall form validity

        // Validate Username
        var username = $('#username').val();
        if(username.length < 3) {
            alert('Username must be at least 3 characters long');
            isValid = false; // Update the form validity
        }

        // Validate Email
        var email = $('#email').val();
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            isValid = false; // Update the form validity
        }

        // Validate Password
        var password = $('#password').val();
        if(password.length < 6) {
            alert('Password must be at least 6 characters long');
            isValid = false; // Update the form validity
        }

        // Validate Confirm Password
        var confirmPassword = $('#confirmPassword').val();
        if(password !== confirmPassword) {
            alert('Passwords do not match');
            isValid = false; // Update the form validity
        }

        // Validate Phone Number
        var phone = $('#phone').val();
        var phoneRegex = /^[0-9]{10}$/;
        if(!phoneRegex.test(phone)) {
            alert('Please enter a valid 10-digit phone number');
            isValid = false; // Update the form validity
        }

        // If all validations pass, submit the form
        if(isValid) {
            this.submit(); // Use the native submit function of the form
        }
    });
});
