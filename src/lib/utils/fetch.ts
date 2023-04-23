export function post(endpoint: string, data: any) {
    return fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data || {}),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((res) => res.json())
        .then((res) => res)
}
