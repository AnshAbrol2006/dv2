document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const storedData = localStorage.getItem('formData');


    if (storedData) {
        const data = JSON.parse(storedData);
        Object.keys(data).forEach(key => {
            const element = form.elements[key];
            if (element.type === 'radio') {
                document.querySelector(`input[name="${key}"][value="${data[key]}"]`).checked = true;
            } else if (element.type === 'checkbox') {
                element.checked = data[key];
            } else {
                element.value = data[key];
            }
        });
    }


    form.addEventListener('input', (e) => {
        const formData = {
            name: form.name.value,
            email: form.email.value,
            phone: form.phone.value,
            bitsId: form.bitsId.value,
            hostel: form.hostel.value,
            size: form.size.value,
            terms: form.terms.checked
        };
        localStorage.setItem('formData', JSON.stringify(formData));
    });


    form.addEventListener('submit', handleSubmit);

    
    form.addEventListener('reset', handleReset);
});


function validateEmail(email) {
    const regex = /^f(201[6-9]|202[0-4])\d{4}@(pilani|goa|hyderabad)\.bits-pilani\.ac\.in$/;
    return regex.test(email);
}

function validateBITSId(bitsId) {
    const regex = /^20(1[6-9]|2[0-4])(A[1-8]|AA)(PS|TS)\d{4}$/;
    return regex.test(bitsId);
}

function validatePhone(phone) {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(phone);
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}


function clearErrors() {
    document.querySelectorAll('.error').forEach(error => {
        error.style.display = 'none';
    });
}


async function handleSubmit(e) {
    e.preventDefault();
    clearErrors();

    const form = e.target;
    const formData = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        bitsId: form.bitsId.value.trim(),
        hostel: form.hostel.value,
        size: form.size.value,
        terms: form.terms.checked
    };

    let isValid = true;


    if (formData.name.length < 5 || formData.name.length > 50) {
        showError('name-error', 'Name must be 5-50 characters');
        isValid = false;
    }


    if (!validateEmail(formData.email)) {
        showError('email-error', 'Invalid BITS email');
        isValid = false;
    }


    if (!validatePhone(formData.phone)) {
        showError('phone-error', 'Invalid Indian phone number');
        isValid = false;
    }

    
    if (!validateBITSId(formData.bitsId)) {
        showError('bitsId-error', 'Invalid BITS ID');
        isValid = false;
    }

    if (!formData.hostel) {
        showError('hostel-error', 'Please select a hostel');
        isValid = false;
    }

    if (!formData.size) {
        showError('size-error', 'Please select a size');
        isValid = false;
    }


    if (!formData.terms) {
        showError('terms-error', 'You must agree to terms');
        isValid = false;
    }
    if (!isValid) return;


    const submissions = JSON.parse(localStorage.getItem('submissions')) || [];
    const exists = submissions.some(sub => 
        sub.email === formData.email || sub.bitsId === formData.bitsId
    );

    if (exists) {
        alert('You have already submitted the form!');
        return;
    }


    submissions.push(formData);
    localStorage.setItem('submissions', JSON.stringify(submissions));


    try {
        await fetch('https://www.foo.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
    } catch (error) {
        console.error('Error submitting form:', error);
    }
    localStorage.removeItem('formData');


    window.location.href = 'confirmation.html';
}


function handleReset() {
    localStorage.removeItem('formData');
    clearErrors();
}