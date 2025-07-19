// Form validation and functionality
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.querySelector('.submit-btn');
    
    // Update current time
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    
    // Initialize dynamic name
    initializeDynamicName();
    
    // Form validation rules
    const validationRules = {
        nama: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'Nama harus diisi minimal 2 karakter dan hanya berisi huruf'
        },
        tempatLahir: {
            required: true,
            message: 'Tempat lahir harus dipilih'
        },
        jenisKelamin: {
            required: true,
            message: 'Jenis kelamin harus dipilih'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Email harus dalam format yang valid (contoh: user@domain.com)'
        },
        telepon: {
            required: true,
            pattern: /^(\+62|62|0)[0-9]{9,12}$/,
            message: 'Nomor telepon harus valid (contoh: 08123456789 atau +6281234567890)'
        },
        pesan: {
            required: true,
            minLength: 10,
            maxLength: 500,
            message: 'Pesan harus diisi minimal 10 karakter dan maksimal 500 karakter'
        }
    };
    
    // Add real-time validation to form fields
    Object.keys(validationRules).forEach(fieldName => {
        const field = document.getElementById(fieldName) || document.querySelector(`input[name="${fieldName}"]`);
        if (field) {
            if (fieldName === 'jenisKelamin') {
                // Handle radio buttons
                const radioButtons = document.querySelectorAll(`input[name="${fieldName}"]`);
                radioButtons.forEach(radio => {
                    radio.addEventListener('change', () => validateField(fieldName));
                });
            } else {
                field.addEventListener('blur', () => validateField(fieldName));
                field.addEventListener('input', () => clearError(fieldName));
            }
        }
    });
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
    
    // Validate individual field
    function validateField(fieldName) {
        const rule = validationRules[fieldName];
        const errorElement = document.getElementById(fieldName + 'Error');
        const formGroup = errorElement.closest('.form-group');
        let value = '';
        let isValid = true;
        let errorMessage = '';
        
        // Get field value based on field type
        if (fieldName === 'jenisKelamin') {
            const checkedRadio = document.querySelector(`input[name="${fieldName}"]:checked`);
            value = checkedRadio ? checkedRadio.value : '';
        } else {
            const field = document.getElementById(fieldName);
            value = field ? field.value.trim() : '';
        }
        
        // Required validation
        if (rule.required && !value) {
            isValid = false;
            errorMessage = rule.message;
        }
        
        // Pattern validation
        if (isValid && value && rule.pattern && !rule.pattern.test(value)) {
            isValid = false;
            errorMessage = rule.message;
        }
        
        // Length validation
        if (isValid && value) {
            if (rule.minLength && value.length < rule.minLength) {
                isValid = false;
                errorMessage = rule.message;
            }
            if (rule.maxLength && value.length > rule.maxLength) {
                isValid = false;
                errorMessage = rule.message;
            }
        }
        
        // Update UI
        if (isValid) {
            formGroup.classList.remove('error');
            errorElement.textContent = '';
        } else {
            formGroup.classList.add('error');
            errorElement.textContent = errorMessage;
        }
        
        return isValid;
    }
    
    // Clear error for a field
    function clearError(fieldName) {
        const errorElement = document.getElementById(fieldName + 'Error');
        const formGroup = errorElement.closest('.form-group');
        
        if (formGroup.classList.contains('error')) {
            const field = document.getElementById(fieldName);
            if (field && field.value.trim()) {
                formGroup.classList.remove('error');
                errorElement.textContent = '';
            }
        }
    }
    
    // Validate entire form
    function validateForm() {
        let isFormValid = true;
        
        Object.keys(validationRules).forEach(fieldName => {
            const isFieldValid = validateField(fieldName);
            if (!isFieldValid) {
                isFormValid = false;
            }
        });
        
        return isFormValid;
    }
    
    // Submit form
    function submitForm() {
        // Disable submit button during submission
        submitBtn.disabled = true;
        submitBtn.textContent = 'Mengirim...';
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Update display information
            updateDisplayInfo(data);
            
            // Show success message
            showSuccessMessage();
            
            // Show form submission results
            showFormResults(data);
            
            // Reset form
            form.reset();
            clearAllErrors();
            
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
        }, 1000);
    }
    
    // Update display information
    function updateDisplayInfo(data) {
        const displayTempatLahir = document.getElementById('displayTempatLahir');
        const displayJenisKelamin = document.getElementById('displayJenisKelamin');
        const displayPesan = document.getElementById('displayPesan');
        
        if (displayTempatLahir) {
            displayTempatLahir.textContent = data.tempatLahir + '/1996';
        }
        
        if (displayJenisKelamin) {
            displayJenisKelamin.textContent = data.jenisKelamin;
        }
        
        if (displayPesan) {
            displayPesan.textContent = data.pesan.substring(0, 50) + (data.pesan.length > 50 ? '...' : '');
        }
    }
    
    // Show success message
    function showSuccessMessage() {
        // Create and show a temporary success message
        const successDiv = document.createElement('div');
        successDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: #28a745;
                color: white;
                padding: 15px 20px;
                border-radius: 5px;
                z-index: 1001;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            ">
                ✓ Pesan berhasil dikirim!
            </div>
        `;
        
        document.body.appendChild(successDiv);
        
        // Remove success message after 3 seconds
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 3000);
    }
    
    // Clear all form errors
    function clearAllErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        const errorGroups = document.querySelectorAll('.form-group.error');
        
        errorElements.forEach(element => {
            element.textContent = '';
        });
        
        errorGroups.forEach(group => {
            group.classList.remove('error');
        });
    }
    
    // Update current time
    function updateCurrentTime() {
        const now = new Date();
        const timeString = now.toString();
        const currentTimeElement = document.getElementById('currentTime');
        
        if (currentTimeElement) {
            currentTimeElement.textContent = timeString;
        }
    }
    
    // Smooth scrolling for navigation links (only for internal links starting with #)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Only prevent default and handle smooth scrolling for internal links (starting with #)
            if (targetId.startsWith('#')) {
                e.preventDefault();
                
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Update active navigation
                    document.querySelectorAll('.nav-link').forEach(navLink => {
                        navLink.classList.remove('active');
                    });
                    this.classList.add('active');
                    
                    // Smooth scroll to section
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
            // For external links (like profile.html), let the browser handle navigation normally
        });
    });
    
    // Update active navigation on scroll
    window.addEventListener('scroll', function() {
        const sections = ['home', 'profile', 'contact', 'portfolio'];
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            const navLink = document.querySelector(`a[href="#${sectionId}"]`);
            
            if (section && navLink) {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    navLink.classList.add('active');
                }
            }
        });
    });
});

// Dynamic Name Functions
function initializeDynamicName() {
    const savedName = localStorage.getItem('userName') || 'Bayu';
    const nameInput = document.getElementById('nameInput');
    const dynamicName = document.getElementById('dynamicName');
    
    if (nameInput) {
        nameInput.value = savedName;
    }
    if (dynamicName) {
        dynamicName.textContent = savedName;
    }
}

function updateName() {
    const nameInput = document.getElementById('nameInput');
    const dynamicName = document.getElementById('dynamicName');
    
    if (nameInput && dynamicName) {
        const newName = nameInput.value.trim() || 'Bayu';
        dynamicName.textContent = newName;
        
        // Save to localStorage
        localStorage.setItem('userName', newName);
        
        // Show update notification
        showUpdateNotification('Nama berhasil diupdate!');
    }
}

function showUpdateNotification(message) {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 100px;
            right: 20px;
            background-color: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1001;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        ">
            ✓ ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 2000);
}

function showFormResults(data) {
    // Create results modal
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div id="formResultsModal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1002;
        ">
            <div style="
                background-color: white;
                padding: 40px;
                border-radius: 10px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            ">
                <h2 style="margin-bottom: 20px; color: #333; text-align: center;">Data yang Disubmit</h2>
                <div style="margin-bottom: 20px;">
                    <div style="margin-bottom: 15px;">
                        <strong>Nama:</strong> ${data.nama}
                    </div>
                    <div style="margin-bottom: 15px;">
                        <strong>Tempat Lahir:</strong> ${data.tempatLahir}
                    </div>
                    <div style="margin-bottom: 15px;">
                        <strong>Jenis Kelamin:</strong> ${data.jenisKelamin}
                    </div>
                    <div style="margin-bottom: 15px;">
                        <strong>Email:</strong> ${data.email}
                    </div>
                    <div style="margin-bottom: 15px;">
                        <strong>Nomor Telepon:</strong> ${data.telepon}
                    </div>
                    <div style="margin-bottom: 15px;">
                        <strong>Pesan:</strong><br>
                        <div style="background-color: #f8f9fa; padding: 10px; border-radius: 5px; margin-top: 5px;">
                            ${data.pesan}
                        </div>
                    </div>
                </div>
                <div style="text-align: center;">
                    <button onclick="closeFormResults()" style="
                        background-color: #007bff;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 16px;
                    ">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeFormResults() {
    const modal = document.getElementById('formResultsModal');
    if (modal) {
        document.body.removeChild(modal);
    }
}
