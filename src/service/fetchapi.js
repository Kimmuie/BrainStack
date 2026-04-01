export const fetchAPI = async (endpoint, method = 'GET', body = null) => {
    const api_key = import.meta.env.API_KEY;
    const base_url = `http://localhost:3000/Brainstack_test`;

    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        if (body) options.body = JSON.stringify(body);

        const response = await fetch(base_url + endpoint, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        alert('❌ เชื่อมต่อ server ไม่ได้: ' + error.message);
    }
};