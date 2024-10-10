<template>
    <div class="about">
      <h1>This is an Admin page</h1>
    </div>
</template>

<script>
import { jwtDecode } from 'jwt-decode';

export default {
    beforeRouteEnter(to, from, next) {
        const token = localStorage.getItem('token');
        if (!token) {
            next({ name: 'login' });
        } else {
            const decodedToken = jwtDecode(token);
            if (decodedToken.role !== 'admin') {
                next({ name: 'forbidden' }); 
            } else {
                next();
            }
        }
    },
};
</script>

