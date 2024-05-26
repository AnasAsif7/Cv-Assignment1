// $(document).ready(function() {
//     $('#contactForm').submit(function(e) {
//         e.preventDefault();

//         var isValid = true;

//         var firstName = $('#firstName').val();
//         if (firstName.trim().length < 3) {
//             alert('First Name must be at least 3 characters');
//             isValid = false;
//         }

//         var lastName = $('#lastName').val();
//         if (lastName.trim().length < 3) {
//             alert('Last Name must be at least 3 characters');
//             isValid = false;
//         }

//         var email = $('#email').val();
//         var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//             alert('Please enter a valid email address');
//             isValid = false;
//         }

//         var subject = $('#subject').val();
//         if (subject.trim().length < 5) {
//             alert('Subject must be at least 5 characters long');
//             isValid = false;
//         }

//         var message = $('#message').val();
//         if (message.trim().length < 10) {
//             alert('Message must be at least 10 characters long');
//             isValid = false;
//         }

//         if (isValid) {
//             const contactData = {
//                 firstName: $('#firstName').val(),
//                 lastName: $('#lastName').val(),
//                 email: $('#email').val(),
//                 subject: $('#subject').val(),
//                 message: $('#message').val(),
//             };

//             $.ajax({
//                 url: '/contact',
//                 method: 'POST',
//                 contentType: 'application/json',
//                 data: JSON.stringify(contactData),
//                 success: function(response) {
//                     console.log(response);
//                     alert('Message sent successfully');
//                     $('#contactForm')[0].reset();
//                 },
//                 error: function(error) {
//                     console.error(error);
//                     alert('Error sending message');
//                 }
//             });
//         }
//     });
// });

$(document).ready(function() {
    $('#contactForm').submit(function(e) {
        e.preventDefault();

        var isValid = true;

        var firstName = $('#firstName').val();
        if (firstName.trim().length < 3) {
            alert('First Name must be at least 3 characters');
            isValid = false;
        }

        var lastName = $('#lastName').val();
        if (lastName.trim().length < 3) {
            alert('Last Name must be at least 3 characters');
            isValid = false;
        }

        var email = $('#email').val();
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            isValid = false;
        }

        var subject = $('#subject').val();
        if (subject.trim().length < 5) {
            alert('Subject must be at least 5 characters long');
            isValid = false;
        }

        var message = $('#message').val();
        if (message.trim().length < 10) {
            alert('Message must be at least 10 characters long');
            isValid = false;
        }

        if (isValid) {
            const contactData = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                subject: subject,
                message: message,
            };

            $.ajax({
                url: '/contact',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(contactData),
                success: function(response) {
                    console.log(response);
                    alert('Message sent successfully');
                    $('#contactForm')[0].reset();
                },
                error: function(error) {
                    console.error(error);
                    alert('Error sending message');
                }
            });
        }
    });
});
