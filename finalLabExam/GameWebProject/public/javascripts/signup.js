$(document).ready(function() {
    $('#signupForm').submit(function(e) {
        e.preventDefault(); 

        var isValid = true; 

        
        var username = $('#username').val();
        if(username.length < 3) {
            alert('Username must be at least 3 characters long');
            isValid = false; 
        }

        
        var email = $('#email').val();
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            isValid = false; 
        }

        
        var password = $('#password').val();
        if(password.length < 6) {
            alert('Password must be at least 6 characters long');
            isValid = false; 
        }

        
        var confirmPassword = $('#confirmPassword').val();
        if(password !== confirmPassword) {
            alert('Passwords do not match');
            isValid = false; 
        }

        
        var phone = $('#phone').val();
        var phoneRegex = /^(03)[0-9]{9}$/;
        
        if (!phoneRegex.test(phone)) {
            alert('Please enter a valid phone number');
            isValid = false;
        }
        
        

        
        if(isValid) {
            this.submit(); 
        }
    });
});
