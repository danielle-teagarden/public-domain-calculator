// Public Domain Calculator JavaScript
// Based on Cornell's Copyright Term and Public Domain Chart
// Created by Danielle M. Teagarden

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('calculatorForm');
    const workType = document.getElementById('workType');
    const pubYear = document.getElementById('pubYear');
    const renewed = document.getElementById('renewed');
    const renewalGroup = document.getElementById('renewalGroup');
    
    // Add event listeners
    workType.addEventListener('change', handleWorkTypeChange);
    pubYear.addEventListener('input', handlePubYearChange);
    form.addEventListener('submit', handleFormSubmit);
});

// Handle work type selection
function handleWorkTypeChange(e) {
    const type = e.target.value;
    
    // Hide all conditional sections
    document.querySelectorAll('.conditional-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show relevant section
    switch(type) {
        case 'published':
            document.getElementById('publishedOptions').style.display = 'block';
            break;
        case 'unpublished':
            document.getElementById('unpublishedOptions').style.display = 'block';
            break;
        case 'sound':
            document.getElementById('soundOptions').style.display = 'block';
            break;
        case 'foreign':
            document.getElementById('foreignOptions').style.display = 'block';
            break;
    }
    
    // Clear result
    document.getElementById('result').style.display = 'none';
}

// Handle publication year changes for renewal requirement
function handlePubYearChange(e) {
    const year = parseInt(e.target.value);
    const renewalGroup = document.getElementById('renewalGroup');
    const renewed = document.getElementById('renewed');
    
    if (year >= 1923 && year <= 1963) {
        renewalGroup.style.display = 'block';
        renewed.setAttribute('required', 'required');
    } else {
        renewalGroup.style.display = 'none';
        renewed.removeAttribute('required');
        renewed.value = 'na';
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const workType = document.getElementById('workType').value;
    let result = {};
    
    switch(workType) {
        case 'published':
            result = calculatePublishedWork();
            break;
        case 'unpublished':
            result = calculateUnpublishedWork();
            break;
        case 'sound':
            result = calculateSoundRecording();
            break;
        case 'foreign':
            result = calculateForeignWork();
            break;
        default:
            result = { status: 'error', message: 'Please select a work type' };
    }
    
    displayResult(result);
}

// Calculate public domain status for published works
function calculatePublishedWork() {
    const year = parseInt(document.getElementById('pubYear').value);
    const location = document.getElementById('pubLocation').value;
    const notice = document.getElementById('copyright').value;
    const renewed = document.getElementById('renewed').value;
    const authorType = document.getElementById('authorType').value;
    const currentYear = new Date().getFullYear();
    
    // Pre-1923 works
    if (year < 1923) {
        return {
            status: 'public-domain',
            title: '✅ In Public Domain',
            message: 'All works published before 1923 are in the public domain.',
            details: 'No copyright protection remains on this work.'
        };
    }
    
    // 1923-1925 works (recently entered public domain)
    if (year >= 1923 && year <= 1925) {
        return {
            status: 'public-domain',
            title: '✅ In Public Domain',
            message: `Works published in ${year} entered the public domain on January 1, ${year + 95}.`,
            details: 'This work is now free to use without permission.'
        };
    }
    
    // 1926-1963: Renewal required
    if (year >= 1926 && year <= 1963) {
        if (renewed === 'no') {
            return {
                status: 'public-domain',
                title: '✅ In Public Domain',
                message: 'Work published with notice but copyright was not renewed.',
                details: 'Copyright expired after initial 28-year term.'
            };
        } else if (renewed === 'yes') {
            const expirationYear = year + 95;
            if (currentYear >= expirationYear) {
                return {
                    status: 'public-domain',
                    title: '✅ In Public Domain',
                    message: `Copyright expired on January 1, ${expirationYear}.`,
                    details: 'The 95-year term has ended.'
                };
            } else {
                return {
                    status: 'protected',
                    title: '🔒 Still Protected',
                    message: `Copyright will expire on January 1, ${expirationYear}.`,
                    details: `${expirationYear - currentYear} years remaining in copyright term.`
                };
            }
        } else {
            return {
                status: 'conditional',
                title: '⚠️ Renewal Status Unknown',
                message: 'Copyright status depends on whether it was renewed.',
                details: 'Check the Copyright Office renewal records. If not renewed, it\'s in public domain. If renewed, protected until ' + (year + 95) + '.'
            };
        }
    }
    
    // 1964-1977: Automatic renewal
    if (year >= 1964 && year <= 1977) {
        const expirationYear = year + 95;
        if (currentYear >= expirationYear) {
            return {
                status: 'public-domain',
                title: '✅ In Public Domain',
                message: `Copyright expired on January 1, ${expirationYear}.`,
                details: 'The 95-year term has ended.'
            };
        } else {
            return {
                status: 'protected',
                title: '🔒 Still Protected',
                message: `Copyright will expire on January 1, ${expirationYear}.`,
                details: `${expirationYear - currentYear} years remaining. Renewal was automatic for works from this period.`
            };
        }
    }
    
    // 1978-1989: Notice still required
    if (year >= 1978 && year <= 1989) {
        if (notice === 'no') {
            return {
                status: 'public-domain',
                title: '✅ In Public Domain',
                message: 'Published without required copyright notice.',
                details: 'Unless notice was added within 5 years and registration made, the work entered public domain upon publication.'
            };
        } else {
            // Calculate based on author type
            if (authorType === 'corporate') {
                const term = Math.min(95, 120); // 95 from publication or 120 from creation
                const expirationYear = year + 95;
                return {
                    status: 'protected',
                    title: '🔒 Still Protected',
                    message: `Corporate work - copyright expires January 1, ${expirationYear}.`,
                    details: `${expirationYear - currentYear} years remaining (95 years from publication).`
                };
            } else {
                return {
                    status: 'protected',
                    title: '🔒 Still Protected',
                    message: 'Protected for life of author plus 70 years.',
                    details: 'For individual authors, copyright lasts for their lifetime plus 70 years.'
                };
            }
        }
    }
    
    // 1989-2002: Modern era
    if (year >= 1989 && year <= 2002) {
        if (authorType === 'corporate') {
            const expirationYear = year + 95;
            return {
                status: 'protected',
                title: '🔒 Still Protected',
                message: `Corporate work - copyright expires January 1, ${expirationYear}.`,
                details: `${expirationYear - currentYear} years remaining (95 years from publication).`
            };
        } else {
            return {
                status: 'protected',
                title: '🔒 Still Protected',
                message: 'Protected for life of author plus 70 years.',
                details: 'Copyright notice no longer required after March 1, 1989.'
            };
        }
    }
    
    // 2003-present
    if (year >= 2003) {
        if (authorType === 'corporate') {
            const expirationYear = year + 95;
            return {
                status: 'protected',
                title: '🔒 Still Protected',
                message: `Corporate work - copyright expires January 1, ${expirationYear}.`,
                details: `${expirationYear - currentYear} years remaining.`
            };
        } else {
            return {
                status: 'protected',
                title: '🔒 Still Protected',
                message: 'Protected for life of author plus 70 years.',
                details: 'Current copyright law provides life + 70 years protection.'
            };
        }
    }
}

// Calculate public domain status for unpublished works
function calculateUnpublishedWork() {
    const creationYear = parseInt(document.getElementById('creationYear').value);
    const deathYear = document.getElementById('authorDeath').value ? parseInt(document.getElementById('authorDeath').value) : null;
    const corporate = document.getElementById('unpubCorporate').value === 'yes';
    const currentYear = new Date().getFullYear();
    
    if (corporate) {
        // Corporate authorship: 120 years from creation
        const expirationYear = creationYear + 120;
        if (currentYear >= expirationYear) {
            return {
                status: 'public-domain',
                title: '✅ In Public Domain',
                message: `Copyright expired on January 1, ${expirationYear}.`,
                details: 'Unpublished corporate works are protected for 120 years from creation.'
            };
        } else {
            return {
                status: 'protected',
                title: '🔒 Still Protected',
                message: `Copyright expires January 1, ${expirationYear}.`,
                details: `${expirationYear - currentYear} years remaining (120 years from creation).`
            };
        }
    } else {
        // Individual authorship
        if (deathYear) {
            const expirationYear = Math.max(deathYear + 70, 2003);
            if (currentYear >= expirationYear) {
                return {
                    status: 'public-domain',
                    title: '✅ In Public Domain',
                    message: `Copyright expired on January 1, ${expirationYear}.`,
                    details: 'Protection lasted for life plus 70 years.'
                };
            } else {
                return {
                    status: 'protected',
                    title: '🔒 Still Protected',
                    message: `Copyright expires January 1, ${expirationYear}.`,
                    details: `${expirationYear - currentYear} years remaining (life + 70 years).`
                };
            }
        } else {
            return {
                status: 'protected',
                title: '🔒 Still Protected',
                message: 'Protected for life of author plus 70 years.',
                details: 'Since the author is still living, the work remains protected.'
            };
        }
    }
}

// Calculate public domain status for sound recordings
function calculateSoundRecording() {
    const year = parseInt(document.getElementById('soundYear').value);
    const published = document.getElementById('soundPublished').value === 'yes';
    const currentYear = new Date().getFullYear();
    
    // Pre-1923 recordings
    if (year < 1923) {
        return {
            status: 'public-domain',
            title: '✅ In Public Domain',
            message: 'Sound recordings from before 1923 entered public domain on January 1, 2022.',
            details: 'The Music Modernization Act brought all pre-1923 recordings into public domain.'
        };
    }
    
    // 1923-1946
    if (year >= 1923 && year <= 1946) {
        const pdYear = year + 100;
        if (currentYear >= pdYear) {
            return {
                status: 'public-domain',
                title: '✅ In Public Domain',
                message: `This recording entered public domain on January 1, ${pdYear}.`,
                details: 'Recordings from 1923-1946 receive 100 years of protection.'
            };
        } else {
            return {
                status: 'protected',
                title: '🔒 Still Protected',
                message: `Will enter public domain on January 1, ${pdYear}.`,
                details: `${pdYear - currentYear} years remaining.`
            };
        }
    }
    
    // 1947-1956
    if (year >= 1947 && year <= 1956) {
        const pdYear = year + 110;
        if (currentYear >= pdYear) {
            return {
                status: 'public-domain',
                title: '✅ In Public Domain',
                message: `This recording entered public domain on January 1, ${pdYear}.`,
                details: 'Recordings from 1947-1956 receive 110 years of protection.'
            };
        } else {
            return {
                status: 'protected',
                title: '🔒 Still Protected',
                message: `Will enter public domain on January 1, ${pdYear}.`,
                details: `${pdYear - currentYear} years remaining.`
            };
        }
    }
    
    // Post-1956
    if (year > 1956) {
        if (published && year >= 1972) {
            // Published recordings from 1972 onward follow regular copyright rules
            return {
                status: 'protected',
                title: '🔒 Still Protected',
                message: 'Post-1972 published recordings follow standard copyright terms.',
                details: 'Protected for 95 years from publication if published with notice, or life + 70 for individual creators.'
            };
        } else {
            // All pre-1972 recordings protected until at least 2047
            return {
                status: 'protected',
                title: '🔒 Still Protected',
                message: 'Will enter public domain on February 15, 2067.',
                details: 'Recordings from 1957-1972 are protected until 2067 under the Music Modernization Act.'
            };
        }
    }
}

// Calculate public domain status for foreign works
function calculateForeignWork() {
    const year = parseInt(document.getElementById('foreignYear').value);
    const country = document.getElementById('foreignCountry').value;
    
    return {
        status: 'conditional',
        title: '⚠️ Complex Analysis Required',
        message: 'Foreign works require country-specific analysis.',
        details: `Works first published in ${country} in ${year} may have different terms based on:\n` +
                 '• The country\'s copyright term at time of publication\n' +
                 '• Whether the U.S. had copyright relations with that country\n' +
                 '• Whether copyright was restored under the URAA\n' +
                 '• Current copyright treaties\n\n' +
                 'Consult a copyright attorney for foreign works.'
    };
}

// Display the result
function displayResult(result) {
    const resultSection = document.getElementById('result');
    const resultContent = document.getElementById('resultContent');
    
    // Clear previous classes
    resultSection.classList.remove('result-public-domain', 'result-protected', 'result-conditional');
    
    // Add appropriate class
    if (result.status === 'public-domain') {
        resultSection.classList.add('result-public-domain');
    } else if (result.status === 'protected') {
        resultSection.classList.add('result-protected');
    } else {
        resultSection.classList.add('result-conditional');
    }
    
    // Build result HTML
    let html = `<h4>${result.title}</h4>`;
    html += `<p style="font-size: 1.125rem; margin-bottom: 1rem;">${result.message}</p>`;
    html += `<div class="result-details">`;
    html += `<p>${result.details}</p>`;
    html += `</div>`;
    
    // Add disclaimer
    html += `<p style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid currentColor; opacity: 0.8; font-size: 0.875rem;">`;
    html += `<strong>Important:</strong> This is a general guide based on US copyright law. `;
    html += `Special circumstances may apply. For legal advice, consult a copyright attorney.`;
    html += `</p>`;
    
    resultContent.innerHTML = html;
    resultSection.style.display = 'block';
    
    // Scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}