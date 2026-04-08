export const fetchAPI = async (endpoint, method = 'GET', body = null) => {
    const base_url = `http://localhost:3000/Brainstack`;

    try {   
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        if (body) options.body = JSON.stringify(body);

        const response = await fetch(base_url + endpoint, options);
console.log('Calling:', base_url + endpoint);
// Should print: http://localhost:3000/Brainstack/users/someone@example.com
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};