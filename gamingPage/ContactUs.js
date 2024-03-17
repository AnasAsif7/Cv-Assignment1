
$(document).ready(function() {
    $('#contactForm').submit(function(e) {
        e.preventDefault();

        var isValid = true;

        // Validate First Name
        var firstName = $('#firstName').val();
        if (firstName.trim().length < 3) {
            alert('First Name must be at least 3 characters');
            isValid = false;
        }

        // Validate Last Name
        var lastName = $('#lastName').val();
        if (lastName.trim().length < 3) {
            alert('Last Name must be at least 3 characters');
            isValid = false;
        }

        // Validate Email
        var email = $('#email').val();
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            isValid = false;
        }

        // Validate Subject
        var subject = $('#subject').val();
        if (subject.trim().length < 5) {
            alert('Subject must be at least 5 characters long');
            isValid = false;
        }

        // Validate Message
        var message = $('#message').val();
        if (message.trim().length < 10) {
            alert('Message must be at least 10 characters long');
            isValid = false;
        }

        if (isValid) {
            this.submit();
        }
    });
});

