import React, { useState } from 'react';

export const useRoles = () => {
    const [roles, setRoles] = useState([]);

    return [roles, setRoles];
};
