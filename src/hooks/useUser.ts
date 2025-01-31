import { useState, useEffect } from 'react';
import { APICore } from '../helpers/api/apiCore';

// Define the User type
interface User {
    role: string;
    // other properties as necessary
}

export default function useUser() {
    const api = new APICore();
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null); // Explicitly set the type here

    useEffect(() => {
        const fetchUser = async () => {
            const user = await api.getLoggedInUser();
            setLoggedInUser(user); // Only update once when the component mounts
        };

        fetchUser();
    }, []); // Empty dependency array ensures this only runs once when the component mounts

    return [loggedInUser];
}

// import { APICore } from '../helpers/api/apiCore';

// export default function useUser() {
//     const api = new APICore();

//     const loggedInUser = api.getLoggedInUser();
//     return [loggedInUser];
// }
